export class CustomError extends Error {
    #code
    #str
    constructor(code, message) {
        super(message)
        this.#code = code
        this.#str = errorString[code]
    }
    getCode() { return this.#code }
    getString() { return this.#str }
}

const errorString = {}

// Codigos de error
export const ERROR_CODES = Object.freeze({
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
    ERROR_PRODUCT_NOT_FOUND : -11
})

function init() {
    const b = Object.entries(ERROR_CODES)

    for(let i = 0; i < b.length; i++) {
        const a = b[i]
        errorString[a[1]] = a[0]
    }
}

init()