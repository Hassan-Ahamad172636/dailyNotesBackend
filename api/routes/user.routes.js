import Router from "express"
import userController from "../controllers/user.controller.js";
const userRoutes = Router();

userRoutes.post('/create', userController.signup)
userRoutes.post('/login', userController.login)
userRoutes.post('/get', userController.changePassword)

export default userRoutes;