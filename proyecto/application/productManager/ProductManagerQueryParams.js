import configuration from "../../misc/configuration/configuration.js";
import logger from "../../misc/logger/LoggerInstance.js";
import { validatePositiveIntBase10 } from '../../misc/utils.js'

const DEFAULT_LIMIT = 10
const DEFAULT_PAGE = 1
const DEFAULT_SORT_FIELD = 'price'
const DEFAULT_FILTERS = ['category', 'stock']
const SORT_ORDER_ASC = 'asc'
const SORT_ORDER_DESC = 'desc'

/**
* Acondiciona los parametros de busqueda recibidos
*/
export default function adjustQueryParams(queryParams) {

    // Valor por defecto
    let adjustedQueryParams = {
        limit : DEFAULT_LIMIT,
        page : DEFAULT_PAGE,
        sort : {},
        filter : {}
    }

    if(queryParams) {

        let { limit, page, sort } = queryParams
        let filter = queryParams.query

        if(validatePositiveIntBase10(limit)) adjustedQueryParams.limit = number.parseInt(limit)
        if(validatePositiveIntBase10(page)) adjustedQueryParams.page = number.parseInt(page)

        if(sort && typeof sort === 'string') {
            if(sort.toLocaleLowerCase() === SORT_ORDER_ASC) 
                adjustedQueryParams.sort = { price : SORT_ORDER_ASC }
            else if (queryParams.sort.toLocaleLowerCase() === SORT_ORDER_DESC) 
                adjustedQueryParams.sort = { price : SORT_ORDER_DESC }
        }        

        if(filter) adjustedQueryParams.filter = getFilterValue(filter)
    }

    logger.Info('adjustQueryParams', `QueryParameters: ${JSON.stringify(queryParams)}, Adjusted QueryParameters: ${JSON.stringify(adjustedQueryParams)}`)
    
    return adjustedQueryParams
}

/**
 * Intenta recuperar un entero positivo a partir del valor de v.
 * En caso de no poder hacerlo, devuelve def.
 * 
 * @param {string} v    Valor a convertir 
 * @param {string} name Identificacion del valor
 * @param {number} def  Valor entero positivo a devolver en caso de error
 * @returns 
 */
function getIntegerValue(v, name, def) {

    let n = Number.parseInt(v)
    if(Number.isNaN(n) || !Number.isInteger(n) || n < 0) {
        n = def
        logger.Warn('adjustQueryParams', `${name} param value ${v} is invalid, using default ${n}`)
    }
    return n
}

/**
 * Genera un objecto filtro a partir del string recibido
 * 
 * @param {string} query String con los parametros del filtro
 * 
 * @returns Devuelve un objeto filtro
 * 
 * El formato del string recibido se espera que sea de la forma
 * "key=value,...,key=value"
 */
function getFilterValue(query) {
    if(query == null) {
        logger.Info('getFilterValue', `No filter values received`)
        return {}
    }

    if(typeof query !== 'string' || query[0] !== '"' || query[query.length-1] !== '"') {
        logger.Info('getFilterValue', `Invalid filter values received ${query}, ignoring`)
        return {}
    }
    
    // Remover el primero y ultimo (deben ser ")
    query = query.substr(1,query.length - 2)

    let kvs = query.split(",")
    let filter = {}
    kvs.forEach(v => {

        let  kv = v.split("=")
        if(kv.length !== 2) {
            logger.Warn('getFilterValue', `Ivalid format for filter option ${kv}, ignoring`)
            return
        }

        let key = kv[0].toLocaleLowerCase()
        let value = kv[1]   // No se debe cambiar el case ya que la consulta hacia el Storage puede es case-insensitive

        if(key === 'category') {
            filter[key] = value
        }
        else if(key === 'stock') {
            value = value.toLocaleLowerCase()
            if(value === 'true')
                filter[key] = value
            else {
                logger.Warn('getFilterValue', `Unsupported filtering value ${value} for filtering key ${key}, ignoring`)
                return  
            }
        }
        else {
            logger.Warn('getFilterValue', `Unsupported filtering key ${key}, ignoring`)
            return
        }

    })

    logger.Info('getFilterValue', `Filter values to be used are ${filter}`)

    return filter
}