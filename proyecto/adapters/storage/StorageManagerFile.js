import * as fs from 'node:fs/promises'
import { CustomError, CUSTOM_ERROR_TYPES } from '../../misc/customError.js'


export const SM_ERROR_CODES = Object.freeze({
    ERROR_OK : 0,
    ERROR_UNDEFINED_OR_NULL_OR_EMPTY: -1,
    ERROR_CODE_ID : -9,
    ERROR_DUPLICATED_ID : -10,
    ERROR_ELEMENT_NOT_FOUND : -11,
    ERROR_INVALID_CONSTRUCTOR_PARAMS : -12,
    ERROR_INVALID_PARAMETERS : -13
})


function error_2_str(error_code) {
    switch(error_code) {
        case SM_ERROR_CODES.ERROR_OK: return "OK"
        case SM_ERROR_CODES.ERROR_UNDEFINED_OR_NULL_OR_EMPTY: return "ERROR_UNDEFINED_OR_NULL_OR_EMPTY"
        case SM_ERROR_CODES.ERROR_CODE_ID: return "ERROR_CODE_ID"
        case SM_ERROR_CODES.ERROR_DUPLICATED_ID: return "ERROR_DUPLICATED_ID"
        case SM_ERROR_CODES.ERROR_ELEMENT_NOT_FOUND: return "ERROR_ELEMENT_NOT_FOUND"
        case SM_ERROR_CODES.ERROR_INVALID_CONSTRUCTOR_PARAMS: return "ERROR_INVALID_CONSTRUCTOR_PARAMS"
        case SM_ERROR_CODES.ERROR_INVALID_PARAMETERS: return "ERROR_INVALID_PARAMETERS"
        default: return "UNKOWN_ERROR_CODE"
    }
}


function error_2_type(error_code) {
    switch(error_code) {
        case SM_ERROR_CODES.ERROR_UNDEFINED_OR_NULL_OR_EMPTY:
        case SM_ERROR_CODES.ERROR_CODE_ID: 
        case SM_ERROR_CODES.ERROR_DUPLICATED_ID: 
        case SM_ERROR_CODES.ERROR_INVALID_CONSTRUCTOR_PARAMS: 
        case SM_ERROR_CODES.ERROR_INVALID_PARAMETERS: 
            return CUSTOM_ERROR_TYPES.PARAMETER

        case SM_ERROR_CODES.ERROR_ELEMENT_NOT_FOUND: 
            return CUSTOM_ERROR_TYPES.EMPTY

        default: 
            return CUSTOM_ERROR_TYPES.INTERNAL
    }
}

const createError = (errorCode, msg) => new CustomError(error_2_type(errorCode), errorCode, error_2_str(errorCode), (msg === undefined) ? "" : msg)  


const FIRST_ID = 1  // minimo id de elemento


export class StorageManagerFile {

    // ubicacion del archivo de elementos
    #path

    // nombre del archivo de elementos
    #filename

    #logger 

    constructor(path, filename, logger) { 

        if(path == null || filename == null)
            throw createError(SM_ERROR_CODES.ERROR_INVALID_CONSTRUCTOR_PARAMS, `fail to build StorageManagerFile, invalid constructor parameters`)       

        this.#path = path
        this.#filename = filename
        this.#logger = logger
        
        this.#logger?.Info('Constructor', `New StorageManager created with path=${path}, filename=${filename} `)
    }

