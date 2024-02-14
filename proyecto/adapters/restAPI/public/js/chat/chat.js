
import { CHAT_EVENTS } from "./chat_events.js"
import { CHAT_MESSAGES, buildRegisterMessage, buildDataMessage , validateMessage, ALL_USERS} from "./chat_messages.js"
import { Logger } from "../logger.js"
import { ShowChat, ShowRegister } from "./chat_helpers.js"
import { buildRegisterEvent, buildRegisterSuccessEvent, buildRegisterFailEvent , buildDataEvent, buildDataRcvEvent} from "./chat_events.js"
import { WS_SOCKET_EVENTS } from "../ws_events.js"


const CLIENT_STATUS = {
    UNREGISTERED : "UNREGISTRED",
    REGISTERED : "REGISTERED"
}

// web socket
let socket
let clientStatus 
let logger
let source


function init() {
    socket = io("http://localhost:8081")
    socket.on(WS_SOCKET_EVENTS.EV_DATA_IND, procDataInd)
    clientStatus = CLIENT_STATUS.UNREGISTERED
    logger = new Logger()
    initRegisterView()
    logger.Info('procDataInd', `[SID-${socket.id}] status ${clientStatus}`)
}

function procDataInd(data) {
    logger.Info('procDataInd', `[SID-${socket.id}] Data received: ${JSON.stringify(data)}`)
    
    let {type} = data

    switch(type) {
        case CHAT_MESSAGES.MSG_REGISTER_SUCCESS:
            procEvents(buildRegisterSuccessEvent())
            break

        case CHAT_MESSAGES.MSG_REGISTER_FAIL:
            procEvents(buildRegisterFailEvent())
            break    

        case CHAT_MESSAGES.MSG_DATA:
            if(!validateMessage(data))
                return
            let {source, destination, message } = data
            procEvents(buildDataRcvEvent(destination, source, message))
            break
    }
}

function procEvents(ev) {
    let {type} = ev
    logger.Info('procEvents', `[SID-${socket.id}] Processing event ${type}`)
    switch(type) {
        case CHAT_EVENTS.EV_REGISTER:
            procRegisterRequestEv(ev)
            break;

        case CHAT_EVENTS.EV_REGISTER_FAIL:
            procRegisterRespErrorEv(ev)
            break;            
        
        case CHAT_EVENTS.EV_REGISTER_SUCCESS:
            procRegisterRespOkEv(ev)
            break;

        case CHAT_EVENTS.EV_MESSAGE_SEND:
            procMessageEv(ev)
            break;

        case CHAT_EVENTS.EV_MESSAGE_REC:
            procMessageRcvEv(ev)
            break;            
    }
}



function procClickRegisterButton(clickEvent) {
    let registerInput = document.getElementById("registerInput")        
    clickEvent.preventDefault()
    if(registerInput.value) {
        procEvents(buildRegisterEvent(registerInput.value.toLowerCase()))
        registerInput.value = ""
    }
}

function procClickSendMessageButton(clickEvent) {
    let destinationInput = document.getElementById("destinationInput")        
    let messageInput = document.getElementById("messageInput")       
    let destinationAllInput = document.getElementById("destinationAllInput")       
    clickEvent.preventDefault()

    if(messageInput.value === "") 
        return

    if(destinationInput.value) {
        procEvents(buildDataEvent(destinationInput.value.toLowerCase(), source.toLowerCase(), messageInput.value.toLowerCase()))
        destinationInput.value = ""
    } 
    else if (destinationAllInput.checked) {
        procEvents(buildDataEvent(ALL_USERS, source, messageInput.value))
        destinationAllInput.checked = 0
    }

    messageInput.value = ""
}

function enableRegistrationButton() {
    let registerForm = document.getElementById("registerForm")
    registerForm.addEventListener('submit', procClickRegisterButton)  
}

function disableRegistrationButton() {
    let registerForm = document.getElementById("registerForm")
    if(registerForm)
        registerForm.removeEventListener('submit', procClickRegisterButton)  
}

