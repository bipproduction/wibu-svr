module.exports = {
    apps: [
      {
        name: "sistem-desa-mandiri-5001",
        script: "bun",
        args: "next start -p 5001",
        cwd: "/root/projects/sistem-desa-mandiri",
        env: {
          NODE_ENV: "production"
        },
        exec_mode: "fork",
        max_memory_restart: "2G",
        autorestart: true,
        error_file: "/root/logs/sistem-desa-mandiri-5001_error.log",
        out_file: "/root/logs/sistem-desa-mandiri-5001_out.log",
        merge_logs: true,
        namespace: "sistem-desa-mandiri"
      },
      {
        name: "sistem-desa-mandiri-5002", 
        script: "bun",
        args: "next start -p 5002",
        cwd: "/root/projects/sistem-desa-mandiri",
        env: {
          NODE_ENV: "production"
        },
        exec_mode: "fork",
        max_memory_restart: "2G",
        autorestart: true,
        error_file: "/root/logs/sistem-desa-mandiri-5002_error.log",
        out_file: "/root/logs/sistem-desa-mandiri-5002_out.log",
        merge_logs: true,
        namespace: "sistem-desa-mandiri"
      },
      {
        name: "sistem-desa-mandiri-5003",
        script: "bun",
        args: "next start -p 5003",
        cwd: "/root/projects/sistem-desa-mandiri",
        env: {
          NODE_ENV: "production"
        },
        exec_mode: "fork",
        max_memory_restart: "2G",
        autorestart: true,
        error_file: "/root/logs/sistem-desa-mandiri-5003_error.log", 
        out_file: "/root/logs/sistem-desa-mandiri-5003_out.log",
        merge_logs: true,
        namespace: "sistem-desa-mandiri"
      },
      {
        name: "sistem-desa-mandiri-5004",
        script: "bun",
        args: "next start -p 5004",
        cwd: "/root/projects/sistem-desa-mandiri",
        env: {
          NODE_ENV: "production"
        },
        exec_mode: "fork",
        max_memory_restart: "2G",
        autorestart: true,
        error_file: "/root/logs/sistem-desa-mandiri-5004_error.log",
        out_file: "/root/logs/sistem-desa-mandiri-5004_out.log",
        merge_logs: true,
        namespace: "sistem-desa-mandiri"
      }
    ]
  }