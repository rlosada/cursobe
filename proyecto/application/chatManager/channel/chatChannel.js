import { validatePort } from "../../../misc/utils.js";
import http from 'http'
import { Server } from 'socket.io'
import { WS_SERVER_EVENTS } from "../../../adapters/restAPI/public/js/ws_events.js"
import { WS_SOCKET_EVENTS } from "../../../adapters/restAPI/public/js/ws_events.js";


export class chatChannel {
    #port
    #http
    #ws
    #logger
    #sockets
    #cbcks
    constructor(port, lg, cbcks) {
        this.#port = 8081    
        this.#logger = lg
        this.#sockets = []
        this.#cbcks = cbcks
    }
    start() {
        this.#http = http.createServer((req, res) => {
            // Set CORS headers
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

            // Handle preflight requests
            if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
            }

            // Handle any other incoming HTTP requests here if needed
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('WebSocket Server');
        })
        this.#ws = new Server(this.#http, {
            cors : {
                origin: '*',
                methods : ['GET', 'POST']
            }
        })

        this.#ws.on(WS_SERVER_EVENTS.EV_CONN_IND, (socket) => {
            this.#logger.Info('chatChannel|ConnIndication', `New client connected`)
            
            // Registrar el evento para procesar la recepcion de un dato
            socket.on(WS_SOCKET_EVENTS.EV_DATA_IND, (message) => {
                this.#logger.Info('chatChannel|ProcDataIndication', `Received message : ${message}`)
                this.#cbcks.data_ind(socket, message)
            })
            // Registrar el evento para procesar la desconexion
            socket.on(WS_SOCKET_EVENTS.EV_DISCONNECT, () =>  this.#cbcks.disc_ind(socket))

            this.#sockets.push(socket)
        })

        this.#http.listen(this.#port, () => this.#logger.Info('chatChannel|start', `Chat server started at port ${this.#port}`))
    }
    sendEvent(socket, event) {
        socket.emit(WS_SOCKET_EVENTS.EV_DATA_IND, event)
    }
}