import {initPassportLocal} from "./passport-local.js";
import {initPassportGitHub} from "./passport-github.js"
import { initPassportCommon } from "./passport-common.js";
import { initPassportJWT } from "./passport-jwt.js";

async function initPassport(passport) {
    let rc
    // Inicializacion de cosas comunes independientes del
    // mecanimo de authentication 
    rc = await initPassportCommon(passport)
    if(!rc)
        return false
    // Inicializacion de cosas exclusivas del mecanismo de 
    // authentication local
    rc = await initPassportLocal(passport)
    if(!rc)
        return false
    // Inicializacion de cosas exclusivas del mecanismo de 
    // authentication a traves de github (OAuth 2.0)
    rc = await initPassportGitHub(passport)
    if(!rc)
        return false
    // Inicializacion de cosas exclusivas del mecanismo de 
    // authentication a traves JWT
    rc = await initPassportJWT(passport)
    if(!rc)
        return false    

    return true
}

export default initPassport