import { MAX_DESCRIPTION_SIZE, MAX_TITLE_SIZE } from "../../../../../misc/limits.js"
import { Schema } from "mongoose";

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

export const productCollectionName = 'Products'