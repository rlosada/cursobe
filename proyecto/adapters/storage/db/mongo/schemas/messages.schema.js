import { MESSAGE_MAX_SIZE, MESSAGE_MIN_SIZE } from "../../../../../misc/constants.js";
import { Schema } from "mongoose";
import { validateEmail } from "../../../../../misc/utils.js";

export const messagesSchema = new Schema({
    email: {
      type: String,
      required: true,
      validate: {
        validator: validateEmail,
        message: 'Invalid email address format',
      },
    },
    message : {
        type : String,
        required: true,
        minLength : MESSAGE_MIN_SIZE,
        maxLength : MESSAGE_MAX_SIZE,
        trim : true
    }
  });
export const messagesCollectionName = 'Messages'