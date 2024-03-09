import { CustomError, CUSTOM_ERROR_TYPES } from "../../misc/customError.js";
import { checkHash, hashString } from "../../misc/utils.js";
import { validateUser } from "./UserValidator.js";


// Codigos de error
export const CM_ERROR_CODES = Object.freeze({
    ERROR_OK : 0,
    ERROR_UNDEFINED_OR_NULL : -1,
    ERROR_USER_NOT_FOUND : -2,
    ERROR_CART_PRODUCT_NOT_FOUND : -3,
    ERROR_CART_INVALID_PRODUCTS_ID : -4,
    ERROR_CART_INVALID_PRODUCTS_QUANTITY : -5,
    ERROR_USER_INTERNAL_ERROR : -6
})

function error_2_str(error_code) {
    switch(error_code) {
        case CM_ERROR_CODES.ERROR_USER_NOT_FOUND: return "ERROR_CART_NOT_FOUND"               
        case CM_ERROR_CODES.ERROR_CART_INVALID_PRODUCTS_ID: return "ERROR_CART_INVALID_PRODUCTS_ID"    
        case CM_ERROR_CODES.ERROR_CART_PRODUCT_NOT_FOUND: return "ERROR_CART_PRODUCT_NOT_FOUND"            
        case CM_ERROR_CODES.ERROR_UNDEFINED_OR_NULL: return "ERROR_UNDEFINED_OR_NULL"        
        case CM_ERROR_CODES.ERROR_CART_INVALID_PRODUCTS_QUANTITY: return "ERROR_CART_INVALID_PRODUCTS_QUANTITY"   
        case CM_ERROR_CODES.ERROR_USER_INTERNAL_ERROR : return "ERROR_CART_INTERNAL_ERROR"      
        default: return "UNKOWN_ERROR_CODE"
    }
}

function error_2_type(error_code) {
    switch(error_code) {
        case CM_ERROR_CODES.ERROR_USER_NOT_FOUND: 
            return CUSTOM_ERROR_TYPES.EMPTY

        case CM_ERROR_CODES.ERROR_UNDEFINED_OR_NULL:
            return CUSTOM_ERROR_TYPES.PARAMETER

        case CM_ERROR_CODES.ERROR_CART_PRODUCT_NOT_FOUND:  // Hay alguna inconsistencia en los datos almacenados          
        default: 
            return CUSTOM_ERROR_TYPES.INTERNAL
    }
}

const createError = (errorCode, msg) => new CustomError(error_2_type(errorCode), errorCode, error_2_str(errorCode), (msg === undefined) ? "" : msg)  


export default class UsersManager {
    #logger
    #model

    constructor(mongoModel, logger) {
        this.#model = mongoModel
        this.#logger = logger
        this.#logger?.Info('Constructor', `New UsersManager created`)
    }

    /**
     * Recupera el objeto que representa al usuario
     *
     * @param {string} email Email del usuario
     * @param {string} password Password en texto plano
     *
     */
    async getUserByEmailAndPass(email, password) {
        const collection = this.#model
        const logger = this.#logger
        let user 
        
        try {
            user = await collection.findOne({ email }).lean()
        } catch(err) {
            logger.Error(`${this.constructor.name}|getUserByEmailAndPass`, `Fail to get user from database, error=${err}`)
            throw createError(CM_ERROR_CODES.ERROR_USER_INTERNAL_ERROR)
        }

        if(user === null) {
            logger.Error(`${this.constructor.name}|getUserByEmailAndPass`, `No results found`)
            return null
        }

        // Verificar password
        let rc = await checkHash(password, user.password) 
        if(!rc) {
            logger.Error(`${this.constructor.name}|getUserByEmailAndPass`, `Invalid password`)
            return null  
        }

        if(!(validateUser(user)))
            return null

        return user
    }

    async addUser(user) {
        const collection = this.#model
        const logger = this.#logger

        let {password, ...rest} = user

        // Hashear el password
        let hashedPassword = await hashString(password)

        user = {...rest, password : hashedPassword}

       if(!validateUser(user)) {
            logger.Error(`${this.constructor.name}|addUser`, `Validation of user object failed, rejecting request`)      
            return false       
        }

        logger.Info(`${this.constructor.name}|addUser`, `Trying to add new user ${JSON.stringify(user)}`)   

        try {
            await collection.create(user)   
        } catch(error) {
            logger.Error(`${this.constructor.name}|addUser`, `Creation of user failed, error=${JSON.stringify(error)}`)   
            return false 
        }

        return true
    }
}    
