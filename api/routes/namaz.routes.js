import express from 'express'
import { getNamazHistory, getTodayNamaz, saveNamaz } from '../controllers/namaz.controller.js'
import verifyToken from '../middlewares/verifyToken.js'

const namazRoutes = express.Router()

namazRoutes.use(verifyToken)
namazRoutes.patch('/add', saveNamaz)
namazRoutes.get('/get-history', getNamazHistory)
namazRoutes.get('/get-today', getTodayNamaz)

export default namazRoutes
