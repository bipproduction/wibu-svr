// Define interfaces for the configuration structure
interface NginxMapping {
    variable: string;
    mappings: Record<string, string>;
}

interface UpstreamConfig {
    config: Record<string, string>;
    servers: string[];
}

interface NginxConfig {
    maps: Record<string, NginxMapping>;
    upstreams: Record<string, UpstreamConfig>;
}

// Tambahkan konstanta untuk konfigurasi default
const DEFAULT_CONFIG = {
    KEEPALIVE: '32',
    KEEPALIVE_REQUESTS: '200',
    KEEPALIVE_TIMEOUT: '120'
} as const;

// Tambahkan error custom
class NginxConfigError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NginxConfigError';
    }
}

/**
 * Parses Nginx configuration text to JSON format
 * @param configText - The Nginx configuration text
 * @returns Parsed configuration as JSON
 */
function sanitizeNginxString(input: string): string {
    if (!input) throw new NginxConfigError('Input string tidak boleh kosong');
    // Tambahkan validasi karakter yang diperbolehkan
    if (!/^[a-zA-Z0-9_\-.:/ ]+$/.test(input)) {
        throw new NginxConfigError('Input mengandung karakter yang tidak diizinkan');
    }
    return input;
}

function parseNginxConfigToJson(configText: string): NginxConfig {
    const result: NginxConfig = {
        maps: {},
        upstreams: {}
    };

    // Split config into lines and remove comments and empty lines
    const lines: string[] = configText.split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#'));

    let currentBlock: 'map' | 'upstream' | null = null;
    let currentBlockName: string | null = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Parse map block dengan regex yang lebih fleksibel
        if (line.startsWith('map')) {
            // Memperbaiki regex untuk menangkap nama variabel dengan lebih baik
            const mapMatch = line.match(/map\s+\$(\w+)\s+\$(\w+)\s*\{/);
            if (mapMatch) {
                currentBlock = 'map';
                currentBlockName = mapMatch[2];
                result.maps[currentBlockName] = {
                    variable: mapMatch[1],
                    mappings: {}
                };
            }
        }
        // Parse upstream block
        else if (line.startsWith('upstream')) {
            const upstreamMatch = line.match(/upstream\s+([^\s{]+)\s*\{/);
            if (upstreamMatch) {
                currentBlock = 'upstream';
                currentBlockName = upstreamMatch[1];
                result.upstreams[currentBlockName] = {
                    config: {},
                    servers: []
                };
            }
        }
        // Parse block contents
        else if (line !== '}') {
            if (currentBlock === 'map' && currentBlockName) {
                // Memperbaiki regex untuk menangkap mapping dengan lebih fleksibel
                const mapEntryMatch = line.match(/["']?([^"'\s;]+)["']?\s+["']?([^"'\s;]+)["']?\s*;/);
                if (mapEntryMatch) {
                    result.maps[currentBlockName].mappings[mapEntryMatch[1]] = mapEntryMatch[2];
                }
            }
            else if (currentBlock === 'upstream' && currentBlockName) {
                if (line.startsWith('server')) {
                    const serverMatch = line.match(/server\s+([^;]+);/);
                    if (serverMatch) {
                        result.upstreams[currentBlockName].servers.push(
                            sanitizeNginxString(serverMatch[1])
                        );
                    }
                } else {
                    const configMatch = line.match(/(\w+)\s+([^;]+);/);
                    if (configMatch) {
                        result.upstreams[currentBlockName].config[configMatch[1]] = configMatch[2];
                    }
                }
            }
        }
        // Reset current block on closing brace
        else if (line === '}') {
            currentBlock = null;
            currentBlockName = null;
        }
    }

    return result;
}

interface ValidationRules {
    allowedUpstreamConfigs: string[];
}

const NGINX_VALIDATION: ValidationRules = {
    allowedUpstreamConfigs: ['least_conn', 'keepalive', 'keepalive_requests', 'keepalive_timeout']
};

function validateUpstreamConfig(config: Record<string, string>): void {
    for (const key of Object.keys(config)) {
        if (!NGINX_VALIDATION.allowedUpstreamConfigs.includes(key)) {
            throw new Error(`Konfigurasi upstream tidak valid: ${key}`);
        }
    }
}

/**
 * Generates Nginx configuration text from JSON
 * @param configJson - The configuration in JSON format
 * @returns Generated Nginx configuration
 */
function generateNginxConfig(configJson: NginxConfig): string {
    // Validasi sebelum generate
    for (const upstreamData of Object.values(configJson.upstreams)) {
        validateUpstreamConfig(upstreamData.config);
    }

    let config = '';
    // Generate maps
    for (const [mapName, mapData] of Object.entries(configJson.maps)) {
        config += `map $${mapData.variable} $${mapName} {\n`;
        const maxKeyLength = Math.max(...Object.values(mapData.mappings).map(value => value.length));
        for (const [key, value] of Object.entries(mapData.mappings)) {
            config += `${key.padStart(key.length + 4).padEnd(maxKeyLength + 4)} ${value};\n`;
        }
        config += '}\n\n';
    }

    // Generate upstreams
    for (const [upstreamName, upstreamData] of Object.entries(configJson.upstreams)) {
        config += `upstream ${upstreamName} {\n`;

        // Add configuration
        for (const [key, value] of Object.entries(upstreamData.config)) {
            // Khusus untuk least_conn, tidak perlu menambahkan nilai
            if (key === 'least_conn') {
                config += `    ${key};\n`;
            } else {
                config += `    ${key.padEnd(15)} ${value};\n`;
            }
        }

        // Add servers
        for (const server of upstreamData.servers) {
            config += `    server ${server};\n`;
        }

        config += '}\n\n';
    }

    return config.trim();
}


// Interface untuk format output yang diinginkan
interface SubdomainPort {
    id: string;
    domainId: string;
    name: string;
    ports: number[];
}

interface SubdomainConfig {
    subdomains: SubdomainPort[];
}

// Fungsi untuk mengekstrak port dari string server
function extractPorts(servers: string[]): number[] {
    return servers.map(server => {
        const portMatch = server.match(/:(\d+)/);
        if (!portMatch) {
            throw new NginxConfigError(`Format server tidak valid: ${server}`);
        }
        const port = parseInt(portMatch[1]);
        if (port < 1 || port > 65535) {
            throw new NginxConfigError(`Port tidak valid: ${port}`);
        }
        return port;
    });
}

// Fungsi untuk mengubah format nginx ke format subdomain
function transformToSubdomainFormat(nginxConfig: NginxConfig): SubdomainConfig {
    const subdomains: SubdomainPort[] = [];

    // Mengambil map pertama dan nama variabelnya
    const firstMap = Object.entries(nginxConfig.maps)[0];
    if (!firstMap) {
        throw new NginxConfigError('Tidak ada map configuration yang ditemukan');
    }

    const [mapName, mapData] = firstMap;
    const mappings = mapData.mappings;

    // Iterasi setiap mapping untuk membuat subdomain entry
    for (const [key, value] of Object.entries(mappings)) {
        const upstreamConfig = nginxConfig.upstreams[value];
        if (upstreamConfig) {
            subdomains.push({
                id: key,
                domainId: mapName, // Menggunakan nama map sebagai domainId
                name: key,
                ports: extractPorts(upstreamConfig.servers)
            });
        }
    }

    return { subdomains };
}

/**
 * Parses Nginx configuration text to Subdomain JSON format
 * @param configText - The Nginx configuration text
 * @returns Parsed configuration in Subdomain format
 */
function parseNginxToSubdomainJson(configText: string): SubdomainConfig {
    const nginxConfig = parseNginxConfigToJson(configText);
    return transformToSubdomainFormat(nginxConfig);
}

// Fungsi untuk menghasilkan konfigurasi Nginx dari format subdomain
function generateNginxFromSubdomain(config: SubdomainConfig): string {
    try {
        if (!config.subdomains?.length) {
            throw new NginxConfigError('Subdomain config tidak boleh kosong');
        }

        // Mengambil domainId dari subdomain pertama
        const domainId = config.subdomains[0].domainId;

        const nginxConfig: NginxConfig = {
            maps: {
                [domainId]: {  // Menggunakan domainId yang dinamis
                    variable: 'subdomain',
                    mappings: {}
                }
            },
            upstreams: {}
        };

        config.subdomains.forEach(subdomain => {
            const upstreamName = `${sanitizeNginxString(subdomain.name)}_backend`;

            // Menggunakan domainId yang dinamis untuk mappings
            nginxConfig.maps[domainId].mappings[subdomain.id] = upstreamName;
            nginxConfig.upstreams[upstreamName] = {
                config: {
                    'least_conn': '',
                    'keepalive': DEFAULT_CONFIG.KEEPALIVE,
                    'keepalive_requests': DEFAULT_CONFIG.KEEPALIVE_REQUESTS,
                    'keepalive_timeout': DEFAULT_CONFIG.KEEPALIVE_TIMEOUT
                },
                servers: subdomain.ports.map(port => `localhost:${port}`)
            };
        });

        return generateNginxConfig(nginxConfig);
    } catch (error) {
        if (error instanceof NginxConfigError) {
            throw error;
        }
        throw new NginxConfigError(`Gagal generate nginx config: ${error}`);
    }
}

export {
    parseNginxToSubdomainJson,
    generateNginxFromSubdomain,
    type SubdomainConfig,
    type SubdomainPort
};