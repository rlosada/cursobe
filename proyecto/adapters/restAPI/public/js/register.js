import { Logger } from './logger.js';
import { HTTP_STATUS_CODES } from './statusCodes.js'

const FORM_ID = 'RegisterForm'              // ID del formulario en el HTML

const FIRST_NAME_ID = "firstNameID"         // ID del input que contiene el fist name
const LAST_NAME_ID = "lastNameID"           // ID del input que contiene el last name
const PASSWORD_ID = "passwordID"            // ID del input que contiene el password
const AGE_ID = "ageID"                      // ID del input que contiene el age
const EMAIL_ID = "emailID"                  // ID del input que contiene el email

const SUBMIT_EVENT = "submit"               // Evento que se dispara cuando se presiona el boton de submit en el formulario HTML
const SUBMIT_URL = "api/session/register"   // Ruta a la cual enviar el POST
const ACTION_SUCESS_REDIRECT = '/login'   // Ruta que se carga si el registro es correcto

let logger 

function getDocumentValue(id) { console.log(id); return document.getElementById(id).value }
function clearDocumentValue(id) { document.getElementById(id).value = "" }

/**
 * Funcion de inicializacion del modulo
 */
function init() {
    logger = new Logger()
    document.getElementById(FORM_ID).addEventListener(SUBMIT_EVENT, processSubmitEvent);
    logger.Info("init", `Initialization completed`);
}

/**
 * Procesa un evento 'submit'
 * 
 * @param ev Evento recibido
 */
function processSubmitEvent(ev) {
    ev.preventDefault()

    const firstName = getDocumentValue(FIRST_NAME_ID)
    const lastName = getDocumentValue(LAST_NAME_ID)
    const age = getDocumentValue(AGE_ID)
    const email = getDocumentValue(EMAIL_ID)
    const password = getDocumentValue(PASSWORD_ID)

    logger.Info("Login Form ", `Sending register request to server`);

    axios.post(SUBMIT_URL, { firstName, lastName, age, email, password})
        .then(registerSuccess)
        .catch(registerError);
}

/**
 * Procesa un register aceptado
 * 
 * @param response Objeto response devuelto por axios.post()
 */
function registerSuccess(response) {
    logger.Info("Login Form | loginSuccess", `SUCCESS`);

    alert(`Registration succedded. Please login`) 

    window.location.href = ACTION_SUCESS_REDIRECT
}

/**
 * Procesa un register rechazado
 * 
 * @param error  Objeto error devuelto por axios.post()
 */
function registerError(error) {
    let { status } = error.response
    let { msg } = error.response.data
                
    logger.Error("Login Form | registerError", `Status Code=${status}`);
    
    // Limpiar formulario
    let fields = [ FIRST_NAME_ID, LAST_NAME_ID, AGE_ID, EMAIL_ID, PASSWORD_ID ]
    fields.forEach(field => clearDocumentValue(field))
    
    alert(`Register failed. Error: ${msg}`) 
}

// Inicializar modulo
init()