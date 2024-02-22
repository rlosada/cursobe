import { CustomError, CUSTOM_ERROR_TYPES } from '../../../../misc/customError.js'


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


export class StorageManagerMongo {

    #logger
    #productManagerModel

    constructor(logger, productManagerModel) {

        if(productManagerModel == null)
            throw createError(SM_ERROR_CODES.ERROR_INVALID_CONSTRUCTOR_PARAMS, `fail to build StorageManagerMongo, invalid constructor parameters`)

        this.#logger = logger
        this.#productManagerModel = productManagerModel

        this.#logger?.Info('Constructor', `New StorageManagerMongo created `)
    }

    /**
     * Recupera el elemento cuyo id es el especificado. En caso
     * de error lanza una excepcion
     *
     * @param {string} id Identificador del elemento buscado
     *
     * @returns elemento s/id
     *
     */
    async getElementById(pid) {
        const logger = this.#logger
        const collection = this.#productManagerModel

        logger.Info(`${this.constructor.name}|getElementById`, `Processing get element with id=${pid}`)

        const elementWithId = await collection.findOne({ _id : pid }).lean()

        let { _id, ...element } = elementWithId
        return element
    }

    /**
     * Actualiza en el archivo el elemento cuyo id es el especificado. En caso
     * de error lanza una excepcion
     *
     * @param {string} pid Identificador del elemento a ser actualizado
     * @param {element} element elemento nuevo que reemplaza al existente
     */
    async updateElement(pid, element) {
        const logger = this.#logger
        const collection = this.#productManagerModel

        logger.Info(`${this.constructor.name}|updateElement`, `Processing update element with id=${pid}`)

        await collection.updateOne({ _id : pid }, element).lean()

        return
    }

    /**
     * Elimina del archivo el elemento cuyo id es el especificado. En caso
     * de error o si no existe el elemento a borrar lanza una excepcion
     *
     * @param {string} pid Identificador del producto a eliminar
     *
     */
    async deleteElement(pid) {
        const logger = this.#logger
        const collection = this.#productManagerModel

        logger.Info(`${this.constructor.name}|deleteElement`, `Processing delete element with id=${pid}`)

        await collection.deleteOne({ _id : pid }).lean()

        return
    }

    /**
     * Recupera el arreglo de elementos de la coleccion
     *
     * @param {} queryParams Objeto con parametros validados
     *
     * @returns Arreglo de elementos s/id
     */
    async getElements(queryParams) {
        const logger = this.#logger
        const collection = this.#productManagerModel

        // Determinar filtro
        let filter = {}
        let {category, stock} = queryParams.filter
        
        // Si se recibio una categoria usarla
        if(category) filter['category'] = category

        // Si se desea solo los productos con stock > 0
        if(stock) filter['stock'] = { $gt : 0 }

        // Determinar opciones
        let options = {
            limit : queryParams.limit,
            page : queryParams.page,
            sort : queryParams.sort,
            lean : true
        }

        this.#logger.Info(`${this.constructor.name}|getElements`, `Quering database using filter: ${JSON.stringify(filter)}, options: ${JSON.stringify(options)}`)        

        // Recuperar de la base la informacion requerida y luego a partir
        // de ella fabricar la estructura que se debe devolver
        let result 
        try {
           result = await collection.paginate(filter, options)
        } catch(err) {
           result = undefined
        }

        return this.#buildGetElementsResult(result, filter, options)
    }

    #buildGetElementsResult(dbResult, filter, options) {
        if(dbResult === undefined) 
            return { status: "error" }
    
        let result = {
            status: "success",
            // payload: dbResult.docs.map(doc => {
            //     let {_id, ...rest} = doc
            //     return rest
            // }),
            payload: dbResult.docs,
            totalPages : dbResult.totalPages,
            nextPage : dbResult.nextPage,
            prevPage :  dbResult.prevPage,
            page: dbResult.page,
            hasPrevPage : dbResult.hasPrevPage,
            hasNextPage : dbResult.hasNextPage,
        }

        return result
    }

    /**
     * Agrega el elemento al archivo de elementos
     *
     * @param {} element elemento a ser agregado
     */
    async addElement(element) {
       this.#logger.Info(`${this.constructor.name}|addElement`, 'Processing add element request')

        let { _id } = await this.#productManagerModel.create(element)

        return _id.toString()
    }
}