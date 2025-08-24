import mongoose from "mongoose";

const incomeCategories = ['job', 'freelance', 'investment', 'business', 'other'];
const expenseCategories = ['Housing', 'Food', 'Transportation', 'Bills', 'Entertainment', 'Healthcare', 'Shopping', 'Other'];

const transactionSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    transactionType: {
        type: String,
        enum: ['income', 'expense']
    },
    transactionTitle: {
        type: String,
    },
    transactionAmount: {
        type: Number,
    },
    transactions: {
    type: String,
    enum: [...incomeCategories, ...expenseCategories],
    required: true,
  },
    date: {
        type: String,
    },
    description: {
        type: String
    }
}, { timestamps: true })

export const Transaction = mongoose.model("Transaction", transactionSchema)