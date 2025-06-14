import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import bookmarkRoutes from './routes/bookmark.routes.js'
dotenv.config();
const app=express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.get('/',async(req,res)=>{

})
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes); 
app.use('/api/bookmarks', bookmarkRoutes);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log("Server running on 5000")))
  .catch((err) => console.error(err));