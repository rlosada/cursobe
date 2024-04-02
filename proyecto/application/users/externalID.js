import CONSTANTS from "../../misc/constants.js"

const { EXTERNAL_SOURCES, MAX_EXTERNAL_ID_LENGTH, EXTERNAL_ID_SEPARATOR } = CONSTANTS

/**
 * Verificar que el identificador de usuario
 * de una fuente externa tenga el formato esperado
 * 
 * @param {string} externalID 
 * @returns true o false
 */
export function validateExternalId(externalID) {
    if(!(typeof externalID === "string") || !(externalID.length <= MAX_EXTERNAL_ID_LENGTH))
        return false

    let externalSource = externalID.split(EXTERNAL_ID_SEPARATOR)[0]
    let externalSourcesArray = Object.values(EXTERNAL_SOURCES)

    return externalSourcesArray.includes(externalSource)
}


export function buildExternalID(externalSource, externalUserID) {

    let externalSourcesArray = Object.values(EXTERNAL_SOURCES)

    // Si la fuente externa no es ninguna de las conocidas, error
    if(!externalSourcesArray.includes(externalSource.toUpperCase()))
        return null

    // Devolver el indentificador del usuario de fuente externa
    return `${externalSource}${EXTERNAL_ID_SEPARATOR}${externalUserID}`
}