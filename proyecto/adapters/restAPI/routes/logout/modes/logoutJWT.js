import logger from "../../../../../misc/logger/LoggerInstance.js"
import { JWT_COOKIE_NAME} from "../../../../../misc/constants.js"

function logoutJWT(res) {
    logger.Info('logoutJWT', 'JWT Cookie destroyed')
    res.clearCookie(JWT_COOKIE_NAME)
    res.redirect('/login')
}

export default logoutJWT