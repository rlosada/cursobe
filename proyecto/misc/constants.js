

// Limites para el tamaño de los caracteres que son permitidos en los campos de un Product

export const MAX_TITLE_SIZE = 32        // Maxima cantidad de caracteres permitidos para un title       (campo : title)
export const MAX_DESCRIPTION_SIZE = 60  // Maxima cantidad de caracteres permitidos para un description (campo : description)

export const MESSAGE_MIN_SIZE = 1       // Minima cantidad de caracteres que puede tener un mensaje a ser almacenado en la coleccion Messages
export const MESSAGE_MAX_SIZE = 256     // Maxima cantidad de caracteres que puede tener un mensaje a ser almacenado en la coleccion Messages

export const MAX_USER_FIRST_NAME = 64
export const MAX_USER_LAST_NAME = 64
export const MAX_USER_EMAIL = 64


// Tipos de usuarios permitidos
export const USER_TYPES = {
    ADMIN :  'ADMIN_USER', 
    SIMPLE :'USUARIO' 
}


export const DEFAUT_SALT_ROUNDS = 10

export const PASSPORT_LOCAL_STRATEGY = 'local'