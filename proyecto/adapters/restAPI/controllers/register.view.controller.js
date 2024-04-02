
function view(req, res, next) {
    const VIEW_TEMPLATE = 'register'
    const HTML_TITLE = 'Register'
    res.render(VIEW_TEMPLATE, {title : HTML_TITLE})
}

const controllerRegister = {
    view
}

export default controllerRegister