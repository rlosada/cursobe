import { HTTP_STATUS_CODES } from "../../public/js/statusCodes.js"
import CartRepository from "../../../../respositories/cart.repository.js"

/**
 * Procesa una peticion para recuperar un 
 * cart a partir de su identificador
 * 
 * @param {*} req   request HTTP
 * @param {*} res   response HTTP
 * @param {*} next  proxima funcion en la cadena
 */
async function getById(req, res, next) {
    const { cid } = req.params.cid

    CartRepository.getProductsInfo(cid)
        .then((products) => res.status(HTTP_STATUS_CODES.SUCESS).send({products}))
        .catch(next)
}

/**
 * Procesa una peticion para crear un nuevo
 * carrito
 * 
 * @param {*} req   request HTTP
 * @param {*} res   response HTTP
 * @param {*} next  proxima funcion en la cadena
 */
async function addProduct(req, res, next) {
    let {cid, pid} = req.params
    
    CartRepository.addProduct(cid, pid)
         .then(() => res.status(HTTP_STATUS_CODES.CREATED).send())
         .catch(next)
}

/**
 * Procesa una peticion para incrementar la cantidad
 * de un item en un carrito
 * 
 * @param {*} req   request HTTP
 * @param {*} res   response HTTP
 * @param {*} next  proxima funcion en la cadena
 */
async function setProductQty(req, res, next) {
    let {cid, pid} = req.params
    let { quantity } = req.body
    
    CartRepository.updateProductQty(cid, pid, quantity)
         .then(() => res.status(HTTP_STATUS_CODES.SUCESS).send())
         .catch(next)
}

/**
 * Procesa una peticion para eliminar un producto de un
 * carrito
 * 
 * @param {*} req   request HTTP
 * @param {*} res   response HTTP
 * @param {*} next  proxima funcion en la cadena
 */
async function rmvProduct(req, res, next) {
    let {cid, pid} = req.params

    CartRepository.rmvProduct(cid, pid)
         .then(() => res.status(HTTP_STATUS_CODES.SUCESS).send())
         .catch(next)
}

/**
 * Procesa una peticion para vaciar un
 * carrito
 * 
 * @param {*} req   request HTTP
 * @param {*} res   response HTTP
 * @param {*} next  proxima funcion en la cadena
 */
async  function empty(req, res, next) {
    let {cid} = req.params

    CartRepository.clear(cid)
         .then(() => res.status(HTTP_STATUS_CODES.SUCESS).send())
         .catch(next)
}

/**
 * Procesa una peticion para crear un
 * carrito
 * 
 * @param {*} req   request HTTP
 * @param {*} res   response HTTP
 * @param {*} next  proxima funcion en la cadena
 */
async function create(req, res, next) {
    const cart = req.body

    CartRepository.add(cart)
         .then((cid) => res.status(HTTP_STATUS_CODES.CREATED).send({"cid" : cid}))
         .catch(next)
}

/**
 * Procesa una peticion para actualizar
 * los productos en un carrito
 * 
 * @param {*} req   request HTTP
 * @param {*} res   response HTTP
 * @param {*} next  proxima funcion en la cadena
 */
async function update(req, res, next) {
        let {cid} = req.params
        let productsInfo = req.body

        CartRepository.update(cid, productsInfo)
            .then(() => res.status(HTTP_STATUS_CODES.SUCESS).send())
            .catch(next)        
}

const cartController = {
    create,
    getById,
    empty,
    rmvProduct,
    setProductQty,
    update,
    addProduct
}

export default cartController