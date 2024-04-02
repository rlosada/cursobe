import { getConfiguration } from "../../misc/configuration/configuration.js";
import logger from '../../misc/logger/LoggerInstance.js'


let smProducts = null

let inited = false

/*------------------------------------------------------------------*
 * initStorageManagers(dataSource)								    *
 *                                                                  *
 * Entrada:		dataSource      Fuente de los datos                 *
 *																	*
 * Salida:		No posee											*
 *                                                                  *
 * Retorno: 	No posee                                            *
 *                                                                  *
 * Excepcion: 	En caso de que el valor de dataSource sea descono-  *
 *              cido.                                               *
 *                                                                  *
 * Descripcion:	Inicializa los storageManager                       *
 *------------------------------------------------------------------*/

 // Arreglo de fuentes permitidas
 const dataSources = [
    {source : "db", codeProductManager : "./db/mongo/StorageProductsMongoInstance.js"}, 
    {source : "fs", codeProductManager : "./fs/StorageProductsInstance.js"} 
]

async  function initStorageManagers(dataSource) {
    if(inited) {
        logger.Warn('initStorageManagers', 'StoreManagers already inited')
        return
    }

    logger.Info('initStorageManagers', `Storage Manager source is ${dataSource}`)

    for(let i = 0; i < dataSources.length; i++) {
        const {source, codeProductManager} = dataSources[i]
        if(dataSource == source) {
            const mod = await import(codeProductManager)
            smProducts = mod.get()
            inited = true
            return
        }
    }
    
    throw new Error(`Invalid dataSource=${dataSource}, availableOptions=${ (dataSources.map((ds) => ds.source)).join(",")}`)
}

// Inicializa los Storage Managers segun la configuracion
await initStorageManagers(getConfiguration().dataSource)

// Exporta los StorageManagers
export const getSmProducts = () => smProducts


