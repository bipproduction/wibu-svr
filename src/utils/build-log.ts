/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "path";
import os from "os";
import projectConfig from "../project.config";
import fs from "fs/promises";
import 'colors'

enum LogLevel {
    INFO = "INFO",
    ERROR = "ERROR"
}

async function buildLog({ appName, fileName }: { appName: string, fileName: string }) {
    try {
        // Buat direktori untuk menyimpan log jika belum ada
        const rootDir = path.join(os.homedir(), projectConfig.projectRootDir, projectConfig.pathPrefix.deployments, "apps", appName, projectConfig.pathPrefix.logs, "build");
        await fs.mkdir(rootDir, { recursive: true });

        // Tentukan path file log
        const logFile = path.join(rootDir, `${fileName}.log`);

        //clear log file
        await fs.writeFile(logFile, "").catch(() => { });

        // Buka file untuk logging
        const logStream = await fs.open(logFile, "a");

        // Fungsi untuk menulis log
        const writeLog = (level: LogLevel, ...args: any[]) => {
            const textInfo = `[${level}] ${new Date().toISOString()} \n`.green + args.join("\n");
            const textError = `[${level}] ${new Date().toISOString()} \n`.red + args.join("\n");
            logStream.write(level === LogLevel.INFO ? textInfo : textError);
        };

        return {
            // Logging info
            info: (...args: any[]) => {
                console.log(`[${LogLevel.INFO}] ${new Date().toISOString()} \n`.green, args.join("\n"))
                writeLog(LogLevel.INFO, ...args)
            },

            // Logging error
            error: (...args: any[]) => {
                console.log(`[${LogLevel.ERROR}] ${new Date().toISOString()} \n`.red, args.join("\n"))
                writeLog(LogLevel.ERROR, ...args)
            },

            // Fungsi untuk menutup stream log
            close: async () => {
                await logStream.close();
            },
        };
    } catch (err) {
        console.error(`[LOG ERROR] Failed to initialize logger: ${err}`);
        throw err;
    }
}

export default buildLog;
