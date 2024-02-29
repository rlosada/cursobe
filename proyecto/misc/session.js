
import configuration from "./configuration/configuration.js"

const DEFAULT_SESSION_SECRET = '123456'

/**
 * Recupera el valor del secret para firmar las cookies de sesion
 */
export default function getSessionSecret() {
    let { sesionSecret } = configuration.httpServer
    return  sesionSecret || DEFAULT_SESSION_SECRET
}