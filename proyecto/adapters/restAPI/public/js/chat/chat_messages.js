export const CHAT_MESSAGES = {
    MSG_REGISTER : 'MSG_REGISTER',
    MSG_REGISTER_FAIL : 'MSG_REGISTER_FAIL',
    MSG_REGISTER_SUCCESS : 'MSG_REGISTER_SUCCESS',
    MSG_DATA : 'MSG_DATA'
}


export const ALL_USERS = 'ALL_USERS' // valor asignado al destination de un CHAT_MESSAGES.MSG_DATA para lograr que el mensaje llegue a todos

export function validateMessage(m) {
    let {type} = m
    let rc = false

    switch(type) {
        case CHAT_MESSAGES.MSG_REGISTER:
            let {user} = m
            rc = (typeof user === 'string')
            break
        case CHAT_MESSAGES.MSG_REGISTER_FAIL:
        case CHAT_MESSAGES.MSG_REGISTER_SUCCESS:            
            rc = true;
            break;
        case CHAT_MESSAGES.MSG_DATA:
            let {source, destination, message} = m
            rc = (typeof source === 'string' && typeof destination === 'string' && typeof message === 'string')
            break  
    }
    return rc
}


/**
 * Fabrica un mensaje de solicitud registro de usuario
 * */
export function buildRegisterMessage(user) {
    return {
        type : CHAT_MESSAGES.MSG_REGISTER,
        user: user
    }
}

/**
 * Fabrica un mensaje de rechazo de registro de usuario
 * */
export function buildRegisterFailMessage() {
    return {
        type : CHAT_MESSAGES.MSG_REGISTER_FAIL
    }
}

/**
 * Fabrica un mensaje de confirmacion de registro de usuario
 * */
export function buildRegisterSuccessMessage() {
    return {
        type : CHAT_MESSAGES.MSG_REGISTER_SUCCESS
    }
}

/**
 * Fabrica un mensaje de datos
 * */
export function buildDataMessage(source, destination, message) {
    return {
        type : CHAT_MESSAGES.MSG_DATA,
        source : source,
        destination : destination,
        message : message
    }
}