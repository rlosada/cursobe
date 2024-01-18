import { CustomError, CUSTOM_ERROR_TYPES } from "../../misc/customError.js";
import { SM_ERROR_CODES } from "../../adapters/storage/StorageManagerFile.js";
import { PM_ERROR_CODES } from "../productManager/ProductManager.js";
import CartManagerInstance from "./CartManagerInstance.js";

// Codigos de error
export const CM_ERROR_CODES = Object.freeze({
    ERROR_OK : 0,
    ERROR_UNDEFINED_OR_NULL : -1,
    ERROR_CART_NOT_FOUND : -2,
    ERROR_CART_PRODUCT_NOT_FOUND : -3,
    ERROR_CART_INVALID_PRODUCTS_ID : -4,
    ERROR_CART_INVALID_PRODUCTS_QUANTITY : -5
})

function error_2_str(error_code) {
    switch(error_code) {
        case CM_ERROR_CODES.ERROR_CART_NOT_FOUND: return "ERROR_CART_NOT_FOUND"               
        case CM_ERROR_CODES.ERROR_CART_INVALID_PRODUCTS_ID: return "ERROR_CART_INVALID_PRODUCTS_ID"    
        case CM_ERROR_CODES.ERROR_CART_PRODUCT_NOT_FOUND: return "ERROR_CART_PRODUCT_NOT_FOUND"            
        case CM_ERROR_CODES.ERROR_UNDEFINED_OR_NULL: return "ERROR_UNDEFINED_OR_NULL"        
        case CM_ERROR_CODES.ERROR_CART_INVALID_PRODUCTS_QUANTITY: return "ERROR_CART_INVALID_PRODUCTS_QUANTITY"          
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
    #sm
    #pm
    #logger

    constructor(storageManager, productManager, logger) {
        this.#sm = storageManager
        this.#pm = productManager
        this.#logger = logger
        this.#logger?.Info('Constructor', `New CartManager created`)
    }

    /**
     * Recupera el producto con el id especificado
     *
     * @param {number} cid Identificador del carrito
     *
     */
    async getCartProductsInfo(cid) {
        // Recuperar el carrito        
        let cart 
        
        try {
            cart = await this.#sm.getElementById(cid)
        } catch(err) {
            if(err instanceof CustomError && err.getCode() === SM_ERROR_CODES.ERROR_ELEMENT_NOT_FOUND)
                throw createError(CM_ERROR_CODES.ERROR_CART_NOT_FOUND, `cart ${cid} was not found on storage`)
            else
                throw err
        }

        this.#checkcartProdInfo(cart)

        // Recuperar los elementos del carrito
        const productsWithQuantity = await Promise.all(
            cart.productsInfo.map(async (pi) => { 
                let product 
                try {
                    product = await this.#pm.getProductById(pi.pid) 
                } catch(err) {
                    if(err instanceof CustomError && err.getCode() === PM_ERROR_CODES.ERROR_PRODUCT_NOT_FOUND)
                        throw createError(CM_ERROR_CODES.ERROR_CART_PRODUCT_NOT_FOUND, `product ${pi.pid} was not found on storage`)
                    else
                        throw err  
                }
                return { quantity: pi.quantity, ...product}
            })
        )
        return productsWithQuantity
    }

    async addCart(cart) {
        console.log(cart)
        
        // verificar el formato de lo recibido
        this.#checkcartProdInfo(cart)

        // Verificar que los productos existan
        for(let i = 0; i < cart.productsInfo.length; i++) {
            let pi = cart.productsInfo[i]
            try {
                await this.#pm.getProductById(pi.pid)
            } catch(err) {
                if(err instanceof CustomError && err.getCode() === PM_ERROR_CODES.ERROR_PRODUCT_NOT_FOUND)
                    throw createError(CM_ERROR_CODES.ERROR_UNDEFINED_OR_NULL, `product ${pi.pid} was not found on storage`) // para que mande 404 - bad params (corregir)
                else
                    throw err    
            }
        }

        let cid = await this.#sm.addElement(cart)
        this.#logger.Info('addCart', `New cart added with cid ${cid}`)

        return cid
    }

    /**
     * Agrega un nuevo producto al carrito
     *
     * @param {number} cid Identificador del carrito
     * @param {number} pid Identificador del producto
     *
     */    
    async addCartAddProduct(cid, pid) {
        this.#logger.Info('addCartAddProduct', `Trying to add product ${pid} to cart ${cid}`)
        // Recuperar el carrito
        let cart 
        try {
            cart = await this.#sm.getElementById(cid)
        } catch(err) {
            if(err instanceof CustomError && err.getCode() === SM_ERROR_CODES.ERROR_ELEMENT_NOT_FOUND)
                throw createError(CM_ERROR_CODES.ERROR_CART_NOT_FOUND, `cart ${cid} was not found on storage`)
            else
                throw err       
        }
        // Verificar que el producto exista
        let dummy 
        try {
            dummy = await this.#pm.getProductById(pid)
        } catch(err) {
            if(err instanceof CustomError && err.getCode() === PM_ERROR_CODES.ERROR_ELEMENT_NOT_FOUND)
                throw createError(CM_ERROR_CODES.ERROR_CART_INVALID_PRODUCTS_ID, `product id ${pid} was not found on storage`)
            else
                throw err            
        }
        // Agregar al carrito el pid
        let index = cart.productsInfo.findIndex( e => e.pid === pid)
        if(index >= 0) {
            cart.productsInfo[index].quantity++
            this.#logger.Info('addCartAddProduct', `Product ${pid} already exists, increment count to ${cart.productsInfo.quantity}`)
        } 
        else {
            cart.productsInfo.push({ "pid" : pid, "quantity" : 1 })
            this.#logger.Info('addCartAddProduct', `Product ${pid} was not on cart, adding one`)
        }
        this.#sm.updateElement(cid, cart)
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
                func : (pid) => Number.isInteger(pid) && pid > 0, 
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