import CONSTANTS from "../../../../../misc/constants.js"
import { Schema } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

let { MAX_DESCRIPTION_SIZE, MAX_TITLE_SIZE } = CONSTANTS

export const productsSchema = new Schema( 
    {
        title :         { type : String, required : true, maxLength : MAX_TITLE_SIZE        },
        description :   { type : String, required : true                                    },
        price :         { type : Number, required : true, min : 0                           },
        code :          { type : String, required : true                                    },
        stock :         { type : Number, required : true,   min : 0                         },
        category :      { type : String, required : true, maxLength : MAX_DESCRIPTION_SIZE  }, 
        status :        { type : Boolean, default: true                                     },
        thumbnails :    { type : [ String ]                                                 }   
    }
)

// Agregar plugin de paginacion
productsSchema.plugin(mongoosePaginate)

export const productCollectionName = 'Products'