import Router from "express"
import { completeTask, createTask, deleteTask, getTaskById, getTasks, updateTask } from "../controllers/task.controller.js"
import verifyToken from "../middlewares/verifyToken.js"

const router = Router()

router.post("/create", createTask)
router.get("/get", getTasks)
router.get("/get-by-id/:id", getTaskById)
router.patch("/update/:id", updateTask)
router.delete("/delete/:id", deleteTask)
router.patch("/isCompleted/:id",verifyToken , completeTask)

export default router
