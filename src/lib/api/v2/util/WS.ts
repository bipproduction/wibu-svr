/* eslint-disable @typescript-eslint/no-explicit-any */
class WS {
    private static _socket: WebSocket | any | null = null

    static set socket(socket: WebSocket | null) {
        this._socket = socket
    }

    static get socket() {
        return this._socket
    }

    static send(message: string) {
        if (!this._socket) {
            throw new Error("WebSocket is not connected")
        }
        this._socket.send(message)
    }
}

export default WS
