import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signup(){
    const[form,setForm]=useState({name:"",email:"",password:""});
    const {signup}=useAuth();
    const navigate=useNavigate();

    const handleSubmit=async(e)=>{
        e.preventDefault();
        await signup(form);
        navigate("/");
    };


return(
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border px-3 py-2 rounded" />
        <input type="email" placeholder="Email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border px-3 py-2 rounded" />
        <input type="password" placeholder="Password" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border px-3 py-2 rounded" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700">
          Create Account
        </button>
      </form>
    </div>
);
}