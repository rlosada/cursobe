/*
    Archivo de test principal
*/

import { ProductManager, ERROR_CODES} from "./ProductManager.js"


let p = {
    title : "producto de prueba", 
    description : "Este es un producto de prueba", 
    price : 200, 
    thumbnail : "Sin imagen", 
    code : "abc123", 
    stock : 25
}

// Listado de pruebas
let tests = [
    {
        desc : "Crear ProductManager y pedir lista de productos",
        result : (() =>{ return JSON.stringify((new ProductManager()).getProducts())})(),
        expected : (() => JSON.stringify([]))()       
    },
    {
        desc : "Crear ProductManager, cargar un nuevo producto y verificar que se recibe un id valido",
        result : (() =>{ 
            let pm = new ProductManager();
            let id = pm.addProduct(p);
            return (id > 0);
        })(),
        expected : true
    },    
    {
        desc : "Crear ProductManager, cargar un nuevo producto y recuperar lista de productos",
        result : (() =>{ 
            let pm = new ProductManager();
            let id = pm.addProduct(p);
            let nps = pm.getProducts()
            return JSON.stringify([p]) === JSON.stringify(nps) 
        })(),
        expected : true
    }, 
    {
        desc : "Crear ProductManager, cargar un nuevo producto y volver a cargarlo",
        result : (() =>{ 
            let pm = new ProductManager();
            let id = pm.addProduct(p);
            let id2 = pm.addProduct(p);
            return (id2 < 0)
        })(),
        expected : true
    }, 
     {
        desc : "Crear ProductManager, cargar una serie de productos y luego solicitar un id inexistente",
        result : (() =>{ 
            let max_id = 100
            let build_product = (num) => {return { 
                title : `Producto_${num}`, 
                description : `Descripcion del producto ${num}`, 
                price : 200, 
                thumbnail : "Sin imagen", 
                code : `ABCDE${num}`, 
                stock : 25  }}
            let pm = new ProductManager();
            for(let i = 1; i <= max_id ; i++) {
                pm.addProduct(build_product(i))
            }
            return (pm.getProductById(max_id+1) === undefined)
        })(),
        expected : true
    }, 
    {
        desc : "Crear ProductManager, cargar una serie de productos y luego solicitar un id que existe",
        result : (() =>{ 
            let max_id = 100
            let build_product = (num) => {return { 
                title : `Producto_${num}`, 
                description : `Descripcion del producto ${num}`, 
                price : 200, 
                thumbnail : "Sin imagen", 
                code : `ABCDE${num}`, 
                stock : 25  }}
            let pm = new ProductManager();
            for(let i = 1; i <= max_id ; i++) {
                pm.addProduct(build_product(i))
            }
            let id = max_id/2
            let np = pm.getProductById(id) 
            return ((np !== undefined) && JSON.stringify(np) === JSON.stringify(build_product(id)) )
        })(),
        expected : true
    },              
]

// Ejecucion de las pruebas
let total_tests = 0
let total_test_ok = 0
const MAX_LINE_SIZE = 110
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