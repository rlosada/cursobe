import { ChatManager } from "./chatManager.js";
import configuration from "../../../../../misc/configuration/configuration.js";
import logger from '../../../../../misc/logger/LoggerInstance.js'
import { ChannelServer } from "./channel/ChannelServer.js";
import {ChatStorageMongo} from './storage/chatStorageMongo.js'

let chatManager = null

const DEFAULT_PORT = 8081

function getChatManager() { 
    if(chatManager === null)
        chatManager = createChatManager()
    return chatManager
}

function createChatManager() {
    let { dataSource } =  configuration

    // No esta soportado otro modo de almacenamiento
    if(dataSource !== 'db')
        return undefined

    let storage = new ChatStorageMongo()
    let channel = new ChannelServer(DEFAULT_PORT, logger)

    return new ChatManager(logger, channel, storage)
}

export default getChatManager