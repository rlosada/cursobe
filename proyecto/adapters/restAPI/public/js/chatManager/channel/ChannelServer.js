import http from 'http'
import { Server } from 'socket.io'
import { WS_SERVER_EVENTS } from "../../ws_events.js"
import { WS_SOCKET_EVENTS } from "../../ws_events.js";


export class ChannelServer {
    #port       // puerto donde escucha el servidor
    #http       // instancia servidor http 
    #ws         // instancia servidor de web sockets
    #logger     // instancia logger
    #cbcks      // funciones de callback

    /**
     * @param {Number} port Puerto de escucha del servidor
     * @param {Logger} lg Instancia del logger
     * @param {cbcks} cbcks Objeto con funciones de callback
     */
    constructor(port, lg) {
        this.#port = 8081    
        this.#logger = lg
    }

    /**
     * Setea las funciones de callback a utilizar para enviar eventos
     * a la capa superior
     */
    setCallbacks(cbkcs) {
        this.#cbcks = cbkcs
    }

    /**
     * Lanzar server
     */
    start() {
        // Crear server http habilitando CORS
        this.#http = http.createServer((req, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

            if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
            }

            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('WebSocket Server');
        })
        // Crear server de web sockets habilitando CORS
        this.#ws = new Server(this.#http, {
            cors : {
                origin: '*',
                methods : ['GET', 'POST']
            }
        })

        // Registra funcion de procesamiento de una nueva conexion
        this.#ws.on(WS_SERVER_EVENTS.EV_CONN_IND, (socket) => {
            this.#logger.Info('ServerChannel|ConnIndication', `New client connected`)
            
            // Registrar el evento para procesar la recepcion de un dato
            socket.on(WS_SOCKET_EVENTS.EV_DATA_IND, (data) => this.#procDataInd(socket.id, data))

            // Registrar el evento para procesar la desconexion
            socket.on(WS_SOCKET_EVENTS.EV_DISCONNECT, () =>  this.#procDiscInd(socket.id))

        })

        this.#http.listen(this.#port, () => this.#logger.Info('ServerChannel|start', `Server Channel started at port ${this.#port}`))
    }
    sendData(sid, data) {
        this.#logger.Info('ServerChannel|sendData', `[SID-${sid}] data sent to client`)
        this.#ws.to(sid).emit(WS_SOCKET_EVENTS.EV_DATA_IND, data)
    }  

    sendDataToAll(data) {
        this.#logger.Info('ServerChannel|sendData', `[SID-ALL] data sent to all clients`)
        this.#ws.emit(WS_SOCKET_EVENTS.EV_DATA_IND, data)
    }

    #procDataInd(sid, data) {
        this.#logger.Info('ServerChannel|ProcDataIndication', `[SID-${sid}] data received from client`)
        this.#cbcks.data_ind(sid, data)
    }

    #procDiscInd(sid) {
        this.#cbcks.disc_ind(sid)
    }
}
