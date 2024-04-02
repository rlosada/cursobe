import CartRepository from "../../../respositories/cart.repository.js"

async function view(req, res, next) {
    const VIEW_TEMPLATE = 'cartcontent'
    const HTML_TITLE = 'Carrito'
    let { cid } = req.params
    
    CartRepository.getProductsInfo(cid)         
        .then((products) => { 
            let data = { title:HTML_TITLE, cid, products} 
            res.render(VIEW_TEMPLATE, data)
        })
        .catch((err) => { 
            next()
        })
}

const cartControllerView = {
    view
}

export default cartControllerView