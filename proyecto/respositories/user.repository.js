import getUsersManager from "../application/users/UserManagerInstance.js";

const userDAO = await getUsersManager()

async function getByExternaId(externalID) {
    const user = await userDAO.getByExternaId(externalID)
    return user
}

async function getByEmailAndPass(email, password) {
    const user = await userDAO.getUserByEmailAndPass(email, password)
    return user
}

async function add(user) {
    const rc = await userDAO.addUser(user)
    return rc
}

async function addExternal(user) {
    const rc = await userDAO.addExternaUser(user)
    return rc
}

const UserRepository = {
    getByExternaId,
    getByEmailAndPass,
    add,
    addExternal
}

export default UserRepository