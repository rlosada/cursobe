

// Limites para el tamaño de los caracteres que son permitidos en los campos de un Product

export const MAX_TITLE_SIZE = 32        // Maxima cantidad de caracteres permitidos para un title       (campo : title)
export const MAX_DESCRIPTION_SIZE = 60  // Maxima cantidad de caracteres permitidos para un description (campo : description)

export const MESSAGE_MIN_SIZE = 1       // Minima cantidad de caracteres que puede tener un mensaje a ser almacenado en la coleccion Messages
export const MESSAGE_MAX_SIZE = 256     // Maxima cantidad de caracteres que puede tener un mensaje a ser almacenado en la coleccion Messages

export const MAX_USER_FIRST_NAME = 64
export const MAX_USER_LAST_NAME = 64
export const MAX_USER_EMAIL = 64
export const MAX_EXTERNAL_ID_LENGTH = 256


// Tipos de usuarios permitidos
export const USER_TYPES = {
    ADMIN :  'ADMIN_USER', 
    SIMPLE :'USUARIO' 
}


export const DEFAUT_SALT_ROUNDS = 10

export const PASSPORT_LOCAL_STRATEGY = 'local'
export const PASSPORT_GITHUB_STRATEGY = 'github'

// Fuentes externas permitidas
export const EXTERNAL_SOURCES = {
    GITHUB : 'GITHUB'
}

// Caracter utilizado para separar la fuente externa del identificador de usuario
export const EXTERNAL_ID_SEPARATOR = '.'


// Modos de login
export const LOGIN_MODES = {
    JWT : 'JWT', 
    SESSION : 'SESSION'
}

export const JWT_DETAULT_EXPIRATION_SECONDS = 3600
export const COOKIE_DEFAULT_EXPIRTAION_SECONDS = JWT_DETAULT_EXPIRATION_SECONDS

export const MAX_SECRETS_LENGTH = 64

// Nombre de la cookie que transporta el JWT
export const JWT_COOKIE_NAME = 'JWT'