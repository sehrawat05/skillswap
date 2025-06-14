import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router=express.Router();

router.post("/signup",async(req,res)=>{
    const{name,email,password}=req.body;
    try{
        const exists=await User.findOne({email});
        if(exists) return res.status(400).json({message:"user already exists"});

        const hashed =await bcrypt.hash(password,10);
        const newUser=await User.create({name,email,password:hashed});

        const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn :"7d"});
        res.status(201).json({user:newUser,token});
    }catch(e){
        res.status(500).json({error:e.message});
    }
});

router.post("/login",async(req,res)=>{
    const {email,password} =req.body;
    try{
        const user=await User.findOne({email});
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ user, token });
  } catch (e) {
    res.status(500).json({ error: e.message });
    }
});

export  default router;