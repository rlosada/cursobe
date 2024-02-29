import { Logger } from './logger.js';
import { HTTP_STATUS_CODES } from './statusCodes.js'


const LOGIN_FORM_ID = 'LoginForm'           // ID del formulario en el HTML
const EMAIL_ID = "email_id"                 // ID del input que contiene el email en el formulario HTML
const PASSWORD_ID = "password_id"           // ID del input que contiene el password en el formulario HTML
const SUBMIT_EVENT = "submit"               // Evento que se dispara cuando se presiona el boton de submit en el formulario HTML
const SUBMIT_URL = "api/session/login"      // Ruta a la cual enviar el POST
const ACTION_SUCESS_REDIRECT = '/products'   // Ruta que se carga si el login es correcto

let logger 

function getDocumentValue(id) { return document.getElementById(id).value }
function clearDocumentValue(id) { document.getElementById(id).value = "" }


/**
 * Funcion de inicializacion del modulo
 */
function init() {
    logger = new Logger()
    document.getElementById(LOGIN_FORM_ID).addEventListener(SUBMIT_EVENT, processSubmitEvent);
    logger.Info("init", `Initialization completed`);
}

/**
 * Procesa un evento 'submit'
 * 
 * @param ev Evento recibido
 */
function processSubmitEvent(ev) {
    ev.preventDefault()

    const email = getDocumentValue(EMAIL_ID)
    const password = getDocumentValue(PASSWORD_ID)

    logger.Info("Login Form ", `Sending login request to server`);

    axios.post(SUBMIT_URL, { email, password })
        .then(loginSuccess)
        .catch(loginError);
}

/**
 * Procesa un login aceptado
 * 
 * @param response Objeto response devuelto por axios.post()
 */
function loginSuccess(response) {
    logger.Info("Login Form | loginSuccess", `SUCCESS`);
    window.location.href = ACTION_SUCESS_REDIRECT
}

/**
 * Procesa un login rechazado
 * 
 * @param error  Objeto error devuelto por axios.post()
 */
function loginError(error) {
    let { status } = error.response
                
    logger.Error("Login Form | loginError", `Status Code=${status}`);
    
    // Limpiar formulario
    clearDocumentValue(EMAIL_ID)
    clearDocumentValue(PASSWORD_ID)                
    
    let errorMsg = ""
    if(status === HTTP_STATUS_CODES.AUTHORIZATION_FAILED) 
        errorMsg = 'Login failed. Please try again.'
    else 
        errorMsg = 'Unexpected error. Please try again later'
    alert(errorMsg) 
}

// Inicializar modulo
init()