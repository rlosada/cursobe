import { getConfiguration }  from '../../../misc/configuration/configuration.js'
import { CustomError, CUSTOM_ERROR_TYPES } from '../../../misc/customError.js'
import { getDirectory } from '../../../misc/utils.js'
import registerHandlebarsViewEngine from './handlebars/handlerbars.js'

const configuration = getConfiguration()
const viewsFullPath = `${getDirectory(import.meta.url)}/views`

let logger 

const registerViewEngine = (app, lg)  => {

    const veName = configuration.viewengine.name

    logger = lg

    // Tabla de view engines soportados
    const viewEngines = [
        { name : "handlebars", registerVE : registerHandlebarsViewEngine }
    ]

    for(const ve of  viewEngines) {
        if(veName.toUpperCase() === ve.name.toUpperCase()) {

            let config = {viewsFullPath : viewsFullPath}

            return ve.registerVE(app, config, lg)
        } 
    }

    const viewEnginesSupported = viewEngines.map( ve => ve.name)

    throw new CustomError(CUSTOM_ERROR_TYPES.PARAMETER, -1, `Invalid View Engine ${veName}. List of supported view engines is : ${viewEnginesSupported.join(',')}`)
}

export default registerViewEngine
