import { Router } from 'express'

const VIEW_TEMPLATE = 'login'  // Nombre del template ubicado en viewengine/views/${VIEW_TEMPLATE}.handlebars
const HTML_TITLE = 'Login'          // Nombre asignado al tab en el navegador

const createLoginViewRouter = (lg) => {
    const router = Router()
    router.use((req, res, next) => {
        lg.Info('Router:LoginView', `Processing request`)
        next()
    })

    router.get('/', (req, res) => res.render(VIEW_TEMPLATE, {title : HTML_TITLE}))  

    return router    
}

export default createLoginViewRouter