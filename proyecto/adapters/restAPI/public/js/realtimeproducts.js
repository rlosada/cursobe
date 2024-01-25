import { WS_SOCKET_EVENTS } from "./ws_events.js"
import { APP_EVENTS } from "./events.js"
import { buildTable } from "./helpers.js"

function procEventInd(event) {
    let {type, data} = event
    console.log(`Received event ${type}`)

    if(APP_EVENTS.EV_PROD_LIST_RESP === type || APP_EVENTS.EV_PROD_LIST_UPDATE === type)
        document.body.innerHTML = buildTable(data)
}





const socket = io()
socket.on(WS_SOCKET_EVENTS.EV_DATA_IND, procEventInd)
console.log('Web server socket created!')




