/*
    Archivo de test adicional
*/
import fs from 'node:fs/promises'
import { StorageManagerFile, SM_ERROR_CODES} from "./StorageManagerFile.js"


const clean = async () => {
    try {
        await fs.rm(`${PRODUCT_FILE_LOCATION}/${PRODUCT_FILE}`)
    } catch(err) {
        if(err.code !== 'ENOENT')
            throw err
    }
}

const PRODUCT_FILE_LOCATION = '.'
const PRODUCT_FILE = 'product.json'

// Listado de pruebas
let tests = [
    {
        desc: "Constructor sin parametros",
        before : async () => {},
        run : async () => {
            try {
                new StorageManagerFile()
            } catch(err) {
                return err.getCode()
            }
        },
        expected : async() => SM_ERROR_CODES.ERROR_INVALID_CONSTRUCTOR_PARAMS
    },
    {
        desc: "Constructor sin parametros suficientes",
        before : async () => 0,
        run : async () => {
            try {
                new StorageManagerFile(PRODUCT_FILE_LOCATION)
            } catch(err) {
                return err.getCode()
            }
        },
        expected : async() => SM_ERROR_CODES.ERROR_INVALID_CONSTRUCTOR_PARAMS
    },
    {
        desc: "Constructor con parametros suficientes",
        before : async () => 0,
        run : async () => {
            try {
                new StorageManagerFile(PRODUCT_FILE_LOCATION, PRODUCT_FILE)
            } catch(err) {
                return err.getCode()
            }
            return true
        },
        expected : async() => true
    },
    {
        desc: "Constructor con logger",
        before : async () => 0,
        run : async () => {
            // El objeto logger debe poseer un metodo Info(f,m)
            let logger = {
                Info : (f,m) => {}
            }
            try {
                new StorageManagerFile(PRODUCT_FILE_LOCATION, PRODUCT_FILE, logger)
            } catch(err) {
                return err.getCode()
            }
            return true
        },
        expected : async () => true
    },
     // 
     {
        desc: "Actualizar elemento inexistente",
        before : async () => clean(),
        run : async () => {
            try {
                let  sm = new StorageManagerFile(PRODUCT_FILE_LOCATION, PRODUCT_FILE)
                await sm.updateElement(500, {"value" : "500"})
            } catch(err) {
                return err.getCode()
            }
        },
        expected : async () => SM_ERROR_CODES.ERROR_ELEMENT_NOT_FOUND
    },
    {
        desc: "Actualizar elemento con id invalido (string)",
        before : async () => 0,
        run : async () => {
            try {
                let  sm = new StorageManagerFile(PRODUCT_FILE_LOCATION, PRODUCT_FILE)
                await sm.updateElement('500', {})
            } catch(err) {
                return err.getCode()
            }
        },
        expected : async () => SM_ERROR_CODES.ERROR_CODE_ID
    },
    {
        desc: "Actualizar elemento con id invalido (numero real)",
        before : async () => 0,
        run : async () => {
            try {
                let  sm = new StorageManagerFile(PRODUCT_FILE_LOCATION, PRODUCT_FILE)
                await sm.updateElement(45.3, {"value" : "500"})
            } catch(err) {
                return err.getCode()
            }
        },
        expected : async () => SM_ERROR_CODES.ERROR_CODE_ID
    },
    {
        desc: "Actualizar elemento con id invalido (undefined)",
        before : async () => 0,
        run : async () => {
            try {
                let  sm = new StorageManagerFile(PRODUCT_FILE_LOCATION, PRODUCT_FILE)
                await sm.updateElement(undefined, {"value" : "500"})
            } catch(err) {
                return err.getCode()
            }
        },
        expected : async () => SM_ERROR_CODES.ERROR_CODE_ID
    },
    {
        desc: "Actualizar elemento con id invalido (null)",
        before : async () => 0,
        run : async () => {
            try {
                let  sm = new StorageManagerFile(PRODUCT_FILE_LOCATION, PRODUCT_FILE)
                await sm.updateElement(null, {"value" : "500"})
            } catch(err) {
                return err.getCode()
            }
        },
        expected : async () => SM_ERROR_CODES.ERROR_CODE_ID
    },
    {
        desc: "Actualizar elemento con nuevo vacio",
        before : async () => await fs.writeFile(`${PRODUCT_FILE_LOCATION}/${PRODUCT_FILE}`, JSON.stringify([{"id" : 1, "field1" : "value1"}])),
        run : async () => {
            try {
                let  sm = new StorageManagerFile(PRODUCT_FILE_LOCATION, PRODUCT_FILE)
                await sm.updateElement(1, {})
            } catch(err) {
                return err.getCode()
            }
        },
        expected : async () => SM_ERROR_CODES.ERROR_UNDEFINED_OR_NULL_OR_EMPTY
    },
    {
        desc: "Actualizar elemento",
        before : async () => await fs.writeFile(`${PRODUCT_FILE_LOCATION}/${PRODUCT_FILE}`, JSON.stringify([{"id" : 1, "field1" : "value1"}])),
        run : async () => {
            try {
                let  sm = new StorageManagerFile(PRODUCT_FILE_LOCATION, PRODUCT_FILE)
                await sm.updateElement(1, { "field2" : "value2" })
            } catch(err) {
                return err.getCode()
            }
            let data = await fs.readFile(`${PRODUCT_FILE_LOCATION}/${PRODUCT_FILE}`)
            let elementStr = data.toString()
            return (elementStr === JSON.stringify([{ "id" :1, "field2" : "value2" }]))            
        },
        expected : async () => true 
    },
    {
        desc: "Recuperar elemento con id invalido (string)",
        before : async () => await fs.writeFile(`${PRODUCT_FILE_LOCATION}/${PRODUCT_FILE}`, JSON.stringify([{"id" : 1, "field1" : "value1"}])),
        run : async () => {
            try {
                let  sm = new StorageManagerFile(PRODUCT_FILE_LOCATION, PRODUCT_FILE)
                await sm.getElementById('1')
            } catch(err) {
                return err.getCode()
            }
        },
        expected : async () => SM_ERROR_CODES.ERROR_CODE_ID 
    },
    {
        desc: "Recuperar elemento con id inexistente",
        before : async () => await fs.writeFile(`${PRODUCT_FILE_LOCATION}/${PRODUCT_FILE}`, JSON.stringify([{"id" : 1, "field1" : "value1"}])),
        run : async () => {
            try {
                let  sm = new StorageManagerFile(PRODUCT_FILE_LOCATION, PRODUCT_FILE)
                let element = await sm.getElementById(100)
                console.log(element)
            } catch(err) {
                return err.getCode()
            }
        },
        expected : async () => SM_ERROR_CODES.ERROR_ELEMENT_NOT_FOUND 
    },
    {
        desc: "Recuperar elemento con id",
        before : async () => await fs.writeFile(`${PRODUCT_FILE_LOCATION}/${PRODUCT_FILE}`, JSON.stringify([{"id" : 250, "field1" : "value1"}])),
        run : async () => {
            try {
                let  sm = new StorageManagerFile(PRODUCT_FILE_LOCATION, PRODUCT_FILE)
                let element = await sm.getElementById(250)
                if(JSON.stringify(element) !== JSON.stringify({"field1" : "value1"}))
                    return false
            } catch(err) {
                return err.getCode()
            }
        },
        expected : async () =>  {}
    },
    {
        desc: "Agregar elemento vacio",
        before : clean,
        run : async () => {
            try {
                let  sm = new StorageManagerFile(PRODUCT_FILE_LOCATION, PRODUCT_FILE)
                let element = await sm.addElement({})
            } catch(err) {
                return err.getCode()
            }
        },
        expected : async () =>  SM_ERROR_CODES.ERROR_UNDEFINED_OR_NULL_OR_EMPTY
    },
    {
        desc: "Agregar elemento",
        before : clean,
        run : async () => {
            try {
                let  sm = new StorageManagerFile(PRODUCT_FILE_LOCATION, PRODUCT_FILE)
                await sm.addElement({"field1": "valor1"})
            } catch(err) {
                return err.getCode()
            }
        },
        expected : async () =>  {
            let data = await fs.readFile(`${PRODUCT_FILE_LOCATION}/${PRODUCT_FILE}`)
            let elementStr = data.toString()
            if (elementStr !== JSON.stringify([{ "id" :1, "field1" : "valor1" }]))  
                return false
            else
                return
        }
    }                               
    // {
    //     desc : "Producto indefinido",
    //     result : (() =>{ return (new StorageManagerFile()).addProduct()})(),
    //     expected : SM_ERROR_CODES.ERROR_UNDEFINED_OR_NULL       
    // },
    // {
    //     desc : "Producto null",
    //     result : (() =>{ return (new ProductManager()).addProduct(null)})(),
    //     expected : ERROR_CODES.ERROR_UNDEFINED_OR_NULL       
    // },    
    // {
    //     desc : "Producto correcto",
    //     result : (() => { return (new ProductManager()).addProduct({   
    //             title : "pelota", description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", code : "abcd123", stock : 456
    //         })})(),
    //     expected : 1
    // },    
    // // Verificaciones para 'title'
    // {
    //     desc : "Producto con titulo no tipo string",
    //     result : (() => { return (new ProductManager()).addProduct({   
    //         title : 500, description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", code : "abcd123", stock : 456
    //     })})(),        
    //     expected : ERROR_CODES.ERROR_TITLE
    // },    
    // {
    //     desc : "Producto sin title",
    //     result : (() => { return (new ProductManager()).addProduct({   
    //         description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", code : "abcd123", stock : 456
    //     })})(),           
    //     expected : ERROR_CODES.ERROR_TITLE
    // },
    // {
    //     desc : "Producto con title con largo superior al maximo permitido",
    //     result : (() => { return (new ProductManager()).addProduct({   
    //         title: "esto es un titulo que es demasiado grande", description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", code : "abcd123", stock : 456
    //     })})(),          
    //     expected : ERROR_CODES.ERROR_TITLE
    // },
    // // Verificaciones para 'description'
    // {
    //     desc : "Producto con description no tipo string",
    //     result : (() => { return (new ProductManager()).addProduct({   
    //         title : "pelota", description : false, price : 90.5, thumbnail : "sin imagen", code : "abcd123", stock : 456
    //     })})(),          
    //     expected : ERROR_CODES.ERROR_DESCRIPTION
    // },    
    // {
    //     desc : "Producto sin description",
    //     result : (() => { return (new ProductManager()).addProduct({   
    //         title : "pelota", price : 90.5, thumbnail : "sin imagen", code : "abcd123", stock : 456
    //     })})(),            
    //     expected : ERROR_CODES.ERROR_DESCRIPTION
    // },   
    // {
    //     desc : "Producto con description muy larga",
    //     result : (() => { return (new ProductManager()).addProduct({   
    //         title : "pelota", 
    //           description: "esto es una descripcion de articulo que excede el largo maximo que una descripcion de articulo puede tener", 
    //           price : 90.5, thumbnail : "sin imagen", code : "abcd123", stock : 456
    //     })})(),            
    //     expected : ERROR_CODES.ERROR_DESCRIPTION
    // },   
    // // Verificaciones para 'price'            
    // {
    //     desc : "Producto price tipo no numerico",
    //     result : (() => { return (new ProductManager()).addProduct({   
    //         title : "pelota", description : "Pelota de cuero numero 5", price : false, thumbnail : "sin imagen", code : "abcd123", stock : 456
    //     })})(), 
    //     expected : ERROR_CODES.ERROR_PRICE
    // },    
    // {
    //     desc : "Producto price negativo",
    //     result : (() => { return (new ProductManager()).addProduct({  
    //             title : "pelota", description : "Pelota de cuero numero 5", price : -50, thumbnail : "sin imagen", code : "abcd123", stock : 456
    //     })})(), 
    //     expected : ERROR_CODES.ERROR_PRICE
    // },    
    // // Verificaciones para 'code'  
    // {
    //     desc : "Producto sin codigo",
    //     result : (() => { return (new ProductManager()).addProduct({  
    //         title : "pelota", description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", stock : 456
    //     })})(), 
    //     expected : ERROR_CODES.ERROR_CODE
    // },       
    // {
    //     desc : "Producto con codigo con caracteres invalidos",
    //     result : (() => { return (new ProductManager()).addProduct({  
    //         title : "pelota", description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", code : "abc@12", stock : 456
    //     })})(), 
    //     expected : ERROR_CODES.ERROR_CODE
    // },    
    // // Verificaciones para 'stock'  
    // {
    //     desc : "Producto correcto",
    //     result : (() => { return (new ProductManager()).addProduct({  
    //         title : "pelota", description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", code : "abcd123"
    //     })})(),     
    //     expected : ERROR_CODES.ERROR_STOCK
    // }, 
    // {
    //     desc : "Producto stock negativo",
    //     result : (() => { return (new ProductManager()).addProduct({  
    //             title : "pelota", description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", code : "abcd123", stock : -456
    //     })})(),     
    //     expected : ERROR_CODES.ERROR_STOCK
    // },     
    // {
    //     desc : "Producto stock no entero",
    //     result : (() => { return (new ProductManager()).addProduct({  
    //             title : "pelota", description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", code : "abcd123", stock : 456.09
    //     })})(),                     
    //     expected : ERROR_CODES.ERROR_STOCK
    // },    
    // {
    //     desc : "Producto con codigo repetido",
    //     result : (() => { return (new ProductManager()).addProduct({  
    //             title : "pelota", description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", code : "abcd123", stock : 456.09
    //     })})(),                     
    //     expected : ERROR_CODES.ERROR_STOCK
    // },     
    // // Adicionales
    // {
    //     desc : "Intentar cargar un producto con codigo repetido",
    //     result : (() => {
    //         let pm = new ProductManager()
    //         let code = "abcd123"
    //         pm.addProduct({title : "pelota", description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", code : code, stock : 456})
    //         return pm.addProduct({title : "raqueta", description : "Raqueta de tenis", price : 1900, thumbnail : "sin imagen", code : code, stock : 600})
    //     })(),
    //     expected : ERROR_CODES.ERROR_CODE_REPEATED
    // },     
    // {
    //     desc : "Recuperar arreglo de productos sin campo id",
    //     result : (() => {
    //         let pm = new ProductManager()
    //         pm.addProduct({title : "pelota", description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", code : "123456", stock : 456})
    //         pm.addProduct({title : "raqueta", description : "Raqueta de tenis", price : 1900, thumbnail : "sin imagen", code : "67826234", stock : 600})
    //         let products = pm.getProducts()
    //         return products.some(p => p.id !== undefined)
    //     })(),
    //     expected : false
    // },
    // {
    //     desc : "Recuperar un producto existente por id, existe",
    //     result : (() => {
    //         let pm = new ProductManager()
    //         let p = {title : "pelota", description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", code : "AFBV4932D", stock : 456}
    //         let id = pm.addProduct(p)
    //         let s = pm.getProductById(id)
    //         return JSON.stringify(p) === JSON.stringify(s) 
    //     })(),
    //     expected : true
    // },    
    // {
    //     desc : "Recuperar un producto existente por id, no existe",
    //     result : (() => {
    //         let pm = new ProductManager()
    //         pm.addProduct({title : "pelota", description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", code : "AFBV4932D", stock : 456})
    //         let s = pm.getProductById(600)
    //         return s
    //     })(),
    //     expected : undefined
    // },               
]

// Ejecucion de las pruebas
let index = 1
let total_tests = 0
let total_test_ok = 0
const MAX_LINE_SIZE = 150

let runTest = async(i) => {
    const test = tests[i]
    await test.before()
    let result = await test.run()
    let result_expected = await test.expected()
    let result_ok = (result === result_expected)
    let m = `Test ${index} : ${test.desc}`
    m = m + ".".repeat(MAX_LINE_SIZE-m.length) + (result_ok ? "SUCCESS" : `ERROR (result=${result}, expected=${result_expected})`)
    console.log(m)
    return result_ok
}

for (let i = 0; i < tests.length; i++) {
    let result_ok = await runTest(i)
    total_tests++
    if(result_ok)
        total_test_ok++
    index++
}
console.log(`Test results: Total=${total_tests}, OK=${total_test_ok}, ERROR=${total_tests-total_test_ok}`)