import getProductManager from '../../../application/productManager/ProductManagerInstance.js'
import logger from '../../../misc/logger/LoggerInstance.js'


async function view(req, res, next) {

    const productManager = await getProductManager()

    productManager.getProducts(req.query)         
        .then((result) => { 
            logger.Info('Router:processGetProductsView', `req.user=${JSON.stringify(req.user)}`)
            let user = req.user
            let data = { title:'products', userFullName : `${user.firstName} ${user.lastName}`, isAdmin : user.isAdmin, ...result}; 
            res.render('products', data)
        })
        .catch(next)
}

const productControllerView = {
    view
}

export default productControllerView