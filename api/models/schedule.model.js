import mongoose from "mongoose";

export const scheduleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    eventTitle: {
        type: String,
    },
    category: {
        type: String,
        enum: ['work', 'personal', 'health', 'education', 'social', 'travel', 'other']
    },
    description: {
        type: String
    },
    date: {
        type: String
    },
    startTime: {
        type: String
    },
    endTime: {
        type: String
    },
    location: {
        type: String
    },
    priority: {
        type: String
    },
    type: {
        type: String
    },
    status: {
        type: String
    },
    color: {
        type: String
    },
    confimation: {
        type: String
    },
    attendees: [{
        type: String
    }],
}, { timestamps: true })

export const Schedule = mongoose.model("Schedule", scheduleSchema)