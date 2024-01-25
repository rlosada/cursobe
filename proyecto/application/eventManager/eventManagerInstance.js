import logger from '../../misc/logger/LoggerInstance.js'
import EventManager from './eventManager.js'

let eventManager = null

const get = () => { 
    if(eventManager === null)
        eventManager = new EventManager(logger)
    return eventManager
}

// Exportar objeto eventManager
export default get()