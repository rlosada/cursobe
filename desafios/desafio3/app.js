import { ERROR_CODES, CustomError } from "./customError.js";
import express from 'express'
import { ProductManager } from "./ProductManager.js";

const PORT = 8080
const pm = new ProductManager('.')

export const HTTP_STATUS_CODES = Object.freeze({
    SUCESS : 200,
    BAD_REQUEST : 400,
    NOT_FOUND : 404,
    INTERNAL_SERVER_ERROR : 500
})

function buildErrorBody(message) {
    return { error : message}
}

function sendInternalServerError(res) {
    res
    .status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR)
    .send(buildErrorBody("An internal server error ocurred, please try again later."));
}

/**
 * Inicializa el procesamiento de /products
 * 
 * @param  app  Aplicacion de express a configurar
 */
function prepareGetAllProducts(app) {
   
    app.get("/products", 
    (req, res, next) => {
        // Recuperar el arreglo de productos
        pm.getProducts()
            .then((products) => { 
                res.locals.products = products
                next()
            })
            .catch(next)
    },
    (req, res, next) => {
        // Determinar si vino o no limit, si no vino devolver todo
        if(!req.query.limit) 
            next('route')
        else
            next()
    },
    (req, res, next) => { 
        // Recuperar y validar el valor de limit
        let limit = parseInt(req.query.limit)
        if (isNaN(limit) || limit < 0) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).send(buildErrorBody(`Value ${req.query.limit} is not a valid limit. It must be a positive integer value.`))
            return            
        }
        res.locals.limit = limit
        next()
    },
    (req, res, next) => {
        // Limitar el arreglo de productos segun lo solicitado por el usuario
        if(res.locals.limit >= res.locals.products.length)
            next('route')
        let products = []
        for(let i = 0; i < res.locals.limit; i++)
            products.push(res.locals.products[i])
        res.locals.products = products
        next()
    })
    app.get('/products', 
        (req, res, next) => { 
            console.log('send response')
            console.log(`${res.locals.products}`)
            res.status(HTTP_STATUS_CODES.SUCESS).send({ products : res.locals.products })
        }
    )
    app.use((error, req, res, next) => {
        sendInternalServerError(res)
    })

}

/**
 * Inicializa el procesamiento de /products/:pid
 * 
 * @param  app  Aplicacion de express a configurar
 */
function prepareGetProduct(app) {
   
    app.get("/products/:pid", 
    (req, res, next) => {
        // El parametro pid debe ser un numero positivo
        let id = parseInt(req.params.pid)
        if (isNaN(id) || id <= 0) {
            res.status(HTTP_STATUS_CODES.BAD_REQUEST).send(buildErrorBody(`Value ${req.params.pid} is not a valid product id number. It must be a positive integer value.`))
            return
        }
        res.locals.id = id
        next()
    }
    ,
    (req, res, next) => {
        // Recuperar el arreglo de productos
        pm.getProducts()
            .then((products) => { 
                res.locals.products = products
                next()
            })
            .catch(next)
    },
    (req, res, next) => {
        // Determinar si existe el producto cuyo id sea el solicitado
        if(res.locals.id > res.locals.products.length) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).send(buildErrorBody(`Product id ${req.params.pid} not found.`))
            return   
        }
        res.locals.product = res.locals.products[res.locals.id - 1]
        next()
    },
    (req, res, next) => { 
        res.status(HTTP_STATUS_CODES.SUCESS).send({ product : res.locals.product })
    }
    )
    app.use((error, req, res, next) => {
        sendInternalServerError(res)
    })
}

/**
 * Inicializa la aplicacion de express
 * 
 * @param  app  Aplicacion de express a configurar
 */
function prepare(app) {
    prepareGetAllProducts(app)
    prepareGetProduct(app)
    return
}

/**
 * Entry point de la aplicacion
 * 
 */
function main() {
    const app = express()
    prepare(app)
    app.listen(PORT, () => { console.log(`Listening at port ${PORT}`)})  
}

main()