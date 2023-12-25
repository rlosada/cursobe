import { ProductManager, ERROR_CODES } from "./ProductManager.js";
import * as fs from 'node:fs/promises'

const TEST_FOLDER = '.'

let p = {
    title : "producto de prueba0", 
    description : "Este es un producto de prueba0", 
    price : 200, 
    thumbnail : "Sin imagen", 
    code : "abc123", 
    stock : 25
}

let p1= {
    title : "producto de prueba1", 
    description : "Este es un producto de prueba1", 
    price : 500, 
    thumbnail : "Con imagen", 
    code : "abc123", 
    stock : 25
}

let p2= {
    title : "producto de prueba2", 
    description : "Este es un producto de prueba2", 
    price : 500, 
    thumbnail : "Con imagen", 
    code : "abc123", 
    stock : 25
}

const clean = async () => {
    try {
        await fs.rm(`${TEST_FOLDER}/products.json`)
    } catch(err) {
        if(err.code !== 'ENOENT')
            throw err
    }
}

// Listado de pruebas
let tests = [
    {
        desc : "Crear ProductManager y pedir lista de productos",
        before: async () => await clean(),
        run : async () => {
            let pm = new ProductManager(TEST_FOLDER);
            let products = await pm.getProducts()
            return JSON.stringify(products)
        },
        expected : async () => JSON.stringify([])    
    } ,
    {
        desc : "Crear ProductManager, agregar un nuevo producto y pedir la lista de todos los productos",
        before: async () => await clean(),
        run : async () => {
            let pm = new ProductManager(TEST_FOLDER);
            await pm.addProduct(p)
            let products = await pm.getProducts()
            return JSON.stringify(products)
        },
        expected : async () => JSON.stringify([p])      
    },
    {
        desc : "Crear ProductManager, agregar un nuevo producto y pedir un producto con id inexistente",
        before: async () => await clean(),
        run : async () => {
            let pm = new ProductManager(TEST_FOLDER);
            await pm.addProduct(p)
            try {
                let products = await pm.getProductById(500)
            } catch(err) {
                if(err.code !== ERROR_CODES.ERROR_PRODUCT_NOT_FOUND)
                    throw err
                return 0
            }
            return -1
        },
        expected : async () => 0      
    },
    {
        desc : "Crear ProductManager, agregar varios productos y luego pedir uno con id que deberia existir",
        before: async () => await clean(),
        run : async () => {
            let pm = new ProductManager(TEST_FOLDER);
            await pm.addProduct(p)
            await pm.addProduct(p1)
            await pm.addProduct(p2)
            let product = await pm.getProductById(3)
            return JSON.stringify(product)
        },
        expected : async () => {return JSON.stringify(p2)}      
    },  
    {
        desc : "Crear ProductManager, agregar un nuevo producto y borrar un producto con id inexistente",
        before: async () => await clean(),
        run : async () => {
            let pm = new ProductManager(TEST_FOLDER);
            await pm.addProduct(p)
            try {
                await pm.deleteProduct(500)
            } catch(err) {
                if(err.code !== ERROR_CODES.ERROR_PRODUCT_NOT_FOUND)
                    throw err
                return 0
            }
            return -1
        },
        expected : async () => {return 0}
    },   
    {
        desc : "Crear ProductManager, agregar un nuevo producto y borrar un producto con id existente",
        before: async () => await clean(),
        run : async () => {
            let pm = new ProductManager(TEST_FOLDER);
            await pm.addProduct(p)
            try {
                await pm.deleteProduct(1)
            } catch(err) {
                if(err.code === ERROR_CODES.ERROR_PRODUCT_NOT_FOUND)
                    return -1
            }
            let products = await pm.getProducts()
            return JSON.stringify(products)
        },
        expected : async () => JSON.stringify([])      
    },   
    {
        desc : "Crear ProductManager, agregar varios productos productos y luego actualizar uno existente",
        before: async () => await clean(),
        run : async () => {
            let pm = new ProductManager(TEST_FOLDER);
            await pm.addProduct(p)
            await pm.addProduct(p)
            await pm.addProduct(p)
            await pm.updateProduct(2, p1)
            let products = await pm.getProducts()
            return JSON.stringify(products)
        },
        expected : async () => JSON.stringify([p, p1, p])      
    },  
    {
        desc : "Crear ProductManager, agregar varios productos y luego actualizar uno inexistente",
        before: async () => await clean(),
        run : async () => {
            let pm = new ProductManager(TEST_FOLDER);
            await pm.addProduct(p)
            await pm.addProduct(p)
            await pm.addProduct(p)
            try {
                await pm.updateProduct(56, p1)
            } catch(err) {
                if(err.code === ERROR_CODES.ERROR_PRODUCT_NOT_FOUND)
                    return 0
            }            
            return -1
        },
        expected :  async () => 0      
    },  
    {
        desc : "Crear ProductManager, agregar varios productos y verificar que el id no se repite",
        before: async () => await clean(),
        run : async () => {
            let pm = new ProductManager(TEST_FOLDER);
            await pm.addProduct(p)
            await pm.addProduct(p)
            await pm.addProduct(p)
            await pm.addProduct(p)
            return 0
        },
        expected : async () => {
            let data = await fs.readFile(`${TEST_FOLDER}/products.json`)
            let ids = JSON.parse(data).map(p => p.id)
            if (ids.length === 0)
                return -1
            let tmp = []   
            let found = 0         
            ids.forEach(id => {
                if(tmp.findIndex(e => e.id === id) !== -1)
                    found = -1
            }
            );
            return found
        }   
    },   
    {
        desc : "Crear ProductManager, agregar varios productos, actualizar un producto  y verificar que los id no cambiaron",
        before: async () => await clean(),
        run : async () => {
            let pm = new ProductManager(TEST_FOLDER);
            await pm.addProduct(p)
            await pm.addProduct(p)
            await pm.addProduct(p)
            await pm.addProduct(p)
            await pm.updateProduct(3, p1)
            return true
        },
        expected : async () => {
            let data = await fs.readFile(`${TEST_FOLDER}/products.json`)
            let ids = JSON.parse(data).map(p => p.id)
            if (ids.length === 0)
                return false
            return (ids[0] === 1 && ids[1] === 2 && ids[2] === 3 && ids[3] === 4)
        }   
    },                                              
]

// Ejecucion de las pruebas
let index = 1
let total_tests = 0
let total_test_ok = 0
const MAX_LINE_SIZE = 150

let runTest = async (i) => {
    const test = tests[i]
    // Preparar entorno
    await test.before()
    // Ejecutar test
    let result = await test.run()
    // Verificar resultado
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