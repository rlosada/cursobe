import { WS_SOCKET_EVENTS } from "../ws_events"


// web socket contra el remoto
let socket

let inited = false
let callbacks

export function socketInit(remote, cbcks) {

    if(inited)
        return

    callbacks = cbcks

    // Crear el socket
    socket = io(remote)

    // Registrar funcion para procesar datos crudos recibidos del remoto
    socket.on(WS_SOCKET_EVENTS.EV_DATA_IND, procDataInd)

    console.log(`Web Socket created to ${remote}`)

    inited = true
}

/**
 * Envia un dato crudo al remoto
 */
export function socketSendData(data) {
    socket.emit(WS_SOCKET_EVENTS.EV_DATA_IND, data)
}

/**
 * Procesa recepcion de dato crudo provemiente del remoto
 */
function procDataInd(data) {
    console.log(`Data received from remote: ${data}`)

    callbacks.sendDataToApp(data)
}