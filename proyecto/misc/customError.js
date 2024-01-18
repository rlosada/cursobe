export class CustomError extends Error {
    #code
    #codeStr
    #type       // tipo de error 
    constructor(type, code, codeStr,message) {
        super(message)
        this.#type = type
        this.#code = code
        this.#codeStr = codeStr
    }
    getCode() { return this.#code }
    getCodeStr() { return this.#codeStr }
    getType() { return this.#type}
}

export const CUSTOM_ERROR_TYPES = {
    PARAMETER : -1,
    INTERNAL : -2,
    EMPTY : -3
}

