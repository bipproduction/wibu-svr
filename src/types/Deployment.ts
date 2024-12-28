/* eslint-disable @typescript-eslint/no-unused-vars */
const overview = {
    "project": {
        "name": "hipmi",
        "repository": "https://github.com/wibudev/hipmi",
        "domain": "wibudev.com",
        "deployments": {
            "production": {
                "env": {
                    "WIBU_APIKEY": "your-api-key",
                    "TEST_TOKEN": "your-test-token"
                },
                "branch": "main",
                "deployed": {
                    "current": {
                        "subdomain": "hipmi",
                        "ports": [
                            3037,
                            3038,
                            3039,
                            3040
                        ]
                    },
                    "releases": {
                        "subdomain": "hipmi-releases",
                        "ports": [
                            3037
                        ]
                    }
                }
            },
            "staging": {
                "env": {
                    "WIBU_APIKEY": "your-api-key",
                    "TEST_TOKEN": "your-test-token"
                },
                "branch": "staging",
                "deployed": {
                    "current": {
                        "subdomain": "hipmi-staging",
                        "ports": [
                            3037,
                            3038,
                            3039,
                            3040
                        ]
                    },
                    "releases": {
                        "subdomain": "hipmi-staging-releases",
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