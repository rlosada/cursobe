
import CONSTANTS from "../../misc/constants.js"

const { USER_TYPES } = CONSTANTS

/**
 * Fabrica un objeto usuario que fue registrado localmente
 * 
 * @param {*} email         Direccion de correo electronico         
 * @param {*} firstName     Nombre
 * @param {*} lastName      Apellido
 * @param {*} age           Edad
 * @param {*} password      passoword
 * 
 * @returns usuario
 */
export const buildUserLocal = (email, firstName, lastName, age, password) => {
    return {
        email,
        first_name: firstName,
        last_name : lastName,
        age,
        password,
        role : USER_TYPES.SIMPLE.toUpperCase() 
    }
}


/**
 * Fabrica un objeto usuario que fue registrado en otro sistema
 * 
 * @param {*} externalID    Identificador del usuario en el sistema externo
 * @param {*} username      Nombre de usuario
 * 
 * @returns usuario
 */
export const buildUserGitHub = (externalID, username) => {
    return {
        email : `${externalID}@dummy.mail.com`,
        first_name : username,
        last_name : username,
        age : 0,
        role : USER_TYPES.SIMPLE.toUpperCase() ,
        externalID
    }
}

