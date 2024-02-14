// Vista para registrar un usuario
export function ShowRegister() {
    return `<div>
    <form id="registerForm">
    <legend>Registrar usuario</legend>
    <label for="registerInput">email</label>
    <input id="registerInput" type="email" autocomplete="off"><button>Registrar</button></form></div>`
}

// Vista del Chat
export function ShowChat() {
    return `
    <label>Message List</label><ul id="messagesList"></ul>
    <form id="messageForm">
        <label>Destination</label>
        <input id="destinationInput" type="email">
        <input title="Si se selecciona se envia el mensaje a todos" id="destinationAllInput" type="checkbox" name="brodcast">
        <label for="broadcast">broadcast</label>
        </br>
        <label>Message</label><input id="messageInput" autocomplete="off" type="text"><button>SendMessage</button>
    </form>`
}

