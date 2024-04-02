import logger from "../logger/LoggerInstance.js"
import CONSTANTS from "../constants.js"
import 'dotenv/config'

// Estructura de configuracion
let config = {}

/**
 * Inicializa la estructura de configuracion
 * 
 * @returns true o false
 */
export function initConfiguration() {
    
    let config_funcs

    // El arreglo se completa con las funciones que van cargando el objeto config
    config_funcs = [initLogin, initDataSource, initQueries, initHttpServer, initViewEngine, initHashing, initGitHubPassportLogin]

    for(let i = 0; i < config_funcs.length; i++) {
        if(!config_funcs[i](config))
            throw new Error(`Failed when loading configuration`)
    }

    return 
}

/**
 * Recupera la estructura de configuracion
 * 
 * @returns true o false
 */
export function getConfiguration() {
    return config
}

function inObject(object, value) {
    let values = Object.values(object)
    return values.includes(value)
}

/**
 * Determina si el valor existe
 * 
 * @param {*} func      Nombre de la funcion que llamo
 * @param {*} value     Valor asignado al parametro
 * @param {*} valueName Nombre del parametro
 * @returns 
 */
function getValue(func, value, valueName) {
    if(!value) {
        logger.Error(func, `Fail to read ${valueName} value.`)
        return null    
    }
    return value
}

function initLogin(config) {
    // Login mode
    if(!inObject(CONSTANTS.LOGIN_MODES, process.env.LOGIN_MODE)) {
        logger.Error('initLogin', `Invalid login_mode ${process.env.LOGIN_MODE}. Valids are ${Object.keys(CONSTANTS.LOGIN_MODES)}`)
        return false
    }
    config.loginMode = process.env.LOGIN_MODE

    // JWT secret usado para firmar el JWT
    config.jwtSecret = process.env.JWT_SECRET || CONSTANTS.JWT_DEFAULT_SECRET

    // JWT expiration time
    config.jwtExpirationSeconds = process.env.JWT_EXPIRATION_SECONDS || CONSTANTS.JWT_DETAULT_EXPIRATION_SECONDS

    // Cookie secret usado para firmar la cookie de JWT cuando se usa modo login basado en JWT
    config.cookieSecret = process.env.COOKIE_SECRET || CONSTANTS.COOKIE_DEFAULT_SECRET  

    config.sessionSecret = process.env.SESSION_SECRET || CONSTANTS.SESSION_DEFAULT_SECRET

    return true
}

function initDataSource(config) {
    if(!inObject(CONSTANTS.DATA_SOURCE, process.env.DATA_SOURCE)) {
        logger.Error('initDataSource', `Invalid DATA_SOURCE ${process.env.DATA_SOURCE}. Valids are ${Object.keys(CONSTANTS.DATA_SOURCE)}`)
        return false
    }
    config.dataSource = process.env.DATA_SOURCE

    if(config.dataSource === CONSTANTS.DATA_SOURCE.DB) {
        if(!initdB(config))
            return false
        return true
    }
    else if (config.dataSource === CONSTANTS.DATA_SOURCE.FS) {
        if(!initFs(config))
            return false
        return true 
    }

    return false
}

function initdB(config) {

    let db = {}

    if((db.user = getValue('initdB', process.env.DB_USER, 'DB_USER')) === null) 
        return false
   
    if((db.pass = getValue('initdB', process.env.DB_PASS, 'DB_PASS')) === null) 
        return false        

    if((db.dbname = getValue('initdB', process.env.DB_NAME, 'DB_NAME')) === null) 
        return false           

    if((db.server = getValue('initdB', process.env.DB_SERVER, 'DB_SERVER')) === null) 
        return false 

    config.db  = db      

    return true
}


function initFs(config) {

    let fs = {}

    // Products
    let products = {}

    if((products.path = getValue('initFs', process.env.FS_PRODUCTS_PATH, 'FS_PRODUCTS_PATH')) === null) 
        return false
   
    if((products.filename = getValue('initFs', process.env.FS_PRODUCTS_FILENAME, 'FS_PRODUCTS_FILENAME')) === null) 
        return false    
    
    fs.products = products

    // Carts
    let carts = {}

    if((carts.path = getValue('initFs', process.env.FS_CARTS_PATH, 'FS_CARTS_PATH')) === null) 
        return false
   
    if((carts.filename = getValue('initFs', process.env.FS_CARTS_FILENAME, 'FS_CARTS_FILENAME')) === null) 
        return false    
    
    fs.carts = carts


    config.fs = fs

    return true
}


function initQueries(config) {
    let queries = {}

    // Products
    let products = {}

    if((products.limit = getValue('initQueries', process.env.QUERIES_PRODUCTS_DEFAULT_LIMIT, 'QUERIES_PRODUCTS_DEFAULT_LIMIT')) === null) 
        return false
   
    if((products.page = getValue('initQueries', process.env.QUERIES_PRODUCTS_DEFAULT_PAGE, 'QUERIES_PRODUCTS_DEFAULT_PAGE')) === null) 
        return false    
    
    queries.products = products    

    config.queries = queries

    return true
}

function initHttpServer(config) {
    let httpServer = {}
    
    if((httpServer.port = getValue('initHttpServer', process.env.HTTP_SERVER_PORT, 'HTTP_SERVER_PORT')) === null) 
        return false        

    if((httpServer.sessionSecret = getValue('initHttpServer', process.env.HTTP_SERVER_SESSION_SECRET, 'HTTP_SERVER_SESSION_SECRET')) === null) 
        return false   

    config.httpServer = httpServer
    
    return true
}

function initViewEngine(config) {
    let viewengine = {}

    if((viewengine.name = getValue('initViewEngine', process.env.VIEWENGINE_NAME, 'VIEWENGINE_NAME')) === null) 
        return false   

    config.viewengine = viewengine

    return true
}

function initHashing(config) {
    let hashing = {}

    if((hashing.saltRounds = getValue('initHashing', process.env.HASHING_SALT_ROUNDS, 'HASHING_SALT_ROUNDS')) === null) 
        return false   

    config.hashing = hashing

    return true
}

function initGitHubPassportLogin(config) {
    let githubPassportLogin = {}

    if((githubPassportLogin.clientid = getValue('initGitHubPassportLogin', process.env.GITHUB_PASSPORT_CLIENT_ID, 'GITHUB_PASSPORT_CLIENT_ID')) === null) 
        return false   

    if((githubPassportLogin.clientsecret = getValue('initGitHubPassportLogin', process.env.GITHUB_PASSPORT_CLIENT_SECRET, 'GITHUB_PASSPORT_CLIENT_SECRET')) === null) 
        return false   
    
    if((githubPassportLogin.callback = getValue('initGitHubPassportLogin', process.env.GITHUB_PASSPORT_CALLBACK, 'GITHUB_PASSPORT_CALLBACK')) === null) 
        return false   

    config.githubPassportLogin = githubPassportLogin

    return true
}


// Inicializar la estructura de configuracion
initConfiguration()