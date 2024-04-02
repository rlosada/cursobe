import mongoose from "mongoose";
import { getConfiguration } from "../../../../misc/configuration/configuration.js";
import logger from '../../../../misc/logger/LoggerInstance.js'
 
let configuration = getConfiguration()

export function getMongoUrl() {
    let { user, pass, dbname, server } = configuration.db

    return `mongodb+srv://${user}:${pass}@${server}/?retryWrites=true&w=majority`;
}

export async function connectToMongoDb() {
    let { user, pass, dbname, server } = configuration.db

    const uri = getMongoUrl()
    
    const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true , dbName : dbname} };

    // Registrar eventos
    mongoose.connection.on('error', (err) => {
        logger.Error('connectToMongoDb', `Connection to database error. Connection params: server=${server}, db=${dbname}, user=${user}. Error=${err}`);
    })

    mongoose.connection.on('disconnected', () => {
        logger.Error('connectToMongoDb', `Connection to database end. Connection params: server=${server}, db=${dbname}, user=${user}.`);
    })

    mongoose.connection.on('reconnected', () => {
        logger.Error('connectToMongoDb', `Connection to database re-established. Connection params: server=${server}, db=${dbname}, user=${user}.`);
    })       

    // Intentar conectar
    try {
        await mongoose.connect(uri, clientOptions);
        logger.Info('connectToMongoDb', `Connection to database succesfull. Connection params: server=${server}, db=${dbname}, user=${user}`);
    }
    catch(err) {
        logger.Error('connectToMongoDb', `Connection to database failed. Connection params: server=${server}, db=${dbname}, user=${user}. Error="${err}"`);
        return false
    }

    return true
}


