
import { WS_SOCKET_EVENTS } from "../ws_events.js"
import { buildRegisterEvent } from "./chat_events.js"
import { ShowRegister, ShowChat } from "./chat_helpers.js"
import { CHAT_EVENTS } from "./chat_events.js"

// variables globales
let status              // estado de la aplicacion
let registerForm        // referencia al formulario de registro
let registerInput       // referencia al campo donde el usuario ingresa el correo
let messagesList        // referencia a la lista de mensajes
let messageForm         // referencia al formulario de mensajes
let messageDestination  // referencia al destinatario del mensaje
let messageData         // refecencia al mensaje a enviar

const CHAT_STATUS = {
    STATUS_LOGOFF : 0,
    STATUS_LOGING : 1
}

const socket = io("http://localhost:8081")

// Inicializacion






// Registrar eventos del servidor
socket.on(WS_SOCKET_EVENTS.EV_DATA_IND, procEventInd)



function procEventInd(event) {
    let {type} = event
    console.log(`Received event ${type}`)
    switch(status) {
        case CHAT_STATUS.STATUS_LOGOFF:
            if(type === CHAT_EVENTS.EV_REGISTER_FAIL) {
                alert("Registration failed, user already exists")
                return
            }
            if(type === CHAT_EVENTS.EV_REGISTER_SUCCESS ) {
                document.body.innerHTML = ShowChat()
            }
            break;
    }
}

function set_LoggedOff() {
    status = CHAT_STATUS.STATUS_LOGOFF

    console.log(`Status changed to ${status}`)

    // Mostrar la pantalla principal
    document.body.innerHTML = ShowRegister()

    registerForm = document.getElementById("registerForm")
    registerInput = document.getElementById("registerInput")    

    // Cuando el usuario presiona el boton del formulario, si esta completo se genera un evento
    // CHAT_EVENTS.EV_REGISTER y el valor del input del formulario se interpreta como el correo
    // que el usuario desea registrar
    registerForm.addEventListener('submit', (ev) => {
        ev.preventDefault()
        if(registerInput.value) {
            const registerEvent = buildRegisterEvent(registerInput.value)
            console.log(`Emit event ${CHAT_EVENTS.EV_REGISTER},  data=${JSON.stringify(registerEvent)}`)
            socket.emit(WS_SOCKET_EVENTS.EV_DATA_IND, registerEvent)
            registerInput.value = ""
        }
    })

}

function set_LoggedIn() {
    status = CHAT_STATUS.STATUS_LOGING

    console.log(`Status changed to ${status}`)

    // Mostrar la pantalla principal
    document.body.innerHTML = ShowChat()    

    messagesList = document.getElementById("messagesList")
    messageForm = document.getElementById("messageForm")    
}
