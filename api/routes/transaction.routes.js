import express from "express";
import { transactionController } from "../controllers/transaction.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/create",verifyToken, transactionController.create);
router.get("/getAll", verifyToken, transactionController.getAll);
router.get("/getById/:id", transactionController.getOne);
router.patch("/update/:id", verifyToken , transactionController.update);
router.delete("/delete/:id", transactionController.delete);

export default router;
