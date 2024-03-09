import {initPassportLocal} from "./passport-local.js";
import { initPassportCommon } from "./passport-common.js";

async function initPassport(passport) {
    // Inicializacion de cosas comunes independientes del
    // mecanimo de authentication 
    await initPassportCommon(passport)
    // Inicializacion de cosas exclusivas del mecanismo de 
    // authentication local
    await initPassportLocal(passport)
}

export default initPassport