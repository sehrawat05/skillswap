import { createContext } from "react";
import { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AuthContext=createContext();
export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null);
    const navigate=useNavigate();
    useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser) setUser(storedUser);
}, []);

    const signup=async(formData)=>{
        const res=await axios.post('http://localhost:5000/api/auth/signup',formData);
        localStorage.setItem("token",res.data.token);
        setUser({ ...res.data.user, token: res.data.token });
    };

    const login=async(formData)=>{
        const res=await axios.post("http://localhost:5000/api/auth/login",formData);
        localStorage.setItem("token",res.data.token);
        setUser({ ...res.data.user, token: res.data.token });
    };

    const logout=()=>{
        localStorage.removeItem("token");
        setUser(null);
        navigate('/')
    };

    return(
        <AuthContext.Provider value={{user,signup,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth=()=> useContext(AuthContext);