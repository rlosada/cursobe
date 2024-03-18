import { Router } from 'express'

const VIEW_TEMPLATE = 'register'    // Nombre del template ubicado en viewengine/views/${VIEW_TEMPLATE}.handlebars
const HTML_TITLE = 'Register'       // Nombre asignado al tab en el navegador

const createRegisterViewRouter = (lg) => {
    const router = Router()
    router.use((req, res, next) => {
        lg.Info('Router:RegisterView', `Processing request`)
        next()
    })

    router.get('/', (req, res) => res.render(VIEW_TEMPLATE, {title : HTML_TITLE}))  

    return router    
}

export default createRegisterViewRouter