import { model } from 'mongoose'
import { messagesCollectionName, messagesSchema } from '../schemas/messages.schema.js'

let messagesManagerModel = null

// Crea o devuelve un modelo de la coleccion Messages a partir del schema importado
export const getMessagesMongoModel = () => { 
    if(messagesManagerModel === null)
        messagesManagerModel = model(messagesCollectionName, messagesSchema)
    return messagesManagerModel
}

