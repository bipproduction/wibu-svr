type EnvVariable = { key: string; value: string };

class EnvStringParser {
   
    static parse(envString: string): Record<string, string> {
        const envVars: EnvVariable[] = [];

        // Split the string into lines
        const lines = envString.split("\n");

        for (const line of lines) {
            const trimmedLine = line.trim();

            // Skip comments and empty lines
            if (!trimmedLine || trimmedLine.startsWith("#")) continue;

            // Match key-value pairs
            const match = trimmedLine.match(/^([\w.]+)="?(.*?)"?$/);

            if (!match) {
                console.warn(`Skipping invalid line: ${trimmedLine}`);
                continue;
            }

            const key = match[1];
            let value = match[2];

            // Resolve environment variable placeholders like ${HOME}
            value = value.replace(/\$\{(\w+)\}/g, (_, varName) => {
                if (process.env[varName]) {
                    return process.env[varName]!;
                } else {
                    console.warn(`Environment variable ${varName} is not defined`);
                    return "";
                }
            });

            envVars.push({ key, value });
        }

        const envObj: Record<string, string> = {}
        for (const env of envVars) {
            envObj[env.key] = env.value
        }
        return envObj;
    }
}

export default EnvStringParser;