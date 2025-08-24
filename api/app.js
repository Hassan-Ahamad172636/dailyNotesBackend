// app.js
import mongoose from 'mongoose';
import express from 'express'
import cors from 'cors'
import userRoutes from './routes/user.routes.js';
import namazRoutes from './routes/namaz.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import scheduleRoutes from './routes/schedule.routes.js';
import taskRoutes from './routes/task.routes.js';

const app = express();

// Middlewares
app.use(express.json()); // for parsing application/json
app.use(cors())

app.use('/user', userRoutes)
app.use('/namaz', namazRoutes)
app.use('/transaction', transactionRoutes)
app.use('/schedule', scheduleRoutes)
app.use('/task', taskRoutes)

export default app;
