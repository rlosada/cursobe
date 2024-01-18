import { StorageManagerFile } from "./StorageManagerFile.js";
import globalConfiguration from '../../misc/configuration/configuration.js'
import logger  from '../../misc/logger/LoggerInstance.js'

const config = globalConfiguration.products

let sm = null

const get = () => { 
    if (sm)
        return sm
    try {
        sm = new StorageManagerFile(config.path, config.filename, logger) 
    } catch (err) {
        logger.Error('get', `Fail to build StorageManagerFile for Products, error=${err}`)
        return null
    }
    return sm
}

export default get()