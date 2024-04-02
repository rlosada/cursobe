function view(req, res, next) {
    const VIEW_TEMPLATE = 'chat'
    const HTML_TITLE = 'chat'
    res.render(VIEW_TEMPLATE, { title : HTML_TITLE })
    return
}


const chatViewController = {
    view
}

export default chatViewController