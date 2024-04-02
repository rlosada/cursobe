
import logger from '../../misc/logger/LoggerInstance.js'
import CONSTANTS from '../../misc/constants.js'

const { USER_TYPES } = CONSTANTS

/**
 * Construye el objeto que se almacena en la req.session.user
 * @param {*} dbUser 
 * @returns 
 */
export function buildSessionInfo(dbUser) {
    logger.Info('buildSessionInfo', `Data object received is ${JSON.stringify(dbUser)}`)  

    let sessionInfo = {
        uid : dbUser._id,
        firstName : dbUser.first_name,
        lastName : dbUser.last_name,
        isAdmin : (dbUser.type === USER_TYPES.ADMIN)
    }   
    
    logger.Info('buildSessionInfo', `Session information build => ${JSON.stringify(sessionInfo)}`) 

    return sessionInfo
}