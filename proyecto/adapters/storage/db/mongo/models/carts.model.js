import { model } from 'mongoose'
import { cartsSchema, cartsCollectionName } from '../schemas/carts.schema.js'

let cartManagerModel = null

// Crea o devuelve un modelo de la coleccion Carts a partir del schema importado
const getCartMongoModel = () => { 
    if(cartManagerModel === null)
        cartManagerModel = model(cartsCollectionName, cartsSchema)
    return cartManagerModel
}

// Exportar objeto cartManagerModel
export default getCartMongoModel