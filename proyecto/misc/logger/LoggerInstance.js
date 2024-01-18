import { Logger } from "./Logger.js";

let logger = null

const get = () => { 
    if(logger === null)
        logger = new Logger({}) 
    return logger
}

// Exportar objeto logger
export default get()