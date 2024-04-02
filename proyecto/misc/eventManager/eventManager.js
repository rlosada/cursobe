import { CustomError, CUSTOM_ERROR_TYPES } from "../../misc/customError.js";

import EventEmitter from 'node:events'


export default class EventManager {
    #em
    #logger
    constructor(lg) {
        this.#em = new EventEmitter()
        this.#logger = lg
        this.#logger.Info('EventManager|constructor', 'New EventManager created')
    }
    registerEvent(requester, eventName, cbck) {
        this.#logger.Info('EventManager|register', `Event ${eventName} registered by ${requester}`)
        this.#em.addListener(eventName, cbck)
    }
    sendEvent(emitter, eventName, data) {
        this.#logger.Info('EventManager|sendEvent', `Event ${eventName} send by ${emitter}`)
        this.#em.emit(eventName, data)
    }
}