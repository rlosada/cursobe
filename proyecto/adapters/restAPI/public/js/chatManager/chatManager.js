import { CHAT_MESSAGES, buildDataMessage, buildRegisterFailMessage, buildRegisterSuccessMessage, validateMessage, ALL_USERS } from "../chat/chat_messages.js"

class Users {
    #users = []
    rmv(uid) {
        let index = this.#users.findIndex((user) => (user.uid === uid))
        if(index === -1)
            return
        this.#users.splice(index, 1)
    }
    add(uid, name) {
        this.#users.push({uid, name: name.toLowerCase()})
    }
    exists(uid) {
        return this.#users.some(user => user.uid === uid)
    }
    userExists(name) {
        return this.#users.some(user => user.name === name.toLowerCase())
    }
    getUid(name) {
        let index = this.#users.findIndex(user => (user.name === name.toLowerCase()))
        if(index < 0)
            return -1
        else
            return this.#users[index].uid
    }
}

export class ChatManager {
    #channel
    #storage
    #users
    #logger
    constructor(lg, channel, storage) {
        this.#users = new Users()
        this.#storage = storage
        this.#channel = channel
        this.#logger = lg

        // Registrar las funciones de callback
        this.#channel.setCallbacks({
            data_ind : this.#prodDataInd.bind(this),
            disc_ind : this.#procDiscInd.bind(this)
        })
    }

    start() {
        this.#channel.start()
        this.#logger.Info(`${this.constructor.name}|start`, 'ChatManager started') 
    }

    // Funciones de callback para recibir eventos desde el channel
    #prodDataInd(cid, data) {

        if(!validateMessage(data)) {
            this.#logger.Info(`${this.constructor.name}|start`, `[cid-${cid}] Invalid message discarding`) 
            return
        }
        this.#procMessage(cid, data)
    }

    #procDiscInd(cid) {
        this.#logger.Info(`${this.constructor.name}|procDiscInd`, `[cid-${cid}] Connection closed from remote, deleting user`) 
        this.#users.rmv(cid)
    }

    // Funcion para procesar un mensaje recibido de un cliente
    #procMessage(cid, m) {
        let {type} = m
        switch(type) {
            case CHAT_MESSAGES.MSG_REGISTER:
                // Verificar si ese CID ya registro otro usuario
                let cidExists = this.#users.exists(cid)
                if(cidExists) {
                    this.#logger.Warn(`${this.constructor.name}|procMessage`, `[cid-${cid}] cid is already registered, rejecting new registration`)  
                    this.#channel.sendData(cid, buildRegisterFailMessage())
                    return
                }
                // Verificar si el nombre que se pretende registrar fue registrado por otro CID
                let {user} = m
                let userExists = this.#users.userExists(user)
                if(userExists) {
                    this.#logger.Warn(`${this.constructor.name}|procMessage`, `[cid-${cid}] user name is already registered, rejecting new registration`)  
                    this.#channel.sendData(cid, buildRegisterFailMessage())
                    return
                }
                // Registrar el nuevo CID con el usuario solicitado
                this.#users.add(cid, user)
                this.#logger.Warn(`${this.constructor.name}|procMessage`, `[cid-${cid}] ${user} registered`)  
                this.#channel.sendData(cid, buildRegisterSuccessMessage())
                break
            case CHAT_MESSAGES.MSG_DATA:
                let {destination, source, message} = m
                // Determinar si el mensaje es para todos los usuarios
                if(destination === ALL_USERS) {
                    this.#channel.sendDataToAll(buildDataMessage(source, destination, message))    
                } 
                else {
                    // Determinar el usuario destino, no se permite enviar mensajes a si mismo
                    let dcid = this.#users.getUid(destination)
                    if(dcid < 0) {
                        this.#logger.Warn(`${this.constructor.name}|procMessage`, `[cid-${cid}] ${destination} is not a valid user, discarding message`)  
                        return
                    }
                    if(dcid === cid)
                        return
                    this.#channel.sendData(dcid, buildDataMessage(source, destination, message))
                }
                this.#logger.Custom1(`${this.constructor.name}|procMessage`, `[cid-${cid}] message ${message} from ${source} send to ${destination}`)  

                // Almacenar el mensaje (no es critico)
                this.#storage.storeMessage(source, message).catch((err) => this.#logger.Warn(`${this.constructor.name}|procMessage`,`Fail to store message in db, err=${err}`))
                break
            default:
                this.#logger.Warn(`${this.constructor.name}|procMessage`, `[cid-${cid}] Unkonw type ${type},  discarding message`)  
                break
        }
    }
}