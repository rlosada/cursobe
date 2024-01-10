import * as fs from 'node:fs/promises'
import { ERROR_CODES, CustomError } from './customError.js'


// CONSTANTES
// ====================================================

// Nombre del archivo de productos
const PRODUCT_FILE = "products.json"

// Minimo ID
const FIRST_ID = 1

// Maxima cantidad de caracteres permitidos para un title
const MAX_TITLE_SIZE = 32           

// Maxima cantidad de caracteres permitidos para un description
const MAX_DESCRIPTION_SIZE = 60     



// CODIGO
// ====================================================

export class ProductManager {
    // ruta donde se encuentra el archivo de productos
    #path

    /**
     * Crea un nuevo ProductManager
     * @param {string} path Ruta completa donde almacenar el archivo de productos
     */
    constructor(path) {
        this.#path = path
    }

    /**
     * Recupera el producto cuyo id es el especificado. Si no
     * existe el producto lanza un error con codigo ERROR_CODES.ERROR_PRODUCT_NOT_FOUND
     * 
     * @param {number} id Identificador del producto buscado
     * 
     * @returns producto s/id
     * 
     */
    async getProductById(id) {
        // Verificar el id recibido
        if (id === undefined || id === null || typeof id !== 'number' || id < FIRST_ID)
            throw new CustomError(ERROR_CODES.ERROR_CODE_ID, "Received id is invalid")
        
        // Recuperar el arreglo de productos del archivo            
        let productsWithId = await this.#loadFromFile()

        let productWithId = productsWithId.find(p => p.id === id)

        if(productWithId !== undefined) {
            let {id, ...product} = productWithId
            return product
        }

        throw new CustomError(ERROR_CODES.ERROR_PRODUCT_NOT_FOUND)    
    }

    /**
     * Actualiza del archivo de productos el producto cuyo id es el especificado. Si no se encuentra el producto
     * se lanza un error ERROR_CODES.ERROR_PRODUCT_NOT_FOUND.
     * 
     * @param {number} id Identificador del producto dentro del archivo a ser actualizado
     * @param {producto} product producto nuevo que reemplaza al existente
     */
    async updateProduct(id, product) {
        // Verificar el id recibido
        if (id === undefined || id === null || typeof id !== 'number' || id < FIRST_ID)
            throw new CustomError(ERROR_CODES.ERROR_CODE_ID, "Received id is invalid")

        // Verificar el producto recibido
        let rc = this.#checkProduct(product)
        if (rc !== ERROR_CODES.ERROR_OK) {
            throw new CustomError(rc, "Invalid product")
        }

        let productsWithId = await this.#loadFromFile()

        let found = false

        // Se reemplaza el producto viejo por el nuevo en la misma posicion
        let productsWithIdNew = productsWithId.map(p => {
            if(p.id === id) {
                found = true
                return {id : id, ...product}
            } else {
                return p
            }
        })

        if(found === false)
            throw new CustomError(ERROR_CODES.ERROR_PRODUCT_NOT_FOUND)  

        this.#saveToFile(productsWithIdNew)
    }

    /**
     * Elimina del archivo de productos el producto cuyo id es el especificado. Si no
     * existe el producto lanza un error con codigo ERROR_CODES.ERROR_PRODUCT_NOT_FOUND
     * 
     * @param {number} id Identificador del producto a eliminar
     * 
     */    
    async deleteProduct(id) {
        // Verificar el id recibido
        if (id === undefined || id === null || typeof id !== 'number' || id < FIRST_ID)
            throw new CustomError(ERROR_CODES.ERROR_CODE_ID, "Received id is invalid")
     
        // Recuperar el arreglo de productos del archivo            
        let productsWithId = await this.#loadFromFile()

        let productsWithIdNew = productsWithId.filter(p => p.id !== id)

        if (productsWithId.length === 0 || productsWithId.length === productsWithIdNew.length)
            throw new CustomError(ERROR_CODES.ERROR_PRODUCT_NOT_FOUND)      

        await this.#saveToFile(productsWithIdNew)

        return         
    }

    /**
     * Recupera el arreglo de productos del archivo
     * 
     * @returns Arreglo de productos s/id
     */
    async getProducts() {
        let productsWithId = await this.#loadFromFile()
        if (productsWithId.length > 0)
            return productsWithId.map(productWithId => {let {id, ...rest} = productWithId; return rest})
        else
            return []
    }

    /**
     * Agrega el producto al archivo de productos
     * 
     * @param {product} product producto a ser agregado
     */
    async addProduct(product) {
        // Verificar el producto recibido
        let rc = this.#checkProduct(product)
        if (rc !== ERROR_CODES.ERROR_OK) {
            throw new CustomError(rc, "Invalid product")
        }

        // Recuperar los productos del archivo y verificar que sean correctos
        // (prodian haber modificado el archivo desde afuera de la aplicacion)
        // Si al menos un elemento es incorrecto, descartar todo
        let productsWithId = await this.#loadFromFile()

        // Recuperar el maximo id del arreglo
        let maxId = FIRST_ID
        let nextId

        if(productsWithId.length > 0) {
            productsWithId.forEach(p => {
                if (p.id > maxId) 
                    maxId = p.id
            });
            nextId = maxId + 1
        } else {
            nextId = FIRST_ID
        }

        // Agregar al arreglo el nuevo producto
        productsWithId.push({id : nextId, ...product})

        // Guardar en el archivo
        await this.#saveToFile(productsWithId)
    }

    /**
     * Sobreescribe el archivo con el nuevo arreglo de productos
     * 
     * @param {array} productsWithId Arreglo de productos c/id
     */
    async #saveToFile(productsWithId) {
        await fs.writeFile(`${this.#path}/${PRODUCT_FILE}`, JSON.stringify(productsWithId))
    }

    /**
     * Recupera los datos del archivo JSON
     * @returns Objeto recuperado del archivo
     */
    async #loadFromFile() {
        let data 
        try {
            data = await fs.readFile(`${this.#path}/${PRODUCT_FILE}`)
        } catch(err) {
            if(err.code !== 'ENOENT')
                throw err
            return []
        }
        let productsWithId = JSON.parse(data)

        let error = this.#checkProductsFromFile(productsWithId)
        if (error !== ERROR_CODES.ERROR_OK) {
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
                ret_when_fail : ERROR_CODES.ERROR_CODE_ID                        // resultado a devolver si la funcion de verificacion devuelva "false"
            }                                                                 
        ]
        // Recorrer el arreglo de productos y realizar las verificaciones
        for(let p of productsWithId) {
            let rc = this.#checkProduct(p)
            if(rc !== ERROR_CODES.ERROR_OK)
                return rc
            for(const check of checks) {
                if (!check.func(p[check.field]))
                    return check.ret_when_fail
            }            
        }    
        // Verificar que no hay id duplicados
        let out = []
        for(let p of productsWithId) {
            if(out.indexOf(p.id) !== -1)
                return ERROR_CODES.ERROR_DUPLICATED_ID
            out.push(p.id)
        }
        
        return ERROR_CODES.ERROR_OK
    }

    /**
         * Verifica que el producto recibido sea valido
         * 
         * @param {product} product producto a verificar
         * 
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

        if(product.length === 0)
            return ERROR_CODES.ERROR_OK

        for(const check of checks) {
            if (!check.func(product[check.field]))
                return check.ret_when_fail
        }
        
        return ERROR_CODES.ERROR_OK
    }    
}