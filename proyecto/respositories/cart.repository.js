import getCartManager from  "../application/cartManager/CartManagerInstance.js";

const cartDAO = await getCartManager()

async function getProductsInfo(cid) {
    const products = await cartDAO.getCartProductsInfo(cid)
    return products
}

async function update(cid, productsInfo) {
    await cartDAO.updateCart(cid, productsInfo)
}

async function add(cart) {
    const id = await cartDAO.addCart(cart)
    return id
}

async function rmvProduct(cid, pid) {
    await cartDAO.rmvProduct(cid, pid)
}

async function clear(cid) {
    await cartDAO.cartEmpty(cid)
}

async function addProduct(cid, pid) {
    await cartDAO.addCartAddProduct(cid, pid)
}

async function updateProductQty(cid, pid, quantity) {
    await cartDAO.cartUpProductQty(cid, pid, quantity)
}

const CartRepository = {
    getProductsInfo,
    update,
    add,
    clear,
    rmvProduct,
    addProduct,
    updateProductQty
}

export default CartRepository

