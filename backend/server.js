import express from 'express';
import dotenv from 'dotenv'
import { connectDB } from './db/db.js';
import cookieParser from 'cookie-parser'
import userRoute from './routes/userRoute.js'
import studyRoutes from './routes/studyPlanRoutes.js'
import studyHistoryRoute from './routes/studyProgressHistroyRoute.js'
import aiRoute from './routes/aiRoute.js'
import path from 'path'
import cors from 'cors'

dotenv.config();

const app = express();

app.use(cors({
     origin: "http://localhost:5173",
     credentials: true
}))

app.use(cookieParser())

const PORT = process.env.PORT || 3000

const __dirname = path.resolve();

app.use(express.json());




await connectDB();


app.use("/api/user",userRoute)
app.use('/api/study',studyRoutes)
app.use('/api/subject',studyHistoryRoute)
app.use('/api/ai', aiRoute)


if(process.env.NODE_ENV === "production"){
     app.use(express.static(path.join(__dirname,"../frontend/dist")));
     app.get("/{*splat}",(req,res)=>{
          res.sendFile(path.join(__dirname,"../frontend","dist","index.html"))
     })
}


app.listen(PORT,()=>{
     console.log("Server is started in port",PORT)
})


