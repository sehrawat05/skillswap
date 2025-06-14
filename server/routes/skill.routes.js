import express from "express";
import Skill from "../models/Skill.js";
import { verifyToken } from "../middleware/auth.js"; 

const router=express.Router();

router.post("/",verifyToken,async(req,res)=>{
    const {name,bio,skills,avatar}=req.body;
    try{
        const skill=await Skill.create({
            user:req.user._id,
            name,
            bio,
            skills,
            avatar,
        });
        res.status(201).json(skill);
    }catch(err){
        res.status(400).json({error:err.message});
    }
});

router.get("/",async(req,res)=>{
    const skills=await Skill.find().populate("user","email");
    res.json(skills);
});
export default router;