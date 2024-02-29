import { Logger } from './logger.js';
import { server } from './params.js'


const logger = new Logger()

const PRODUCT_FORM_ID = 'FormAddProduct2Cart'
const SUBMIT_EVENT = "submit"  
const CLICK_EVENT = 'click' 

const LOGOUT_BUTTON_ID = 'LogoutButtonID'
const LOGOUT_URL = "api/session/logout"  
const ACTION_SUCESS_REDIRECT = '/login'

// Registrar funcion para enviar POST al Servidor para agregar un producto a un carrito
document.getElementById(PRODUCT_FORM_ID).addEventListener(SUBMIT_EVENT, 
    function(ev) {
        ev.preventDefault()

        const cid = document.getElementById('cid').value;
        const pid = document.getElementById('pid').value;
        const URL = `${server}/api/carts/${cid}/product/${pid}`

        logger.Info('FormAddProduct2Cart | Click', `POST URL ${URL}`)

        axios.post(URL)
            .then( (response) => {
                logger.Error("FormAddProduct2Cart | Post Response", `SUCCESS`);
                alert("Producto agregar al carrito")
            })
            .catch( (error) => {
                alert("No se pudo agregar el producto al carrito")
                logger.Error("FormAddProduct2Cart | Post Response", `error=${error}`);
            });
})

document.getElementById(LOGOUT_BUTTON_ID).addEventListener(CLICK_EVENT, 
    function(ev) {
        ev.preventDefault()

        logger.Info("Logout Form | logout", `Trying to logout`);    

        axios.post(LOGOUT_URL)
            .then(logoutSuccess)
            .catch(logoutError);        
   
})

/**
 * Procesa un logout aceptado
 * 
 * @param response Objeto response devuelto por axios.post()
 */
function logoutSuccess(response) {
    logger.Info("Logout Form | logoutSuccess", `SUCCESS`);
    alert('Sesion finalizada') 
    window.location.href = ACTION_SUCESS_REDIRECT
}

/**
 * Procesa un logout rechazado
 * 
 * @param error  Objeto error devuelto por axios.post()
 */
function logoutError(error) {
    logger.Info("Logout Form | logoutSuccess", `FAILED, error=${JSON.stringify(error)}`);
    alert('Fallo el logout, por favor intente mas tarde') 
}