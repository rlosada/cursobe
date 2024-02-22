import { Logger } from './logger.js';
import { server } from './params.js'


const logger = new Logger()


// Registrar funcion para enviar POST al Servidor para agregar un producto a un carrito
document.getElementById('FormAddProduct2Cart').addEventListener('submit', 
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
});
