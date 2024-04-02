import { StorageManagerFile } from "./StorageManagerFile.js";
import { getConfiguration } from '../../../misc/configuration/configuration.js'
import logger  from '../../../misc/logger/LoggerInstance.js'

const configuration = getConfiguration()

let sm = null

const get = () => { 
    if (sm)
        return sm
    try {
        sm = new StorageManagerFile(getConfiguration().fs.carts.path, getConfiguration().fs.carts.filename, logger) 
    } catch (err) {
        logger.Error('get', `Fail to build StorageManagerFile for Carts, error=${err}`)
        return null
    }
    return sm
}

export default get