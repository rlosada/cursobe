
const CONSTANTS = {
    DEFAULT_LIMIT : 10,         // Numero de productos por hoja por defecto
    DEFAULT_PAGE : 1,           // Numero de pagina por defecto
    DATA_SOURCE : {             // Origenes de datos
        DB : 'db',
        FS : 'fs'
    },
    MAX_TITLE_SIZE : 32,        // Maxima cantidad de caracteres permitidos para un title       (campo : title)
    MAX_DESCRIPTION_SIZE : 60,  // Maxima cantidad de caracteres permitidos para un description (campo : description)
    MESSAGE_MIN_SIZE : 1,       // Minima cantidad de caracteres que puede tener un mensaje a ser almacenado en la coleccion Messages
    MESSAGE_MAX_SIZE : 256,     // Maxima cantidad de caracteres que puede tener un mensaje a ser almacenado en la coleccion Messages
    MAX_USER_FIRST_NAME : 64,
    MAX_USER_LAST_NAME : 64,
    MAX_USER_EMAIL : 64,
    MAX_EXTERNAL_ID_LENGTH : 256,
    USER_TYPES : {                  // Tipos de usuarios permitidos
        ADMIN :  'ADMIN_USER', 
        SIMPLE : 'USUARIO' 
    },
    DEFAUT_SALT_ROUNDS : 10,
    PASSPORT_LOCAL_STRATEGY : 'local',
    PASSPORT_GITHUB_STRATEGY : 'github',
    EXTERNAL_SOURCES : {   // Fuentes externas de login permitidas
        GITHUB : 'GITHUB'
    },
    EXTERNAL_ID_SEPARATOR : '.', // Caracter utilizado para separar la fuente externa del identificador de usuario
    LOGIN_MODES : {             // Modos de login
        JWT : 'JWT', 
        SESSION : 'SESSION'
    },
    JWT_DEFAULT_SECRET : 'abcdefg',
    COOKIE_DEFAULT_SECRET : '123456',
    SESSION_DEFAULT_SECRET : '890123',
    JWT_DETAULT_EXPIRATION_SECONDS : 3600,
    COOKIE_DEFAULT_EXPIRTAION_SECONDS : 3600,
    MAX_SECRETS_LENGTH : 64,
    JWT_COOKIE_NAME : 'JWT', // Nombre de la cookie que transporta el JWT
    HTTP_SERVER : {
        DEFAULT_PORT : 8080,
        DEFAULT_WEBSOCKET_PORT : 8081,
        DEFAULT_SESSION_SECRET : '123456'
    }
}

export default CONSTANTS