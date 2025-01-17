/* eslint-disable @typescript-eslint/no-explicit-any */
interface PM2App {
    name: string;
    script: string;
    args: string;
    exec_mode: string;
    instances: number;
    env: Record<string, any>;
    error_file: string;
    out_file: string;
    log_date_format: string;
    max_memory_restart: string;
    autorestart: boolean;
    watch: boolean;
    wait_ready: boolean;
    restart_delay: number;
    merge_logs: boolean;
    time: boolean;
    max_size: string;
    retain: number;
    compress: boolean;
    cwd: string;
    source_map_support: boolean;
}

interface PM2Config {
    apps: PM2App[];
}

export type { PM2App, PM2Config }