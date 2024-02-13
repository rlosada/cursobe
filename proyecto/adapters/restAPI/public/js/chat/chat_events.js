export const CHAT_EVENTS = {
    EV_REGISTER : 'EV_REGISTER',
    EV_REGISTER_FAIL : 'EV_REGISTER_FAIL',
    EV_REGISTER_SUCCESS : 'EV_REGISTER_SUCCESS'
}

export function buildRegisterEvent(user) {
    return {
        type : CHAT_EVENTS.EV_REGISTER,
        user: user
    }
}

export function buildRegisterFailEvent() {
    return {
        type : CHAT_EVENTS.EV_REGISTER_FAIL
    }
}
export function buildRegisterSuccessEvent() {
    return {
        type : CHAT_EVENTS.EV_REGISTER_SUCCESS
    }
}


// EV_REGISTER_FAIL : { type : CHAT_EVENTS.EV_REGISTER_FAIL }
// EV_REGISTER_SUCCCESS : { type : CHAT_EVENTS.EV_REGISTER_SUCCESS }
// EV_REGISTER      : { type : CHAT_EVENTS.EV_REGISTER,  user: user }
