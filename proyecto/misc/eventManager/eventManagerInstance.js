import logger from '../../misc/logger/LoggerInstance.js'
import EventManager from './eventManager.js'

let eventManager = new EventManager(logger)

export default () => eventManager