    /**
     * Verifica la validez de un identificador de elemento
     * 
     * @param {number} id Identificador de un elemento
     */
    #checkElementId(id) {
        if (id == null || typeof id !== 'number' || !Number.isInteger(id) || id < FIRST_ID)
            throw createError(SM_ERROR_CODES.ERROR_CODE_ID, `id ${id} is invalid, it must be a positive integer greather or equal than ${FIRST_ID}`)       
    }

    /**
     * Recupera el elemento cuyo id es el especificado. En caso
     * de error lanza una excepcion
     * 
     * @param {number} id Identificador del elemento buscado
     * 
     * @returns elemento s/id
     * 
     */
    async getElementById(pid) {
        this.#checkElementId(pid)
        
        const elementsWithId = await this.#loadFromFile()

        const elementWithId = elementsWithId.find(e => e.id === pid)

        if(elementWithId === undefined) 
            throw createError(SM_ERROR_CODES.ERROR_ELEMENT_NOT_FOUND)  

        let { id, ...element } = elementWithId
        return element
    }

    /**
     * Actualiza en el archivo el elemento cuyo id es el especificado. En caso
     * de error lanza una excepcion
     * 
     * @param {number} id Identificador del elemento a ser actualizado
     * @param {element} element elemento nuevo que reemplaza al existente
     */
    async updateElement(id, element) {
        this.#checkElementId(id)
        
        this.#checkElementIsEmpty(element)

        let elementsWithId = await this.#loadFromFile()

        let found = false

        // Se reemplaza el elemento viejo por el nuevo en la misma posicion
        let elementsWithIdNew = elementsWithId.map(p => {
            if(p.id === id) {
                found = true
                return {id : id, ...element}
            } else {
                return p
            }
        })

        if(found === false) {
            const err = createError(SM_ERROR_CODES.ERROR_ELEMENT_NOT_FOUND)  
            console.log(err.getString())
            throw err
        }

        this.#saveToFile(elementsWithIdNew)
    }

    /**
     * Elimina del archivo el elemento cuyo id es el especificado. En caso
     * de error o si no existe el elemento a borrar lanza una excepcion
     * 
     * @param {number} id Identificador del producto a eliminar
     * 
     */    
    async deleteElement(id) {
        this.#checkElementId(id)
     
        let elementssWithId = await this.#loadFromFile()

        let elementssWithIdNew = elementssWithId.filter(p => p.id !== id)

        if (elementssWithId.length === 0 || elementssWithId.length === elementssWithIdNew.length)
            throw createError(SM_ERROR_CODES.ERROR_ELEMENT_NOT_FOUND)      

        await this.#saveToFile(elementssWithIdNew)

        return         
    }

    /**
     * Recupera el arreglo de elementos del archivo
     * 
     * @param {} skipCount numero de elementos a saltear
     * @param {} maxCount  numero maximo de elementos a devolver
     * 
     * @returns Arreglo de elementos s/id
     */
    async getElements(queryParams) {

        let elementssWithId

        if(queryParams != null) {

            let { skipCount, maxCount } = queryParams

            const checkIfIntegerGTZero = (v) => (v != null && !isNaN(v) && Number.isInteger(v) && v >= 0)

            this.#logger.Info('getElements', `Request for elements with parameters skipCount=${skipCount}, maxCount=${maxCount}`)

            if(!checkIfIntegerGTZero(skipCount) || !checkIfIntegerGTZero(maxCount)) 
                throw createError(SM_ERROR_CODES.ERROR_INVALID_PARAMETERS, `skipCount and maxCount must be integers greater or equal to 0`)

            // Si la cantidad maxima pedida es 0, devolver arreglo vacio
            if(maxCount == 0)
                return []

            elementssWithId = await this.#loadFromFile()
            
            // Si no hay elementos o bien se piden saltear mas elementos que los existentes, devolver arreglo vacio
            if(elementssWithId.length === 0 || skipCount >= elementssWithId.length)
                return []
            
            // Acomodar la cantidad de elementos a devolver, no se pueden devolver mas de los que hay
            if(elementssWithId.length - skipCount < maxCount)
                maxCount = elementssWithId.length - skipCount

            elementssWithId = elementssWithId.slice(skipCount, skipCount + maxCount)
        }
        else {
            this.#logger.Info('getElements', `Request for all elements`)
            elementssWithId = await this.#loadFromFile()
        }
        return elementssWithId.map(elementsWithId => {let {id, ...rest} = elementsWithId; return rest})
    }

    #checkElementIsEmpty(element) {
        if(element === undefined || element === null || Object.keys(element).length === 0)
            throw createError(SM_ERROR_CODES.ERROR_UNDEFINED_OR_NULL_OR_EMPTY, `element must have at least one key`) 
    }

    /**
     * Agrega el elemento al archivo de elementos
     * 
     * @param {} element elemento a ser agregado
     */
    async addElement(element) {


        this.#checkElementIsEmpty(element)

        let elementsWithId = await this.#loadFromFile()

        // Recuperar el maximo id del arreglo
        let maxId = FIRST_ID
        let nextId

        if(elementsWithId.length > 0) {
            elementsWithId.forEach(p => {
                if (p.id > maxId) 
                    maxId = p.id
            });
            nextId = maxId + 1
        } else {
            nextId = FIRST_ID
        }

        // Agregar al arreglo el nuevo elemento
        elementsWithId.push({id : nextId, ...element})

        // Guardar en el archivo
        await this.#saveToFile(elementsWithId)

        return nextId
    }

    /**
     * Sobreescribe el archivo con el nuevo arreglo de elementos
     * 
     * @param {array} elementssWithId Arreglo de elementos c/id
     */
    async #saveToFile(elementssWithId) {
        await fs.writeFile(`${this.#path}/${this.#filename}`, JSON.stringify(elementssWithId))
    }

    /**
     * Recupera los datos del archivo JSON
     * @returns Objeto recuperado del archivo
     */
    async #loadFromFile() {
        let data 
        try {
            data = await fs.readFile(`${this.#path}/${this.#filename}`)
        } catch(err) {
            if(err.code !== 'ENOENT')
                throw err
            return []
        }
        let productsWithId = JSON.parse(data)

        let error = this.#checkProductsFromFile(productsWithId)
        if (error !== SM_ERROR_CODES.ERROR_OK) {
            productsWithId = []
        } 

        return productsWithId
    }

    /**
     * Verifica que todos los productos del arreglo sean correctos. Si
     * al menos uno no lo es, se detiene y devuelve el error encontrado
     * 
     * * @param {array of products} productsWithId Arreglo de productos c/id
     * 
     * @returns ERROR_CODES.ERROR_OK o != ERROR_CODES.ERROR_OK
     */
    #checkProductsFromFile(productsWithId) {
        // Verificaciones adicionales a las realizadas en #checkProduct()
        let checks = [
            {
                func : (id) => (typeof id === "number") && (id >= FIRST_ID),  // funcion de verificacion a ejecutar
                field: "id",                                                     // atributo del objeto sobre el cual aplicar la funcion de verificacion
                ret_when_fail : SM_ERROR_CODES.ERROR_CODE_ID                        // resultado a devolver si la funcion de verificacion devuelva "false"
            }                                                                 
        ]
        // Recorrer el arreglo de elementos y verifica el id
        for(let p of productsWithId) {
            for(const check of checks) {
                if (!check.func(p[check.field]))
                    return check.ret_when_fail
            }            
        }    
        // Verificar que no hay id duplicados
        let out = []
        for(let p of productsWithId) {
            if(out.indexOf(p.id) !== -1)
                return SM_ERROR_CODES.ERROR_DUPLICATED_ID
            out.push(p.id)
        }
        
        return SM_ERROR_CODES.ERROR_OK
    }

}