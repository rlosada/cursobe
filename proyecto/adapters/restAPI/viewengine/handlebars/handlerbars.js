import {create} from 'express-handlebars'
import * as helpers from '../../public/js/helpers.js'

const ENGINE = 'handlebars'
const EXPRESS_VIEWS_ID = 'views'
const EXPRESS_VIEW_ENGINE_ID = 'view engine'
let logger 
let hbs

const registerHandlebarsViewEngine = (app, config, lg) => {
    logger = lg
    let {viewsFullPath} = config

    hbs = create({ helpers })

    app.engine(ENGINE, hbs.engine)
    app.set(EXPRESS_VIEWS_ID, viewsFullPath)
    app.set(EXPRESS_VIEW_ENGINE_ID, ENGINE)

    logger.Info('registerHandlebarsViewEngine', `Handlebars view engine registered. Using views folder ${viewsFullPath}`)
    return app
}

export default registerHandlebarsViewEngine