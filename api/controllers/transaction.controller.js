import { Transaction } from "../models/transaction.mode.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateApiResponse from "../utils/generateApiResponse.js";

// Helper function for validation
function validateTransactionData({ transactionType, transactionTitle, transactionAmount, transactions, date }) {
  const errors = [];

  const incomeCategories = ['job', 'freelance', 'investment', 'business', 'other'];
  const expenseCategories = ['Housing', 'Food', 'Transportation', 'Bills', 'Entertainment', 'Healthcare', 'Shopping', 'Other'];

  if (!transactionType || !["income", "expense"].includes(transactionType)) {
    errors.push("Transaction type is required and must be 'income' or 'expense'.");
  }

  if (!transactionTitle?.trim()) {
    errors.push("Transaction title is required.");
  }

  if (transactionAmount === undefined || transactionAmount < 0) {
    errors.push("Transaction amount is required and must be a positive number.");
  }

  if (transactionType === "income") {
    if (!transactions || !incomeCategories.includes(transactions)) {
      errors.push(`Transactions field for income must be one of: ${incomeCategories.join(", ")}.`);
    }
  }

  if (transactionType === "expense") {
    if (!transactions || !expenseCategories.includes(transactions)) {
      errors.push(`Transactions field for expense must be one of: ${expenseCategories.join(", ")}.`);
    }
  }

  if (!date) {
    errors.push("Date is required.");
  }

  return errors;

}

export const transactionController = {
  // Create transaction
  create: asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { transactionType, transactionTitle, transactionAmount, transactions, date, description } = req.body;

    const errors = validateTransactionData({ transactionType, transactionTitle, transactionAmount, transactions, date });
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation error", errors });
    }

    const transaction = await Transaction.create({
      user: _id,
      transactionType,
      transactionTitle,
      transactionAmount,
      transactions,
      date,
      description
    });

    res.status(201).json({
      message: "Transaction created successfully",
      data: transaction
    });
  }),

  // Get all transactions for the user
  getAll: asyncHandler(async (req, res) => {
    const user = req.user._id;

    const transactions = await Transaction.find({ user })

    if (!transactions) {
      return generateApiResponse(res, {
        statusCode: 400, success: false,
        message: 'Transactions not found!',
        data: null
      })
    }

    return generateApiResponse(res, {
      statusCode: 200, success: true,
      message: 'Transactions fetched successfully!',
      data: transactions
    })

  }),

  // Get single transaction
  getOne: asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;
    const { id } = req.params;

    const transaction = await Transaction.findOne({ _id: id, user: userId });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({
      message: "Transaction fetched successfully",
      data: transaction
    });
  }),

  // Update transaction
  update: asyncHandler(async (req, res) => {
    const { _id: userId } = req.user;  // ✅ token se user id

    const { transactionId, transactionType, transactionTitle, transactionAmount, transactions, date, description } = req.body;

    const errors = validateTransactionData({ transactionType, transactionTitle, transactionAmount, transactions, date });
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation error", errors });
    }

    // ✅ findOneAndUpdate use karo, kyunki query object hai (user + transaction)
    const transaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, user: userId }, // sirf us user ka transaction update hoga
      { transactionType, transactionTitle, transactionAmount, transactions, date, description },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({
      message: "Transaction updated successfully",
      data: transaction
    });
  }),


  // Delete transaction
  delete: asyncHandler(async (req, res) => {
    // const { _id: userId } = req.user;
    const { id } = req.params;

    const transaction = await Transaction.findOneAndDelete(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({
      message: "Transaction deleted successfully",
      data: transaction
    });
  }),
};