function enableSendMessagenButton() {
    let registerForm = document.getElementById("messageForm")
    registerForm.addEventListener('submit', procClickSendMessageButton)  
}

function disableSendMessagenButton() {
    let registerForm = document.getElementById("messageForm")
    if(registerForm)
        registerForm.removeEventListener('submit', procClickSendMessageButton)  
}


function initRegisterView() {
    // Mostrar la view de registro
    document.body.innerHTML = ShowRegister()
    
    enableRegistrationButton()
 
    return
}

function initChatView() {

    disableRegistrationButton()

    // Mostrar la view de registro
    document.body.innerHTML = ShowChat()

    enableSendMessagenButton()
 
    return
}

function procRegisterRequestEv(ev) {

    // Este evento se ignora si el cliente esta registrado
    if(clientStatus !== CLIENT_STATUS.UNREGISTERED) {
        logger.Info('procRegisterRequestEv', `[SID-${socket.id}] Event ${CHAT_EVENTS.EV_REGISTER} discarded, status is ${clientStatus}`)
        return
    }

    let {user} = ev
    const registerEvent = buildRegisterMessage(user)
    logger.Info('procRegisterRequestEv', `[SID-${socket.id}] Emit event ${CHAT_EVENTS.EV_REGISTER},  data=${JSON.stringify(registerEvent)}`)
    socket.emit(WS_SOCKET_EVENTS.EV_DATA_IND, registerEvent)
    source = user
}

function procRegisterRespOkEv(ev) {

    // Este evento se ignora si el cliente esta registrado
    if(clientStatus !== CLIENT_STATUS.UNREGISTERED) {
        logger.Info('procRegisterRespOkEv', `[SID-${socket.id}] Event ${CHAT_EVENTS.EV_REGISTER_SUCCESS} discarded, status is ${clientStatus}`)
        return    
    }

    logger.Info('procRegisterRespOkEv', `[SID-${socket.id}] Register SUCCESS`)
    initChatView()

    clientStatus = CLIENT_STATUS.REGISTERED    

    logger.Info('procDataInd', `[SID-${socket.id}] new status ${clientStatus}`)
}

function procRegisterRespErrorEv(ev) {
    // Este evento se ignora si el cliente esta registrado
    if(clientStatus !== CLIENT_STATUS.UNREGISTERED) {
        logger.Info('procRegisterRespErrorEv', `[SID-${socket.id}] Event ${CHAT_EVENTS.EV_REGISTER_FAIL} discarded, status is ${clientStatus}`)     
        return
    }

    logger.Info('procRegisterRespOkEv', `[SID-${socket.id}] Register FAILED`)
}

function procMessageEv(ev) {
    // Este evento se ignora si el cliente no esta registrado
    if(clientStatus !== CLIENT_STATUS.REGISTERED) {
        logger.Info('procMessageEv', `[SID-${socket.id}] Event ${CHAT_EVENTS.EV_MESSAGE_SEND} discarded, status is ${clientStatus}`)             
        return
    }

    let {destination, message, source} = ev
    logger.Info('procMessageEv', `${JSON.stringify(ev)}`)

    const m = buildDataMessage(source, destination, message)

    socket.emit(WS_SOCKET_EVENTS.EV_DATA_IND, m)

}

function procMessageRcvEv(ev) {
    // Este evento se ignora si el cliente no esta registrado
    if(clientStatus !== CLIENT_STATUS.REGISTERED) {
        logger.Info('procMessageEv', `[SID-${socket.id}] Event ${CHAT_EVENTS.EV_MESSAGE_REC} discarded, status is ${clientStatus}`)             
        return
    }  

    // si el mensaje fue emitido por este cliente ignorar
    if(source === ev.source)
        return

    const item = document.createElement("li")
    let date_str = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    item.textContent = `date:${date_str}, source:${ev.source}, message:${ev.message}`
    messagesList.appendChild(item)
    window.scrollTo(0, document.body.scrollHeight)
    return
}


init()
