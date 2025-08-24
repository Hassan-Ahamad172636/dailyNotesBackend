import Router from "express";
import { createSchedule, deleteSchedule, getScheduleById, getSchedules, updateSchedule } from "../controllers/schedule.controller.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.post('/create', verifyToken, createSchedule)
router.get('/get', verifyToken, getSchedules);

router.get('/get-by-id/:id', verifyToken, getScheduleById)
router.patch('/update/:id', verifyToken, updateSchedule)
router.delete('/delete/:id', verifyToken, deleteSchedule);

export default router;