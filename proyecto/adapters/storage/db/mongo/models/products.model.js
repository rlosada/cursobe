import { model } from 'mongoose'
import { productsSchema, productCollectionName } from '../schemas/products.schema.js'

let productManagerModel = null

// Crea o devuelve un modelo de la coleccion Products a partir del schema importado
const getProductMongoModel = () => { 
    if(productManagerModel === null)
        productManagerModel = model(productCollectionName, productsSchema)
    return productManagerModel
}

// Exportar objeto productManagerModel
export default getProductMongoModel