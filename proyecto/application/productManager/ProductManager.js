import { CustomError, CUSTOM_ERROR_TYPES } from "../../misc/customError.js";
import { SM_ERROR_CODES } from "../../adapters/storage/fs/StorageManagerFile.js";
import { APP_EVENTS } from "../../adapters/restAPI/public/js/events.js";
import adjustQueryParams from "./ProductManagerQueryParams.js";
import { MAX_TITLE_SIZE, MAX_DESCRIPTION_SIZE} from '../../misc/constants.js'



// Codigos de error
export const PM_ERROR_CODES = Object.freeze({
    ERROR_OK : 0,
    ERROR_UNDEFINED_OR_NULL: -1,
    ERROR_TITLE : -2,
    ERROR_DESCRIPTION : -3,
    ERROR_PRICE : -4,
    ERROR_THUMBNAIL : -5,
    ERROR_CODE : -6,
    ERROR_STOCK : -7,
    ERROR_CODE_REPEATED : -8,
    ERROR_CODE_ID : -9,
    ERROR_DUPLICATED_ID : -10,
    ERROR_PRODUCT_NOT_FOUND : -11,
    ERROR_STATUS : -12,
    ERROR_CATEGORY : -13
})

function error_2_str(error_code) {
    switch(error_code) {
        case PM_ERROR_CODES.ERROR_OK: return "OK"
        case PM_ERROR_CODES.ERROR_UNDEFINED_OR_NULL_OR_EMPTY: return "ERROR_UNDEFINED_OR_NULL_OR_EMPTY"
        case PM_ERROR_CODES.ERROR_TITLE: return "ERROR_TITLE"
        case PM_ERROR_CODES.ERROR_DESCRIPTION: return "ERROR_DESCRIPTION"
        case PM_ERROR_CODES.ERROR_PRICE: return "ERROR_PRICE"
        case PM_ERROR_CODES.ERROR_THUMBNAIL: return "ERROR_THUMBNAIL"
        case PM_ERROR_CODES.ERROR_CODE: return "ERROR_CODE"
        case PM_ERROR_CODES.ERROR_STOCK: return "ERROR_STOCK"
        case PM_ERROR_CODES.ERROR_CODE_REPEATED: return "ERROR_CODE_REPEATED"
        case PM_ERROR_CODES.ERROR_CODE_ID: return "ERROR_CODE_ID"
        case PM_ERROR_CODES.ERROR_DUPLICATED_ID: return "ERROR_DUPLICATED_ID"
        case PM_ERROR_CODES.ERROR_PRODUCT_NOT_FOUND: return "ERROR_PRODUCT_NOT_FOUND"                                                                                
        case PM_ERROR_CODES.ERROR_STATUS: return "ERROR_STATUS"      
        case PM_ERROR_CODES.ERROR_CATEGORY: return "ERROR_CATEGORY"
        default: return "UNKOWN_ERROR_CODE"
    }
}

function error_2_type(error_code) {
    switch(error_code) {
        case PM_ERROR_CODES.ERROR_UNDEFINED_OR_NULL_OR_EMPTY:
        case PM_ERROR_CODES.ERROR_TITLE: 
        case PM_ERROR_CODES.ERROR_DESCRIPTION: 
        case PM_ERROR_CODES.ERROR_PRICE: 
        case PM_ERROR_CODES.ERROR_THUMBNAIL: 
        case PM_ERROR_CODES.ERROR_CODE: 
        case PM_ERROR_CODES.ERROR_STOCK:
        case PM_ERROR_CODES.ERROR_CODE_REPEATED:
        case PM_ERROR_CODES.ERROR_CODE_ID:
        case PM_ERROR_CODES.ERROR_DUPLICATED_ID:
        case PM_ERROR_CODES.ERROR_STATUS: 
        case PM_ERROR_CODES.ERROR_CATEGORY:
            return CUSTOM_ERROR_TYPES.PARAMETER

        case PM_ERROR_CODES.ERROR_PRODUCT_NOT_FOUND: 
            return CUSTOM_ERROR_TYPES.EMPTY

        default: 
            return CUSTOM_ERROR_TYPES.INTERNAL
    }
}

const createError = (type, errorCode, msg) => new CustomError(type, errorCode, error_2_str(errorCode), (msg === undefined) ? "" : msg)  


export default class ProductManager {
    // Administrador de elementos
    #sm
    #logger
    #em
    #name = "ProductManager"

    constructor(storageManager, logger, eventManager) {
        this.#sm = storageManager
        this.#logger = logger
        this.#em = eventManager
        this.#logger?.Info('Constructor', `New ProductManager created`)
        eventManager.registerEvent(this.#name, APP_EVENTS.EV_PROD_LIST_REQ, this.#procProductListRequest.bind(this))
    }

    #procProductListRequest() {
        this.#logger?.Info(`${this.#name}|procProductListRequest`, `Processing ${APP_EVENTS.EV_PROD_LIST_REQ}`)   
        this.getProducts()
            .then((products) => {
                this.#em.sendEvent(this.#name, APP_EVENTS.EV_PROD_LIST_RESP, products)
            })    
    }

