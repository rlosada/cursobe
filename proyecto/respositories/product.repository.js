import getProductManager from '../application/productManager/ProductManagerInstance.js'

const productDAO = await getProductManager()

async function getById(pid) {
    const product = await productDAO.getProductById(pid)
    return product
}

async function getProducts(queryParams) {
    const products = await productDAO.getProducts(queryParams)
    return products
}

async function update(id, product) {
    await productDAO.updateProduct(id, product)
}

async function add(product) {
    const pid = await productDAO.addProduct(product)
    return pid
}

async function remove(pid) {
    await productDAO.deleteProduct(pid)
}

