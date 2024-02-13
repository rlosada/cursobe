import mongoose, { Schema } from "mongoose";
import {productCollectionName} from './products.schema.js'

const productInfoSchema = new Schema({
    pid : { 
        type : mongoose.Schema.Types.ObjectId, 
        required : true, 
        ref : productCollectionName
    },
    quantity : {
        type: Number,
        required : true,
        min : 0
    }
}) 

export const cartsSchema = new Schema( 
    {
        productsInfo : { type :  [productInfoSchema] , required : true, default : undefined }
    }
)

export const cartsCollectionName = 'Carts'