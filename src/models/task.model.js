import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title:{
        type:String
    },
    category:{
        type:String
    },
    description:{
        type:String
    },
    priority:{
        type:String
    },
    dueDate:{
        type:String
    },
    isCompleted: {
        type: Boolean
    }
}, { timestamps: true })

export const Task = mongoose.model("Task", taskSchema)