    async #sendProductListUpdate() {
        let products = await this.getProducts()
        this.#em.sendEvent(this.#name, APP_EVENTS.EV_PROD_LIST_UPDATE, products)
    }

    /**
     * Recupera el producto con el id especificado
     *
     * @param {string} id Identificador del producto buscado
     *
     */
    async getProductById(id) {
        
        let product 
        try {
            product = await this.#sm.getElementById(id)
        } catch(err) {
            if(err instanceof CustomError && err.getCode() === SM_ERROR_CODES.ERROR_ELEMENT_NOT_FOUND)
                throw createError(CUSTOM_ERROR_TYPES.EMPTY, PM_ERROR_CODES.ERROR_PRODUCT_NOT_FOUND, `product id ${id} was not found on storage`)
            else
                throw err              
        }
        this.#checkProduct(product)
        return product
    }



    async getProducts(queryParams) {

        let products = await this.#sm.getElements(adjustQueryParams(queryParams))

        if(products) {
            // some() aplica la funcion a cada producto del arreglo, si alguno
            // no es un producto valido se sale con una excepcion. Si en cambio
            // todos son validos devolver el arreglo
            products.payload.some(this.#checkProduct.bind(this))
        }

        return products
    }

    async updateProduct(id, product) {
        this.#checkProduct(product, true)
        await this.#sm.updateElement(id, product)
    }

    async addProduct(product) {
        this.#checkProduct(product, true)
        let pid = await this.#sm.addElement(product)
        this.#sendProductListUpdate()
        return pid
    }

    async deleteProduct(id) {
        await this.#sm.deleteElement(id)
        this.#sendProductListUpdate()
    }

    /**
         * Verifica que el producto recibido sea valido
         *
         * @param {product} product producto a verificar
         * @param {boolean} input verdadero si el producto viene del usuario
         *
         * @returns ERROR_CODES.ERROR_OK si el producto es valido o algun error de ERROR_CODES en caso contrario
         */
    #checkProduct(product, input) {
        let checks = [
            {
                func : (title) => (typeof title === "string") && (title.length <= MAX_TITLE_SIZE),  // funcion de verificacion a ejecutar
                field: "title",                                                                     // atributo del objeto sobre el cual aplicar la funcion de verificacion
                ret_when_fail : PM_ERROR_CODES.ERROR_TITLE                                             // resultado a devolver si la funcion de verificacion devuelva "false"
            },
            {
                func : (desc) => (typeof desc === "string") && (desc.length <= MAX_DESCRIPTION_SIZE),
                field: "description",
                ret_when_fail : PM_ERROR_CODES.ERROR_DESCRIPTION
            },
            {
                func : (price) => (typeof price === "number") && ( price >= 0),
                field: "price",
                ret_when_fail : PM_ERROR_CODES.ERROR_PRICE
            },
            {
                func : (code) => (typeof code === "string") /* && (/^[a-z0-9]+$/gi.test(code))*/,
                field: "code",
                ret_when_fail : PM_ERROR_CODES.ERROR_CODE
            },
            {
                func : (stock) => (typeof stock === "number") && (Number.isInteger(stock)) && stock >= 0,
                field: "stock",
                ret_when_fail : PM_ERROR_CODES.ERROR_STOCK
            },
            {
                func : (thumbnails) => {
                    if(thumbnails === undefined)
                        return true
                    else if (Array.isArray(thumbnails) && !thumbnails.some(v => typeof v !== "string"))
                        return true
                    else
                        return false
                },
                field: "thumbnails",
                ret_when_fail : PM_ERROR_CODES.ERROR_THUMBNAIL
            },
            {
                func : (status) => (typeof status === "boolean"),
                field: "status",
                ret_when_fail : PM_ERROR_CODES.ERROR_STATUS
            },
            {
                func : (category) => (typeof category === "string") ,
                field: "category",
                ret_when_fail : PM_ERROR_CODES.ERROR_CATEGORY
            },           
        ]

        // Depende de donde viene el producto (del usuario o el storage) el tipo de error es diferente
        let error_type = (input) ? CUSTOM_ERROR_TYPES.PARAMETER : CUSTOM_ERROR_TYPES.INTERNAL

        if(product === undefined || product === null) {
            this.#logger?.Error('checkProduct', `Product is undefined or null`)
            throw createError(error_type, PM_ERROR_CODES.ERROR_UNDEFINED_OR_NULL)
        }
        
        for(const check of checks) {
            if (!check.func(product[check.field])) {
                this.#logger?.Error('checkProduct', `Product ${JSON.stringify(product)} field ${check.field} validation failed`)
                throw createError(error_type, check.ret_when_fail)
            }
        }

        return
    }
}