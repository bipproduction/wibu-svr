const overview = {
    "project": {
        "name": "nama-project",
        "repository": "https://github.com/bipproduction/nama-project.git",
        "domain": "wibudev.com",
        "levels": {
            "production": {
                "env": {},
                "branch": "main",
                "deployed": {
                    "current": {
                        "subdomain": "nama-project",
                        "ports": [
                            3037,
                            3038,
                            3039,
                            3040
                        ]
                    },
                    "releases": {
                        "subdomain": "nama-project-releases",
                        "ports": [
                            3037
                        ]
                    }
                }
            },
            "staging": {
                "env": {},
                "branch": "staging",
                "deployed": {
                    "current": {
                        "subdomain": "nama-project-staging",
                        "ports": [
                            3037,
                            3038,
                            3039,
                            3040
                        ]
                    },
                    "releases": {
                        "subdomain": "nama-project-staging-releases",
                        "ports": [
                            3037
                        ]
                    }
                }
            }
        }
    }
}

export type Overview = typeof overview
export const OverViewDefault = overview

