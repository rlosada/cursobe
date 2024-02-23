import { CustomError, CUSTOM_ERROR_TYPES } from "../../misc/customError.js";
import { SM_ERROR_CODES } from "../../adapters/storage/fs/StorageManagerFile.js";
import mongoose from "mongoose";
import {validatePositiveIntBase10} from '../../misc/utils.js'

// Codigos de error
export const CM_ERROR_CODES = Object.freeze({
    ERROR_OK : 0,
    ERROR_UNDEFINED_OR_NULL : -1,
    ERROR_CART_NOT_FOUND : -2,
    ERROR_CART_PRODUCT_NOT_FOUND : -3,
    ERROR_CART_INVALID_PRODUCTS_ID : -4,
    ERROR_CART_INVALID_PRODUCTS_QUANTITY : -5,
    ERROR_CART_INTERNAL_ERROR : -6
})

function error_2_str(error_code) {
    switch(error_code) {
        case CM_ERROR_CODES.ERROR_CART_NOT_FOUND: return "ERROR_CART_NOT_FOUND"               
        case CM_ERROR_CODES.ERROR_CART_INVALID_PRODUCTS_ID: return "ERROR_CART_INVALID_PRODUCTS_ID"    
        case CM_ERROR_CODES.ERROR_CART_PRODUCT_NOT_FOUND: return "ERROR_CART_PRODUCT_NOT_FOUND"            
        case CM_ERROR_CODES.ERROR_UNDEFINED_OR_NULL: return "ERROR_UNDEFINED_OR_NULL"        
        case CM_ERROR_CODES.ERROR_CART_INVALID_PRODUCTS_QUANTITY: return "ERROR_CART_INVALID_PRODUCTS_QUANTITY"   
        case CM_ERROR_CODES.ERROR_CART_INTERNAL_ERROR : return "ERROR_CART_INTERNAL_ERROR"      
        default: return "UNKOWN_ERROR_CODE"
    }
}

function error_2_type(error_code) {
    switch(error_code) {
        case CM_ERROR_CODES.ERROR_CART_NOT_FOUND: 
            return CUSTOM_ERROR_TYPES.EMPTY

        case CM_ERROR_CODES.ERROR_UNDEFINED_OR_NULL:
            return CUSTOM_ERROR_TYPES.PARAMETER

        case CM_ERROR_CODES.ERROR_CART_PRODUCT_NOT_FOUND:  // Hay alguna inconsistencia en los datos almacenados          
        default: 
            return CUSTOM_ERROR_TYPES.INTERNAL
    }
}

const createError = (errorCode, msg) => new CustomError(error_2_type(errorCode), errorCode, error_2_str(errorCode), (msg === undefined) ? "" : msg)  


export default class CartManager {
    #logger
    #model

    constructor(mongoModel, logger) {
        this.#model = mongoModel
        this.#logger = logger
        this.#logger?.Info('Constructor', `New CartManagerMongo created`)
    }

    /**
     * Recupera el producto con el id especificado
     *
     * @param {string} cid Identificador del carrito
     *
     */
    async getCartProductsInfo(cid) {
        const collection = this.#model
        const logger = this.#logger
        let cart 
        
        try {
            cart = await collection.findOne({ _id : cid }).lean().populate('productsInfo.pid')
        } catch(err) {
            logger.Error(`${this.constructor.name}|getCartProductsInfo`, `Fail to get cart from database, error=${err}`)
            throw createError(CM_ERROR_CODES.ERROR_CART_INTERNAL_ERROR)
        }

        if(cart === null) 
            throw createError(CM_ERROR_CODES.ERROR_CART_NOT_FOUND, `cart ${cid} was not found on storage`)

        // Generar un arreglo de productos y a cada uno agregarle el campo quantity. Es posible que el producto
        // referenciado en el carrito no exista mas y por lo tanto es por eso que si eso sucede pi.pid no existe
        // dicho producto no se agrega al array. En ese caso habria que eliminarlo del carrito
        let products = []
        cart.productsInfo.forEach( pi => { 
            let { quantity } = pi
            if(pi.pid) {
                let {_id, __v, ...product}   = pi.pid
                products.push({ quantity: pi.quantity , ...product}) 
            }
        })
        
        console.log(JSON.stringify(products))

        return products
    }

