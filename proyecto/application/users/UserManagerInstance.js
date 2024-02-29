import logger from '../../misc/logger/LoggerInstance.js'
import configuration from '../../misc/configuration/configuration.js'
import getUsersMongoModel from '../../adapters/storage/db/mongo/models/users.model.js'

let usersManager = null

async function getUsersManager() { 
    if(usersManager === null)
        usersManager = await createUsersManager()
    return usersManager
}

async function createUsersManager() {
    const dataSources = [
        {source : "db", codeUsersManager : "./UsersManagerMongo.js", build : (constructor) => new constructor(getUsersMongoModel(), logger)}         
    ]

    let { dataSource } =  configuration

    logger.Info('initStorageManagers', `Storage Manager source is ${dataSource}`)

    for(let i = 0; i < dataSources.length; i++) {
        const {source, codeUsersManager, build} = dataSources[i]
        if(dataSource == source) {
            const mod = await import(codeUsersManager)
            return await build(mod.default)
        }
    }   

    logger.Warn('initStorageManagers', `Storage Manager source ${dataSource} does not support usersManager`)
}

// Exportar objeto usersManager
export default getUsersManager