import getProductManager from '../../../application/productManager/ProductManagerInstance.js'



async function view(req, res, next) {

    const VIEW_TEMPLATE = 'home'
    const HTML_TITLE = 'home'    

    const productManager = await getProductManager()

    productManager.getProducts()         
    .then((products) => 
        res.render(VIEW_TEMPLATE, 
        { 
            title : HTML_TITLE ,
            products: products
        }))
    .catch(next)
}


const controllerHome = {
    view
}

export default controllerHome