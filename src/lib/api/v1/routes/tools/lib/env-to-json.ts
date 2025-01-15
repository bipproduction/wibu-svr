interface EnvToJsonResult {
    data?: Record<string, string>;
    error?: string;
}

/**
 * Converts environment file content to a JSON object
 * @param {Object} params - The parameters object
 * @param {string} params.envText - The environment file content as string
 * @returns {Promise<EnvToJsonResult>} Object containing either parsed data or error
 */
async function envToJson({ envText }: { envText: string }): Promise<EnvToJsonResult> {
    // Input validation
    if (!envText || typeof envText !== 'string') {
        return {
            error: 'Invalid input: Environment text must be a non-empty string'
        };
    }

    try {
        const mapData: Record<string, string> = {};

        // Normalisasi line endings
        const lines = envText.replace(/\r\n/g, '\n').split('\n');

        for (const line of lines) {
            // Skip empty lines and comments
            const trimmedLine = line.trim();
            if (!trimmedLine || trimmedLine.startsWith('#')) {
                continue;
            }

            // Find the first '=' to handle values that might contain '='
            const equalIndex = trimmedLine.indexOf('=');
            if (equalIndex === -1) {
                continue; // Skip invalid lines
            }

            const key = trimmedLine.slice(0, equalIndex).trim();
            const value = trimmedLine.slice(equalIndex + 1).trim();

            // Skip if key is empty
            if (!key) {
                continue;
            }

            // Tambahan validasi untuk karakter yang tidak valid pada key
            if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
                continue; // Skip key yang tidak valid
            }

            // Handle escaped quotes dalam value
            const cleanValue = value
                .replace(/^["']|["']$/g, '')
                .replace(/\\(['"\\])/g, '$1');

            // Store in map
            mapData[key] = cleanValue;
        }

        // Check if any data was parsed
        if (Object.keys(mapData).length === 0) {
            return {
                error: 'No valid environment variables found'
            };
        }

        return {
            data: mapData
        };
    } catch (error) {
        // Log error for debugging (use your preferred logging solution)
        console.error('Error parsing environment file:', error);
        
        return {
            error: 'Failed to parse environment file'
        };
    }
}

export default envToJson;