    async updateCart(cid, productsInfo) {
        const collection = this.#model

        // verificar el formato de lo recibido
        this.#checkcartProdInfo(productsInfo)

        let cart 
        try {
            cart = await collection.findOne({ _id : cid })
        } catch(err) {
            logger.Error(`${this.constructor.name}|addCartAddProduct`, `Fail to get cart from database, error=${err}`)
            throw createError(CM_ERROR_CODES.ERROR_CART_INTERNAL_ERROR)
        }        

        this.#logger.Info(`${this.constructor.name}|updateCart`, 'Processing update cart request')        

        // Limpiar el arreglo
        cart.productsInfo = []

        console.log(typeof productsInfo)

        // Cargar los nuevos valores
        productsInfo.productsInfo.forEach( v => cart.productsInfo.push( v ))
        
        await collection.updateOne({_id : cid}, cart)


        return
    }



    async addCart(cart) {
        const collection = this.#model

        // verificar el formato de lo recibido
        this.#checkcartProdInfo(cart)

        this.#logger.Info(`${this.constructor.name}|addCart`, 'Processing add cart request')        


        let { _id } =await collection.create(cart)

        return _id.toString()
    }


    async cartRmvProduct(cid, pid) {
        const collection = this.#model
        const logger = this.#logger
        logger.Info(`${this.constructor.name}|cartRmvProduct`, `Trying to remove product ${pid} from cart ${cid}`)
        try {
           let result =  await collection.updateOne(
                { _id : cid },
                { $pull : { productsInfo : { pid : pid } } }
            )

            // Determinar que sucedio
            let { matchedCount, modifiedCount} = result
            
            // No se econtro el carrito
            if(!matchedCount) 
                throw createError(CM_ERROR_CODES.ERROR_CART_NOT_FOUND, `cart ${cid} was not found on storage`)
            // No se econtro el carrito
            if(!modifiedCount)
                throw createError(CM_ERROR_CODES.ERROR_CART_PRODUCT_NOT_FOUND, `pid ${pid} not found inside cart ${cid} on storage`)
       
        } catch(err) {
            logger.Error(`${this.constructor.name}|cartRmvProduct`, `Fail to remove item from cart, error=${err}`)
            throw createError(CM_ERROR_CODES.ERROR_CART_INTERNAL_ERROR)
        }
    }

    async cartEmpty(cid, pid) {
        const collection = this.#model
        const logger = this.#logger
       
        logger.Info(`${this.constructor.name}|cartEmpty`, `Trying to empty cart ${cid}`)

        try {
            let result = await collection.updateOne(
                { _id : cid },
                { $unset : { productsInfo : "" } }
            )

            // Determinar que sucedio
            let { matchedCount } = result
            
            // No se econtro el carrito
            if(!matchedCount) 
                throw createError(CM_ERROR_CODES.ERROR_CART_NOT_FOUND, `cart ${cid} was not found on storage`)

            // Si ya estaba vacio, considerar OK

        } catch(err) {
            logger.Error(`${this.constructor.name}|cartEmpty`, `Fail to empty cart, error=${err}`)
            throw createError(CM_ERROR_CODES.ERROR_CART_INTERNAL_ERROR)
        }
    }    

    /**
     * Agrega un nuevo producto al carrito
     *
     * @param {string} cid Identificador del carrito
     * @param {string} pid Identificador del producto
     *
     */    
    async addCartAddProduct(cid, pid) {
        const collection = this.#model
        const logger = this.#logger
        let cart 
        
        try {
            cart = await collection.findOne({ _id : cid })
        } catch(err) {
            logger.Error(`${this.constructor.name}|addCartAddProduct`, `Fail to get cart from database, error=${err}`)
            throw createError(CM_ERROR_CODES.ERROR_CART_INTERNAL_ERROR)
        }

        if(cart === null) 
            throw createError(CM_ERROR_CODES.ERROR_CART_NOT_FOUND, `cart ${cid} was not found on storage`)

        // Buscar si el pid existe en el arreglo. Si existe incrementar en uno el quantity y sino, pushear al arreglo una nueva entrada  
        let i
        const oid = new mongoose.Types.ObjectId(pid)
        for(i = 0; i < cart.productsInfo.length; i++) {
            const elem = cart.productsInfo[i]
            if(oid.equals(elem.pid)) {
                elem.quantity += 1
                break;
            }
        }
        if(i === cart.productsInfo.length) {
            cart.productsInfo.push({pid: oid, quantity : 1})
        }

        await collection.updateOne({_id : cid}, cart)

        return 
    }

