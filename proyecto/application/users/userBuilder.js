
import { USER_TYPES } from "../../misc/constants.js"

/**
 * Fabrica un objeto usuario que fue registrado localmente
 * 
 * @param {*} email         
 * @param {*} firstName 
 * @param {*} lastName 
 * @param {*} age 
 * @param {*} password 
 * @param {*} type 
 * @returns 
 */
export const buildUserLocal = (email, firstName, lastName, age, password) => {
    return {
        email,
        firstName,
        lastName,
        age,
        password,
        type : USER_TYPES.SIMPLE.toUpperCase() 
    }
}

export const buildUserGitHub = (externalID, username) => {
    return {
        email : `${externalID}@dummy.mail.com`,
        firstName : username,
        lastName : username,
        age : 0,
        type : USER_TYPES.SIMPLE.toUpperCase() ,
        externalID
    }
}

