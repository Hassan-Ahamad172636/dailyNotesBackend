import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    phone: {
        type: Number
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    remember: {
        type: Boolean,
    },
    resetOTP: {
        type: String
    },
    resetOTPExpires: {
        type: Date
    },
    isOtpVerified: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })
userSchema.methods.hashPassword = async function () {
    const user = this;
    if (!user.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
};

export const User = mongoose.model('User', userSchema)