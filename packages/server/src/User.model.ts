import mongoose, { Schema, InferSchemaType} from "mongoose";
import { UserPreferences } from "@job-tracker/shared";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
    {
        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true
        },
        passwordHash : {
            type : String,
            required : true
        },
        name : {
            type : String,
            required : true,
        },
        refreshTokens : {
            type : [String],
            default : []
        },
        preferences : {
            timezone : {
                type : String,
                default : "UTC" 
            },
            defaultBoardView : {
                type : String,
                enum : ['board', 'list'],
                default : 'board'
            },
            emailReminders : {
                type : Boolean,
                default : true
            },
            reminderDaysBefore : {
                type : Number,
                default : 1
            },
        },
    },
    {
        timestamps : true
    }
);