import { MESSAGE_MAX_SIZE, MESSAGE_MIN_SIZE } from "../../../../../misc/limits";
import { Schema } from "mongoose";

export const messagesSchema = new Schema({
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
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