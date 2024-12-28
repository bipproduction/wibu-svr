const pm2Jlist = {
    "pid": 1698183,
    "name": "ninox-fox_3011",
    "pm2_env": {
        "namespace": "default",
        "kill_retry_time": 100,
        "windowsHide": true,
        "username": "root",
        "treekill": true,
        "automation": true,
        "pmx": true,
        "instance_var": "NODE_APP_INSTANCE",
        "exec_mode": "cluster_mode",
        "autorestart": true,
        "autostart": true,
        "vizion": true,
        "instances": 1,
        "env": {
            "ninox-fox_3011": "{}",
            "PM2_HOME": "/root/.pm2",
            "NODE_ENV": "production",
            "PM2_JSON_PROCESSING": "true",
            "PM2_USAGE": "CLI",
            "OLDPWD": "/root/projects/wa-server",
            "_": "/root/.nvm/versions/node/v20.18.0/bin/pm2",
            "SSH_TTY": "/dev/pts/2",
            "NVM_BIN": "/root/.nvm/versions/node/v20.18.0/bin",
            "DBUS_SESSION_BUS_ADDRESS": "unix:path=/run/user/0/bus",
            "PATH": "/root/.nvm/versions/node/v20.18.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
            "LC_ALL": "en_US.UTF-8",
            "SSH_CLIENT": "103.109.158.166 50748 22",
            "XDG_RUNTIME_DIR": "/run/user/0",
            "LC_CTYPE": "UTF-8",
            "XDG_SESSION_ID": "21259",
            "NVM_CD_FLAGS": "",
            "SHLVL": "1",
            "USER": "root",
            "TERM": "xterm-256color",
            "XDG_SESSION_CLASS": "user",
            "NVM_DIR": "/root/.nvm",
            "SSH_CONNECTION": "103.109.158.166 50748 85.31.224.193 22",
            "LANG": "en_US.UTF-8",
            "HOME": "/root",
            "MOTD_SHOWN": "pam",
            "XDG_SESSION_TYPE": "tty",
            "LOGNAME": "root",
            "PWD": "/root/projects/ninox-fox",
            "LANGUAGE": "en_US.UTF-8",
            "NVM_INC": "/root/.nvm/versions/node/v20.18.0/include/node",
            "SHELL": "/bin/bash",
            "unique_id": "19fe282b-fa8a-4917-86ab-4ae1a37f3c71"
        },
        "args": [
            "start",
            "-p",
            "3011"
        ],
        "cwd": "/root/projects/ninox-fox",
        "name": "ninox-fox_3011",
        "node_args": [],
        "pm_exec_path": "/root/.nvm/versions/node/v20.18.0/bin/yarn",
        "pm_cwd": "/root/projects/ninox-fox",
        "exec_interpreter": "node",
        "pm_out_log_path": "/root/.pm2/logs/ninox-fox-3011-out-0.log",
        "pm_err_log_path": "/root/.pm2/logs/ninox-fox-3011-error-0.log",
        "pm_pid_path": "/root/.pm2/pids/ninox-fox-0.pid",
        "km_link": false,
        "vizion_running": false,
        "NODE_APP_INSTANCE": 0,
        "ninox-fox_3011": "{}",
        "PM2_HOME": "/root/.pm2",
        "NODE_ENV": "production",
        "PM2_JSON_PROCESSING": "true",
        "PM2_USAGE": "CLI",
        "OLDPWD": "/root/projects/wa-server",
        "_": "/root/.nvm/versions/node/v20.18.0/bin/pm2",
        "SSH_TTY": "/dev/pts/2",
        "NVM_BIN": "/root/.nvm/versions/node/v20.18.0/bin",
        "DBUS_SESSION_BUS_ADDRESS": "unix:path=/run/user/0/bus",
        "PATH": "/root/.nvm/versions/node/v20.18.0/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
        "LC_ALL": "en_US.UTF-8",
        "SSH_CLIENT": "103.109.158.166 50748 22",
        "XDG_RUNTIME_DIR": "/run/user/0",
        "LC_CTYPE": "UTF-8",
        "XDG_SESSION_ID": "21259",
        "NVM_CD_FLAGS": "",
        "SHLVL": "1",
        "USER": "root",
        "TERM": "xterm-256color",
        "XDG_SESSION_CLASS": "user",
        "NVM_DIR": "/root/.nvm",
        "SSH_CONNECTION": "103.109.158.166 50748 85.31.224.193 22",
        "LANG": "en_US.UTF-8",
        "HOME": "/root",
        "MOTD_SHOWN": "pam",
        "XDG_SESSION_TYPE": "tty",
        "LOGNAME": "root",
        "PWD": "/root/projects/ninox-fox",
        "LANGUAGE": "en_US.UTF-8",
        "NVM_INC": "/root/.nvm/versions/node/v20.18.0/include/node",
        "SHELL": "/bin/bash",
        "unique_id": "19fe282b-fa8a-4917-86ab-4ae1a37f3c71",
        "status": "online",
        "pm_uptime": 1728280102224,
        "axm_actions": [
            {
                "action_name": "km:heapdump",
                "action_type": "internal",
                "arity": 2
            },
            {
                "action_name": "km:cpu:profiling:start",
                "action_type": "internal",
                "arity": 2
            },
            {
                "action_name": "km:cpu:profiling:stop",
                "action_type": "internal",
                "arity": 1
            },
            {
                "action_name": "km:heap:sampling:start",
                "action_type": "internal",
                "arity": 2
            },
            {
                "action_name": "km:heap:sampling:stop",
                "action_type": "internal",
                "arity": 1
            }
        ],
        "axm_monitor": {
            "Used Heap Size": {
                "value": "27.85",
                "type": "internal/v8/heap/used",
                "unit": "MiB",
                "historic": true
            },
            "Heap Usage": {
                "value": 95.48,
                "type": "internal/v8/heap/usage",
                "unit": "%",
                "historic": true
            },
            "Heap Size": {
                "value": "29.17",
                "type": "internal/v8/heap/total",
                "unit": "MiB",
                "historic": true
            },
            "Event Loop Latency p95": {
                "value": "1.08",
                "type": "internal/libuv/latency/p95",
                "unit": "ms",
                "historic": true
            },
            "Event Loop Latency": {
                "value": "0.43",
                "type": "internal/libuv/latency/p50",
                "unit": "ms",
                "historic": true
            },
            "Active handles": {
                "value": 3,
                "type": "internal/libuv/handles",
                "historic": true
            },
            "Active requests": {
                "value": 0,
                "type": "internal/libuv/requests",
                "historic": true
            }
        },
        "axm_options": {
            "error": true,
            "heapdump": true,
            "feature.profiler.heapsnapshot": false,
            "feature.profiler.heapsampling": true,
            "feature.profiler.cpu_js": true,
            "latency": true,
            "catchExceptions": true,
            "profiling": true,
            "metrics": {
                "http": true,
                "runtime": true,
                "eventLoop": true,
                "network": false,
                "v8": true
            },
            "standalone": false,
            "module_conf": {},
            "apm": {
                "version": "6.0.1",
                "type": "node"
            },
            "module_name": "ninox-fox_3011",
            "module_version": "5.4.2"
        },
        "axm_dynamic": {},
        "created_at": 1728280102224,
        "pm_id": 0,
        "restart_time": 0,
        "unstable_restarts": 0,
        "_pm2_version": "5.4.2",
        "version": "N/A",
        "node_version": "20.18.0",
        "versioning": {
            "type": "git",
            "url": "https://github.com/bipproduction/ninox-fox.git",
            "revision": "975b322c22725d3e7c58f531a6f66387b28f101b",
            "comment": "Merge branch 'build' of https://github.com/bipproduction/ninox-fox into svr-build\n",
            "unstaged": true,
            "branch": "svr-build",
            "remotes": [
                "origin"
            ],
            "remote": "origin",
            "branch_exists_on_remote": true,
            "ahead": true,
            "next_rev": null,
            "prev_rev": null,
            "update_time": "2024-10-07T05:48:22.283Z",
            "repo_path": "/root/projects/ninox-fox"
        }
    },
    "pm_id": 0,
    "monit": {
        "memory": 86417408,
        "cpu": 0.2
    }
}

export default pm2Jlist;
export type PM2Jlist = typeof pm2Jlist;