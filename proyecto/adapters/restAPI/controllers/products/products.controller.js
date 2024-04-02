
import { HTTP_STATUS_CODES } from '../../public/js/statusCodes.js'
import getProductManager from '../../../../application/productManager/ProductManagerInstance.js'


/**
 * Procesa una peticion para recuperar la lista
 * de todos los productos
 * 
 * @param {*} req   request HTTP
 * @param {*} res   response HTTP
 * @param {*} next  proxima funcion en la cadena
 */
async function getAll(req, res, next) {
    const productManager = await getProductManager()
    productManager.getProducts(req.query)
        .then((products) => {
            let response = {
                products,
                prevLink : "",
                nextLink : ""
            }
            res.status(HTTP_STATUS_CODES.SUCESS).send({ response })
        })
        .catch(next)
}

/**
 * Procesa una peticion para recuperar un 
 * producto a partir de su identificador
 * 
 * @param {*} req   request HTTP
 * @param {*} res   response HTTP
 * @param {*} next  proxima funcion en la cadena
 */
async function getById(req, res, next) {
    const productManager = await getProductManager()
    productManager.getProductById(req.params.id)
        .then((products) => res.status(HTTP_STATUS_CODES.SUCESS).send({products}))
        .catch(next)
}

/**
 * Procesa una peticion para crear un nuevo
 * producto
 * 
 * @param {*} req   request HTTP
 * @param {*} res   response HTTP
 * @param {*} next  proxima funcion en la cadena
 */
async function create(req, res, next) {
    const productManager = await getProductManager()
    productManager.addProduct(req.body)
        .then((pid) => res.status(HTTP_STATUS_CODES.CREATED).send({pid : pid}))
        .catch(next)
}

/**
 * Procesa una peticion para actualzar un 
 * producto existente
 * 
 * @param {*} req   request HTTP
 * @param {*} res   response HTTP
 * @param {*} next  proxima funcion en la cadena
 */
async function update(req, res, next) {
    const productManager = await getProductManager()
    productManager.updateProduct(req.params.id, req.body)
        .then(() => res.status(HTTP_STATUS_CODES.SUCESS).send())
        .catch(next)
}

/**
 * Procesa una peticion para borrar un 
 * producto existente
 * 
 * @param {*} req   request HTTP
 * @param {*} res   response HTTP
 * @param {*} next  proxima funcion en la cadena
 */
async function remove(req, res, next) {
    const productManager = await getProductManager()
    productManager.deleteProduct(req.params.id)
        .then(() => res.status(HTTP_STATUS_CODES.SUCESS).send())
        .catch(next)
}

const productController = {
    remove,
    update,
    create,
    getById,
    getAll
}

export default productController