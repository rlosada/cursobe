import { getMessagesMongoModel } from '../../../../../storage/db/mongo/models/messages.model.js' 
import logger from '../../../../../../misc/logger/LoggerInstance.js'

export class ChatStorageMongo {
    #model
    #logger
    constructor() {
        this.#model = getMessagesMongoModel()
        this.#logger = logger
        this.#logger.Info(`${this.constructor.name}`, `chatStorageMongo created`)
    }
    async storeMessage(email, message) {
        const collection = this.#model
        await collection.create({
            email,
            message
        })
    }
}