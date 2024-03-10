import { MAX_USER_FIRST_NAME, MAX_USER_LAST_NAME, MAX_USER_EMAIL } from "../../../../../misc/constants.js"
import { Schema } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'
import { validateEmail, validateUserType } from "../../../../../misc/utils.js"
import { getHash } from "../../../../../misc/utils.js"
import logger from './../../../../../misc/logger/LoggerInstance.js'

export const usersSchema = new Schema( 
    {
        firstName :  { type : String, required : true, maxLength : MAX_USER_FIRST_NAME },
        lastName :   { type : String, required : true, maxLength : MAX_USER_LAST_NAME  },
        email : {
                        type: String,
                        unique:true,
                        required: true,
                        maxLength : MAX_USER_EMAIL, 
                        validate: {
                            validator: validateEmail,
                            message: 'Invalid email address format',
                        }
        },
        age :        { type : Number, required : true,   min : 0, max : 120              },
        // El password no es requerido ya que los usuarios logeados a traves de otro mecanismo (ej:github) 
        // no poseen password
        password :   { type : String, maxLength : MAX_USER_LAST_NAME  },
        type :       { 
                        type : String, 
                        required : true, 
                        validate : {
                            validator: validateUserType,
                            message: 'Invalid user type'       
                        }
        },
        // Si este valor existe, entonces el usuario se identifico desde otra plataforma
        // no uso user/pass
        externalID : {
            type : String 
        }
    }
)

// Agregar plugin de paginacion
usersSchema.plugin(mongoosePaginate)

// Cargar hooks en el schema

// usersSchema.pre('findOne', function(next) {
    
//     logger.Info('Mongoose | findOne | pre-hook', `Input query: ${JSON.stringify(this.getQuery())}`)

//     // Si la query viene con password, hashearlo primero
//     let { password } = this.getQuery()

//     if(password) 
//         this.where('password', getHash(password).toUpperCase())

//     logger.Info('Mongoose | findOne | pre-hook', `Output query: ${JSON.stringify(this.getQuery())}`)

//     // Ejecutar el proximo middleware
//     next()
// })

// usersSchema.pre('save', function(next) {
    
//     if(this.password) 
//         this.password = getHash(this.password).toUpperCase()
    
//     // Ejecutar el proximo middleware
//     next()
// })

export const usersCollectionName = 'Users'