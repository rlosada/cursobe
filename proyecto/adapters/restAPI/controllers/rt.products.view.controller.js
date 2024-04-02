


function view(req, res, next) {
    const VIEW_TEMPLATE = 'realtimeproducts'
    const HTML_TITLE = 'Products - Real Time'
    res.render(VIEW_TEMPLATE, { title : HTML_TITLE })
    return
}


const controllerRTProducts = {
    view
}

export default controllerRTProducts