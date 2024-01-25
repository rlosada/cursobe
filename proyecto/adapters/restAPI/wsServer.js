import { Server } from 'socket.io'
import { WS_SERVER_EVENTS, WS_SOCKET_EVENTS} from '../restAPI/public/js/ws_events.js'
import { APP_EVENTS } from './public/js/events.js'

const name = 'WebSocketServer'

let logger 
let eventManager
let productListPending = []
let wsServer 

const createWebSocketServer = (server, lg, evManager) => {
    wsServer = new Server(server)
    logger = lg

    lg.Info('createWebSocketServer', `Web Socket created`) 
    
    wsServer.on(WS_SERVER_EVENTS.EV_CONN_IND, procConnInd)

    registerEvents(evManager)

    return wsServer    
}

function procProductListResponse(products) {
    logger.Info('WsServer|procProductListResponse', `Processing event ${APP_EVENTS.EV_PROD_LIST_RESP}`)
    
    // Enviar a todos los remotos pendientes el evento
    productListPending.forEach(socket => {
        let ev = { type : APP_EVENTS.EV_PROD_LIST_RESP, data : products}
        socket.emit(WS_SOCKET_EVENTS.EV_DATA_IND, ev)
    })
    
    // Limpiar la lista de remotos pendientes
    productListPending = []
}

function procProductListUpdate(products) {
    logger.Info('WsServer|procProductListUpdate', `Processing event ${APP_EVENTS.EV_PROD_LIST_UPDATE}`)
    let ev = { type : APP_EVENTS.EV_PROD_LIST_UPDATE, data : products}
    wsServer.emit(WS_SOCKET_EVENTS.EV_DATA_IND, ev)
}

function registerEvents(evManager) {
    eventManager = evManager
    eventManager.registerEvent(name, APP_EVENTS.EV_PROD_LIST_RESP, procProductListResponse)
    eventManager.registerEvent(name, APP_EVENTS.EV_PROD_LIST_UPDATE, procProductListUpdate)
}

function procConnInd(socket) {
    logger.Custom1('WsServer|procConnInd', `Connection established from client`)
    socket.on(WS_SOCKET_EVENTS.EV_DATA_IND, procDataInd)

    // Cargar en el arreglo de sockets que poseen pendiente el envio de la lista de productos
    productListPending.push(socket)

    eventManager.sendEvent(name, APP_EVENTS.EV_PROD_LIST_REQ)
}

function procDataInd(data) {
    console.log(data)
}

export default createWebSocketServer