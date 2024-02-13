import { model } from 'mongoose'
import { messagesCollectionName, messagesSchema } from '../schemas/messages.schema.js'

let messagesManagerModel = null

// Crea o devuelve un modelo de la coleccion Messages a partir del schema importado
const getProductMongoModel = () => { 
    if(messagesManagerModel === null)
    messagesManagerModel = model(messagesCollectionName, messagesSchema)
    return messagesManagerModel
}

// Exportar objeto getMessagesMongoModel
export default getMessagesMongoModel