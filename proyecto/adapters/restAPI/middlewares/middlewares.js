import logger from "../../../misc/logger/LoggerInstance.js"



/**
 * Devuelve un middleware que logea datos
 * acerca de la peticion
 * 
 * @param {*} name Nombre del router al cual se le aplica el middleware
 * 
 * @returns Middleware
 */
export default function getReqLogger(name) {

    return (req, res, next) =>  {
        logger.Info(`Router:${name}`, `Request with parameters remote=${req.ip},method=${req.method}, url=${req.url}`)
        next()
    }    
} 