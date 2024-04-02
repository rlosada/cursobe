


function login(req, res, next) {
    const VIEW_TEMPLATE = 'login'  
    const HTML_TITLE = 'Login'     
    res.render(VIEW_TEMPLATE, {title : HTML_TITLE})
}

function loginLocal(req, res, next) {
    const VIEW_TEMPLATE = 'loginLocal'  
    const HTML_TITLE = 'Login local'          
    res.render(VIEW_TEMPLATE, {title : HTML_TITLE})
}

const loginController = {
    login,
    loginLocal
}

export default loginController