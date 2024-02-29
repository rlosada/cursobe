import { model } from 'mongoose'
import { usersCollectionName, usersSchema } from '../schemas/users.schema.js'

let usersManagerModel = null

// Crea o devuelve un modelo de la coleccion Users a partir del schema importado
const getUsersMongoModel = () => { 
    if(usersManagerModel === null)
        usersManagerModel = model(usersCollectionName, usersSchema)
    return usersManagerModel
}

export default getUsersMongoModel