    /**
     * Modifica la cantidad de productos de un carrito
     * @param {number} cid  Identificador del carrito
     * @param {number} pid  Identificador del producto
     * @param {number} quantity Nueva cantidad del producto
     */
    async cartUpProductQty(cid, pid, quantity) {
        const collection = this.#model
        const logger = this.#logger

       
        if(!validatePositiveIntBase10(quantity))
            throw createError(ERROR_CART_INVALID_PRODUCTS_QUANTITY, `quantity of ${quantity} is not a positive integer value`)
        
        let nquantity = Number.parseInt(quantity)

        logger.Info(`${this.constructor.name}|cartUpProductQty`, `Trying to modify quantity to ${nquantity} of product ${pid} in cart ${cid}`)

        try {            
            let result = await collection.updateOne(
                { _id : cid },
                { $set : { "productsInfo.$[elem].quantity" :  nquantity} },
                { arrayFilters : [ { "elem.pid" : pid } ]}
            )

            // Determinar que sucedio
            let { matchedCount, modifiedCount} = result
            
            // No se econtro el carrito
            if(!matchedCount) 
                throw createError(CM_ERROR_CODES.ERROR_CART_NOT_FOUND, `cart ${cid} was not found on storage`)
            // No se econtro el carrito
            if(!modifiedCount)
                throw createError(CM_ERROR_CODES.ERROR_CART_PRODUCT_NOT_FOUND, `pid ${pid} not found inside cart ${cid} on storage`)

        } catch(err) {
            logger.Error(`${this.constructor.name}|cartUpProductQty`, `Fail to update quantity to ${nquantity} for product ${pid} in cart ${cid}, error=${err}`)
            throw createError(CM_ERROR_CODES.ERROR_CART_INTERNAL_ERROR)
        }
    }

    /**
            * Verifica que el producto recibido sea valido
            *
            * @param {product} product producto a verificar
            *
            * @returns ERROR_CODES.ERROR_OK si el producto es valido o algun error de ERROR_CODES en caso contrario
        */
    #checkcartProdInfo(cart) {
    let checks = [
        {
            func : (productsInfo) => Array.isArray(productsInfo), 
            field: "productsInfo",                                                                    
            ret_when_fail : CM_ERROR_CODES.ERROR_CART_INVALID_PRODUCTS_ID                                         
        }
    ]

    let checksElements = [
        {
            func : (pid) => !(pid == null), 
            field: "pid",                                                                    
            ret_when_fail : CM_ERROR_CODES.ERROR_CART_INVALID_PRODUCTS_ID                                         
        } ,
        {
            func : (quantity) => Number.isInteger(quantity) && quantity > 0, 
            field: "quantity",                                                                    
            ret_when_fail : CM_ERROR_CODES.ERROR_CART_INVALID_PRODUCTS_QUANTITY                                         
        }                 
    ]

    if(cart === undefined || cart === null)
        throw createError(CM_ERROR_CODES.ERROR_UNDEFINED_OR_NULL)

    // Verificar el carrito
    for(const check of checks) {
        if (!check.func(cart[check.field])) {
            this.#logger.Error('checkcartProdInfo', `validation failed for cart ${JSON.stringify(cart)}, value of ${check.field} is invalid}`)
            throw createError(check.ret_when_fail)
        }
        // Verificar las entradas del carrito
        cart.productsInfo.forEach(pi => {
            console.log(pi)
            for(const checkElement of checksElements) {  
                if (!checkElement.func(pi[checkElement.field])) {
                    this.#logger.Error('checkcartProdInfo', `validation failed for element ${JSON.stringify(pi)} of cart, value of ${checkElement.field} is invalid`)
                    throw createError(checkElement.ret_when_fail)
                }
            }        
        });
    }

    return
}    
}