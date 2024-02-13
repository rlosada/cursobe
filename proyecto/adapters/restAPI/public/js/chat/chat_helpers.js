export function ShowRegister() {
    return `<div><form id="registerForm"><input id="registerInput" autocomplete="off"><button>Registrar</button></form></div>`
}

export function ShowChat() {
    return `
    <label>Message List</label><ul id="messagesList"></ul>
    <form id="messageForm">
        <label>Destination</label><input id="destination">
        </br>
        <label>Message</label><input id="message" autocomplete="off"><button>SenMessage</button>
    </form>`
}
