import { readdir } from 'fs/promises';

interface Site {
  name: string;
  port: number | null;
}

interface PortStats {
  min: number | null;
  max: number | null;
  total: number;
  withPorts: number;
  withoutPorts: number;
}

interface NginxSitesResult {
  sites: Site[];
  stats: PortStats;
  success: boolean;
  error?: string;
}

async function sortServer(): Promise<NginxSitesResult> {
  try {
    // Read sites-enabled directory
    const sitesPath = '/etc/nginx/sites-enabled';
    const files = await readdir(sitesPath);
    
    // Parse sites and ports
    const siteObjects: Site[] = files.map(site => ({
      name: site,
      port: site.match(/_(\d+)$/)?.length ? parseInt(site.match(/_(\d+)$/)?.[1] || '0') : null
    }));

    // Sort sites
    const sortedSites = siteObjects.sort((a, b) => {
      if (a.port === null && b.port === null) return a.name.localeCompare(b.name);
      if (a.port === null) return 1;
      if (b.port === null) return -1;
      return a.port - b.port;
    });

    // Calculate stats
    const ports = sortedSites
      .map(site => site.port)
      .filter((port): port is number => port !== null);

    const stats: PortStats = {
      min: ports.length ? Math.min(...ports) : null,
      max: ports.length ? Math.max(...ports) : null,
      total: sortedSites.length,
      withPorts: ports.length,
      withoutPorts: sortedSites.length - ports.length
    };

    return {
      sites: sortedSites,
      stats,
      success: true
    };

  } catch (error) {
    return {
      sites: [],
      stats: {
        min: null,
        max: null,
        total: 0,
        withPorts: 0,
        withoutPorts: 0
      },
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Example usage
async function main() {
  const result = await sortServer();
  console.log(JSON.stringify(result, null, 2));
}

// Run if called directly
if (require.main === module) {
  main();
}

// Export for module usage
export { sortServer , type NginxSitesResult, type PortStats, type Site };
