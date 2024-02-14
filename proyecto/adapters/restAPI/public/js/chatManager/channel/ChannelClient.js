import { WS_SOCKET_EVENTS } from "../../ws_events.js";


export class ChannelClient {
    #remote     // host remoto (http://ip:port)
    #logger     // instancia logger
    #cbcks      // funciones de callback
    #socket     // socket del canal

    /**
     * @param {String} remote Servidor remoto
     * @param {Logger} lg Instancia del logger
     * @param {cbcks} cbcks Objeto con funciones de callback
     */
    constructor(remote, lg, cbcks) {
        this.#remote = remote    
        this.#logger = lg
        this.#cbcks = cbcks
    }

    start() {
        this.#socket = io(this.#remote)

        console.log(this.#socket)

        this.#socket.on(WS_SOCKET_EVENTS.EV_DATA_IND, (data) => this.#recvData(data))
        this.#socket.on(WS_SOCKET_EVENTS.EV_DISCONNECT, () =>  this.#procDiscInd(this.#socket))

        this.#logger.Info("ChannelClient | Start", `[SID-${this.#socket.id}] Socket created with remote=${this.#remote}`)
    }

    sendData(data) {
        this.#logger.Info("ChannelClient | sendData", `[SID-${this.#socket.id}] Data sent to remote=${this.#remote}`)
        this.#socket.emit(WS_SOCKET_EVENTS.EV_DATA_IND, data)
    }  

    #recvData(data) {
        this.#logger.Info("ChannelClient | recvData", `[SID-${this.#socket.id}]  Data received from remote=${this.#remote}`)
        this.#cbcks.data_ind(data)
    }

    #procDiscInd(socket) {
        this.#logger.Info("ChannelClient | procDiscInd", `[SID-${this.#socket.id}]  Connection closed from remote=${this.#remote}`)
        this.#cbcks.disc_ind()
    }
}
