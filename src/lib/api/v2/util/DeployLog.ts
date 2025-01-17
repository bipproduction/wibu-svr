/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment"

class DeployLog {

    private static _isLog: boolean = false
    private static _logs: { id: string, log: string[] }[] = []

    static info(id: string, ...args: any[]) {
        const logData = this._logs.find(log => log.id === id)
        const text = `[${moment().format('YYYY-MM-DD HH:mm:ss')}] [INFO] ${args.join(' ')}`
        if (this._isLog) {
            console.log(text)
        }
        if (logData) {
            logData.log.push(text)
        } else {
            this._logs.push({ id, log: [text] })
        }
    }

    static setWarn(id: string, ...args: any[]) {
        const logData = this._logs.find(log => log.id === id)
        const text = `[${moment().format('YYYY-MM-DD HH:mm:ss')}] [WARN] ${args.join(' ')}`
        if (this._isLog) {
            console.log(text)
        }
        if (logData) {
            logData.log.push(text)
        } else {
            this._logs.push({ id, log: [text] })
        }
    }

    static error(id: string, ...args: any[]) {
        const logData = this._logs.find(log => log.id === id)
        const text = `[${moment().format('YYYY-MM-DD HH:mm:ss')}] [ERROR] ${args.join(' ')}`
        if (this._isLog) {
            console.log(text)
        }
        if (logData) {
            logData.log.push(text)
        } else {
            this._logs.push({ id, log: [text] })
        }
    }

    static set isLog(isLog: boolean) {
        this._isLog = isLog
    }

    static get isLog() {
        return this._isLog
    }

    static getLog(id: string) {
        return this._logs.find(log => log.id === id)?.log || []
    }

    static get logs() {
        return this._logs
    }

    static getLogString(id: string) {
        return this._logs.find(log => log.id === id)?.log.join('\n') || ''
    }

    static clearLog(id: string) {
        this._logs = this._logs.filter(log => log.id !== id)
    }

    static getErrorLog(id: string) {
        return this._logs.find(log => log.id === id)?.log.filter(log => log.includes('[ERROR]')) || []
    }

    static getInfoLog(id: string) {
        return this._logs.find(log => log.id === id)?.log.filter(log => log.includes('[INFO]')) || []
    }
    static isLogRunning(id: string) {
        return this._logs.find(log => log.id === id) ? true : false
    }
}


export default DeployLog
