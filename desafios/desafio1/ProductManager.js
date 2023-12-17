/*
    Clase ProductManager
*/

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
})

// Constantes 
const MAX_TITLE_SIZE = 32           // Maxima cantidad de caracteres permitidos para un title
const MAX_DESCRIPTION_SIZE = 60     // Maxima cantidad de caracteres permitidos para un description


export class ProductManager {

    // variable que contiene el proximo id a asignar a un producto agregado 
    #nextId = 1                  
    
    // arreglo de productos
    #products

    constructor() {
        this.#products = []
    }

    /**
     * Permite agregar un producto al ProductManager
     * @param {product} product producto a agregar 
     * @returns id de producto o algun error de ERROR_CODES
     */  
    addProduct(product) {
        // retorno
        //      * id    Identificador dentro del arreglo ( > 0)
        //      * error Codigo de error (ERROR_CODES)          
        let rc = this.#checkProduct(product)
        if (rc != ERROR_CODES.ERROR_OK)
            return rc

        if(this.#products.some(elem => elem.code === product.code))
            return ERROR_CODES.ERROR_CODE_REPEATED  
        
        let id = this.#nextId++

        this.#products.push({id: id, ...product})

        return id
    }

    /**
     * Recupera la lista de productos del ProductManager
     * @returns lista de productos
     */
    getProducts() {
        return this.#products.map(prodWithId => { let {id, ...prod} = prodWithId; return prod })
    }

    /**
     * Recupera el producto cuyo id es el indicado
     * @param {number} id 
     * @returns producto o undefined si no existe producto con ese id
     */
    getProductById(id) {
        if (id !== undefined && id !== null) {
            let prodWithId = this.#products.find(v => v.id === id)
            if(prodWithId !== undefined) {
                let {id, ...prod} = prodWithId 
                return prod 
            }
        }
        console.log("Not found")   
        return undefined
    }    

    /**
     * Verifica que el producto recibido sea valido
     * @param {product} product 
     * @returns ERROR_CODES.ERROR_OK si el producto es valido o algun error de ERROR_CODES en caso contrario
     */
    #checkProduct(product) {
        let checks = [
            {
                func : (title) => (typeof title === "string") && (title.length <= MAX_TITLE_SIZE),  // funcion de verificacion a ejecutar
                field: "title",                                                                     // atributo del objeto sobre el cual aplicar la funcion de verificacion
                ret_when_fail : ERROR_CODES.ERROR_TITLE                                             // resultado a devolver si la funcion de verificacion devuelva "false"
            },
            {
                func : (desc) => (typeof desc === "string") && (desc.length <= MAX_DESCRIPTION_SIZE),
                field: "description",
                ret_when_fail : ERROR_CODES.ERROR_DESCRIPTION
            },
            {
                func : (price) => (typeof price === "number") && ( price >= 0),
                field: "price",
                ret_when_fail : ERROR_CODES.ERROR_PRICE
            },
            {
                func : (code) => (typeof code === "string") && (/^[a-z0-9]+$/gi.test(code)),
                field: "code",
                ret_when_fail : ERROR_CODES.ERROR_CODE
            },
            {
                func : (stock) => (typeof stock === "number") && (Number.isInteger(stock)) && stock >= 0,
                field: "stock",
                ret_when_fail : ERROR_CODES.ERROR_STOCK
            },
            {
                func : (thumbnail) => (typeof thumbnail === "string"),
                field: "thumbnail",
                ret_when_fail : ERROR_CODES.ERROR_THUMBNAIL
            }                                                                   
        ]

        if(product === undefined || product === null)
            return ERROR_CODES.ERROR_UNDEFINED_OR_NULL

        for(const check of checks) {
            if (!check.func(product[check.field]))
                return check.ret_when_fail
        }
        
        return ERROR_CODES.ERROR_OK
    }
}

