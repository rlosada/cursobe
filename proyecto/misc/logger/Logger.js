
const CONSOLE_COLOR = {
    RESET   : "\x1b[0m",
    RED     : "\x1b[31m",
    GREEN   : "\x1b[32m",
    YELLOW  : "\x1b[33m",
    BLUE    : "\x1b[34m",
    MAGENTA : "\x1b[35m",
    CYAN    : "\x1b[36m"
 }

export const LOG_LEVEL = {
    LOG_INFO : 1,
    LOG_DEBUG : 2,
    LOG_WARN : 4,
    LOG_ERROR : 8
}


const MAX_FUNCTION_NAME_SIZE = 32
export class Logger {

    #logLevel

    constructor(options) { 
        // Por el momento se ignora el objeto recibido
        this.#logLevel =  LOG_LEVEL.LOG_INFO | LOG_LEVEL.LOG_DEBUG | LOG_LEVEL.LOG_WARN | LOG_LEVEL.LOG_ERROR
    }
    
    validate() {
        return
    }

    /**
     * Genera una linea de log que incluye fecha,
     * nombre de la funcion y mensaje
     * 
     * @param f        Nombre de la funcion
     * @param max_size Maximo tamaño asigando al nombre d ela funcion
     * @param msg      Mensaje
     * 
     * @returns string
     */
    buildMsg(f, msg) {
        let blanks = MAX_FUNCTION_NAME_SIZE - f.length
        if (blanks < 0)
            blanks = 0
        let date_str = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')

        if(f.length !== 0)
            return `${date_str} ${f + ' '.repeat(blanks)} ${msg}`
        else
            return `${' '.repeat(date_str.length)} ${' '.repeat(blanks)} ${msg}`
    }

    console(colorCode, line) {
        console.log(`${colorCode}${line}${CONSOLE_COLOR.RESET}`)
    }

    log(loglevel, colorCode, func , msg) {
        if(loglevel & this.#logLevel) { 
            this.console(colorCode,  this.buildMsg(func, msg)) 
        }
    }

    Info  = (func, msg) => this.log(LOG_LEVEL.LOG_INFO, CONSOLE_COLOR.RESET, func, msg) 
    Debug = (func, msg) => this.log(LOG_LEVEL.LOG_DEBUG, CONSOLE_COLOR.RESET, func, msg) 
    Warn  = (func, msg) => this.log(LOG_LEVEL.LOG_WARN, CONSOLE_COLOR.YELLOW, func, msg) 
    Error = (func, msg) => this.log(LOG_LEVEL.LOG_ERROR, CONSOLE_COLOR.RED, func, msg) 
    
    
}