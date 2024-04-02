function view(req, res, next) {
    const VIEW_TEMPLATE = 'index'
    const HTML_TITLE = 'index'
    res.render(VIEW_TEMPLATE, { title : HTML_TITLE })
    return
}


const controllerIndex = {
    view
}

export default controllerIndex