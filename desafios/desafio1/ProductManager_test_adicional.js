/*
    Archivo de test adicional
*/

import { ProductManager, ERROR_CODES} from "./ProductManager.js"


// Listado de pruebas
let tests = [
    {
        desc : "Producto indefinido",
        result : (() =>{ return (new ProductManager()).addProduct()})(),
        expected : ERROR_CODES.ERROR_UNDEFINED_OR_NULL       
    },
    {
        desc : "Producto null",
        result : (() =>{ return (new ProductManager()).addProduct(null)})(),
        expected : ERROR_CODES.ERROR_UNDEFINED_OR_NULL       
    },    
    {
        desc : "Producto correcto",
        result : (() => { return (new ProductManager()).addProduct({   
                title : "pelota", description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", code : "abcd123", stock : 456
            })})(),
        expected : 1
    },    
    // Verificaciones para 'title'
    {
        desc : "Producto con titulo no tipo string",
        result : (() => { return (new ProductManager()).addProduct({   
            title : 500, description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", code : "abcd123", stock : 456
        })})(),        
        expected : ERROR_CODES.ERROR_TITLE
    },    
    {
        desc : "Producto sin title",
        result : (() => { return (new ProductManager()).addProduct({   
            description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", code : "abcd123", stock : 456
        })})(),           
        expected : ERROR_CODES.ERROR_TITLE
    },
    {
        desc : "Producto con title con largo superior al maximo permitido",
        result : (() => { return (new ProductManager()).addProduct({   
            title: "esto es un titulo que es demasiado grande", description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", code : "abcd123", stock : 456
        })})(),          
        expected : ERROR_CODES.ERROR_TITLE
    },
    // Verificaciones para 'description'
    {
        desc : "Producto con description no tipo string",
        result : (() => { return (new ProductManager()).addProduct({   
            title : "pelota", description : false, price : 90.5, thumbnail : "sin imagen", code : "abcd123", stock : 456
        })})(),          
        expected : ERROR_CODES.ERROR_DESCRIPTION
    },    
    {
        desc : "Producto sin description",
        result : (() => { return (new ProductManager()).addProduct({   
            title : "pelota", price : 90.5, thumbnail : "sin imagen", code : "abcd123", stock : 456
        })})(),            
        expected : ERROR_CODES.ERROR_DESCRIPTION
    },   
    {
        desc : "Producto con description muy larga",
        result : (() => { return (new ProductManager()).addProduct({   
            title : "pelota", 
              description: "esto es una descripcion de articulo que excede el largo maximo que una descripcion de articulo puede tener", 
              price : 90.5, thumbnail : "sin imagen", code : "abcd123", stock : 456
        })})(),            
        expected : ERROR_CODES.ERROR_DESCRIPTION
    },   
    // Verificaciones para 'price'            
    {
        desc : "Producto price tipo no numerico",
        result : (() => { return (new ProductManager()).addProduct({   
            title : "pelota", description : "Pelota de cuero numero 5", price : false, thumbnail : "sin imagen", code : "abcd123", stock : 456
        })})(), 
        expected : ERROR_CODES.ERROR_PRICE
    },    
    {
        desc : "Producto price negativo",
        result : (() => { return (new ProductManager()).addProduct({  
                title : "pelota", description : "Pelota de cuero numero 5", price : -50, thumbnail : "sin imagen", code : "abcd123", stock : 456
        })})(), 
        expected : ERROR_CODES.ERROR_PRICE
    },    
    // Verificaciones para 'code'  
    {
        desc : "Producto sin codigo",
        result : (() => { return (new ProductManager()).addProduct({  
            title : "pelota", description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", stock : 456
        })})(), 
        expected : ERROR_CODES.ERROR_CODE
    },       
    {
        desc : "Producto con codigo con caracteres invalidos",
        result : (() => { return (new ProductManager()).addProduct({  
            title : "pelota", description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", code : "abc@12", stock : 456
        })})(), 
        expected : ERROR_CODES.ERROR_CODE
    },    
    // Verificaciones para 'stock'  
    {
        desc : "Producto correcto",
        result : (() => { return (new ProductManager()).addProduct({  
            title : "pelota", description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", code : "abcd123"
        })})(),     
        expected : ERROR_CODES.ERROR_STOCK
    }, 
    {
        desc : "Producto stock negativo",
        result : (() => { return (new ProductManager()).addProduct({  
                title : "pelota", description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", code : "abcd123", stock : -456
        })})(),     
        expected : ERROR_CODES.ERROR_STOCK
    },     
    {
        desc : "Producto stock no entero",
        result : (() => { return (new ProductManager()).addProduct({  
                title : "pelota", description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", code : "abcd123", stock : 456.09
        })})(),                     
        expected : ERROR_CODES.ERROR_STOCK
    },    
    {
        desc : "Producto con codigo repetido",
        result : (() => { return (new ProductManager()).addProduct({  
                title : "pelota", description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", code : "abcd123", stock : 456.09
        })})(),                     
        expected : ERROR_CODES.ERROR_STOCK
    },     
    // Adicionales
    {
        desc : "Intentar cargar un producto con codigo repetido",
        result : (() => {
            let pm = new ProductManager()
            let code = "abcd123"
            pm.addProduct({title : "pelota", description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", code : code, stock : 456})
            return pm.addProduct({title : "raqueta", description : "Raqueta de tenis", price : 1900, thumbnail : "sin imagen", code : code, stock : 600})
        })(),
        expected : ERROR_CODES.ERROR_CODE_REPEATED
    },     
    {
        desc : "Recuperar arreglo de productos sin campo id",
        result : (() => {
            let pm = new ProductManager()
            pm.addProduct({title : "pelota", description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", code : "123456", stock : 456})
            pm.addProduct({title : "raqueta", description : "Raqueta de tenis", price : 1900, thumbnail : "sin imagen", code : "67826234", stock : 600})
            let products = pm.getProducts()
            return products.some(p => p.id !== undefined)
        })(),
        expected : false
    },
    {
        desc : "Recuperar un producto existente por id, existe",
        result : (() => {
            let pm = new ProductManager()
            let p = {title : "pelota", description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", code : "AFBV4932D", stock : 456}
            let id = pm.addProduct(p)
            let s = pm.getProductById(id)
            return JSON.stringify(p) === JSON.stringify(s) 
        })(),
        expected : true
    },    
    {
        desc : "Recuperar un producto existente por id, no existe",
        result : (() => {
            let pm = new ProductManager()
            pm.addProduct({title : "pelota", description : "Pelota de cuero numero 5", price : 90.5, thumbnail : "sin imagen", code : "AFBV4932D", stock : 456})
            let s = pm.getProductById(600)
            return s
        })(),
        expected : undefined
    },               
]

// Ejecucion de las pruebas
let total_tests = 0
let total_test_ok = 0
const MAX_LINE_SIZE = 100

tests.forEach((test, index) => {
    let result_ok = (test.result === test.expected)
    let m = `Test ${index + 1} : ${test.desc}`
    m = m + ".".repeat(MAX_LINE_SIZE-m.length) + (result_ok ? "SUCCESS" : `ERROR (result=${test.result}, expected=${test.expected})`)
    console.log(m)

    total_tests++
    if(result_ok)
        total_test_ok++    
})
console.log(`Test results: Total=${total_tests}, OK=${total_test_ok}, ERROR=${total_tests-total_test_ok}`)