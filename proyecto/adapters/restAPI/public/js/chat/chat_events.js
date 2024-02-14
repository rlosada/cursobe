export const CHAT_EVENTS = {
    EV_REGISTER : 'EV_REGISTER',
    EV_REGISTER_FAIL : 'EV_REGISTER_FAIL',
    EV_REGISTER_SUCCESS : 'EV_REGISTER_SUCCESS',
    EV_MESSAGE_SEND : 'EV_MESSAGE_SEND',
    EV_MESSAGE_REC : 'EV_MESSAGE_RECV',
}

export const buildRegisterEvent = (user) => {
    return { type : CHAT_EVENTS.EV_REGISTER,  user: user }
}

export const buildRegisterSuccessEvent = () => {
    return { type : CHAT_EVENTS.EV_REGISTER_SUCCESS }
}

export const buildRegisterFailEvent = () => {
    return { type : CHAT_EVENTS.EV_REGISTER_FAIL }
}

export const buildDataEvent = (destination, source, message) => {
    return {type : CHAT_EVENTS.EV_MESSAGE_SEND, destination, message, source}
}

export const buildDataRcvEvent = (destination, source, message) => {
    return {type : CHAT_EVENTS.EV_MESSAGE_REC, destination, message, source}
}

// EV_REGISTER_FAIL : { type : CHAT_EVENTS.EV_REGISTER_FAIL }
// EV_REGISTER_SUCCCESS : { type : CHAT_EVENTS.EV_REGISTER_SUCCESS }
// EV_REGISTER      : { type : CHAT_EVENTS.EV_REGISTER,  user: user }
