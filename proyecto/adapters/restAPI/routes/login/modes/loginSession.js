import logger from "../../../../../misc/logger/LoggerInstance.js"

/**
 * Inicializa el objeto session que luego buscara passport para inicializar
 * req.user
  * @param {user} user 
 */
function useSession(req, user) {
    logger.Info('useSession', `Loading user to req.session.passport`)
    req.session.passport = { user : user }
}

export default useSession