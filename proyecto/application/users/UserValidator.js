import logger from '../../misc/logger/LoggerInstance.js'
import { MAX_USER_EMAIL, MAX_USER_FIRST_NAME, MAX_USER_LAST_NAME, MAX_EXTERNAL_ID_LENGTH, EXTERNAL_ID_SEPARATOR , EXTERNAL_SOURCES} from '../../misc/constants.js'
import { USER_TYPES } from '../../misc/constants.js'
import { validateExternalId } from './externalID.js'

/**
 * Verifica si el objeto recibido es un usuario valido
 * 
 * @param user Objecto que representa un usuario
 * @returns true o false
 */
export function validateUser(user) {
    
    let checks = [
        {
            func : (email) => (typeof email === "string") && (email.length <= MAX_USER_EMAIL),  
            field: "email",                                                                     
            ret_when_fail : false                                             
        },
        {
            func : (firstName) => (typeof firstName === "string") && (firstName.length <= MAX_USER_FIRST_NAME),
            field: "firstName",
            ret_when_fail : false
        },
        {
            func : (lastName) => (typeof lastName === "string") && (lastName.length <= MAX_USER_LAST_NAME),
            field: "lastName",
            ret_when_fail : false
        },
        {
            func : (age) => (typeof age === "number") && (age >= 0),
            field: "age",
            ret_when_fail : false
        },
        {
            func : (type) => { 
                    let values = Object.values(USER_TYPES)
                    return (typeof type === "string" && values.includes(type.toUpperCase())) 
                },
            field: "type",
            ret_when_fail : false
        },  
    ]

    if(user == null) {
        logger.Error('validateUser', `User object is null or undefined`)
        return false
    }

    for(const check of checks) {
        if (!check.func(user[check.field])) {
            logger.Error('validateUser', `User ${JSON.stringify(user)} field ${check.field} validation failed`)
            return false
        }
    }  

    return true
}


export function validateExternalUser(user) {
    
    let checks = [
        {
            func : (externalID) => validateExternalId(externalID),  
            field: "externalID",                                                                     
            ret_when_fail : false                                             
        } 
    ]

    if(!validateUser(user))
        return false

    for(const check of checks) {
        if (!check.func(user[check.field])) {
            logger.Error('validateExternalUser', `User ${JSON.stringify(user)} field ${check.field} validation failed`)
            return false
        }
    }  

    return true
}