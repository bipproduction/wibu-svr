import { spawn } from "bun";

async function apa(): Promise<string> {
    return new Promise(async (resolve, reject) => {
        // Pisahkan command dan arguments untuk kejelasan
        const child = spawn(['echo', 'Hello, World!'], {
            onExit(subprocess, exitCode, signalCode, error) {
                if (error) {
                    reject(error);
                    return;
                }
                if (exitCode !== 0) {
                    reject("exit code not 0");
                    return;
                }
            },
        });

        const a = await new Response(child.stderr).text()
        console.log(a)
    });
}

// Penggunaan
async function main() {
    try {
        const result = await apa();
        console.log('Output:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

main();