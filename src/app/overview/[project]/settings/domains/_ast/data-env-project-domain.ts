const dataEnvProjectDomain = {
    "envGroup": [
        {
            "id": "production",
            "name": "production",
            "ProjectSubDomain": []
        },
        {
            "id": "preview",
            "name": "preview",
            "ProjectSubDomain": []
        },
        {
            "id": "development",
            "name": "development",
            "ProjectSubDomain": []
        }
    ],
    "domains": [
        {
            "id": "muku",
            "name": "muku",
            "ServerConfig": [
                {
                    "id": "darmasaba",
                    "name": "darmasaba"
                },
                {
                    "id": "hipmi",
                    "name": "hipmi"
                },
                {
                    "id": "test",
                    "name": "test"
                },
                {
                    "id": "apa-itu",
                    "name": "apa-itu"
                }
            ]
        },
        {
            "id": "wibudev",
            "name": "wibudev",
            "ServerConfig": [
                {
                    "id": "stg-darmasaba",
                    "name": "stg-darmasaba"
                },
                {
                    "id": "wa",
                    "name": "wa"
                },
                {
                    "id": "wibu-storage",
                    "name": "wibu-storage"
                },
                {
                    "id": "io",
                    "name": "io"
                },
                {
                    "id": "default",
                    "name": "default"
                }
            ]
        }
    ]
}

export default dataEnvProjectDomain
export type DataEnvProjectDomain = typeof dataEnvProjectDomain