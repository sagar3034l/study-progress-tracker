import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import { connectDB } from './db/db.js';
import cookieParser from 'cookie-parser'
import userRoute from './routes/userRoute.js'
import studyRoutes from './routes/studyPlanRoutes.js'
import studyHistoryRoute from './routes/studyProgressHistroyRoute.js'
import aiRoute from './routes/aiRoute.js'

dotenv.config();

const app = express();

app.use(cookieParser())

const PORT = process.env.PORT || 3000


app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true
}))

app.use(express.json());

await connectDB();


app.use("/api/user",userRoute)
app.use('/api/study',studyRoutes)
app.use('/api/subject',studyHistoryRoute)
app.use('/api/ai', aiRoute)

app.listen(PORT,()=>{
     console.log("Server is started in port",PORT)
})


