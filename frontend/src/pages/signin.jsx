import { useState } from "react"
import { BottomWarning } from "../component/bottomwarning"
import { Button } from "../component/button"
import { Heading } from "../component/heading"
import { Inputbox } from "../component/inputbox"
import { Subheading } from "../component/subheading"
import { Signup } from "./signup"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export const Signin= ()=>{
    const[username,setusername]=useState("");
    const[password,setPassword]=useState("");
    const navigate = useNavigate();
    
    return <div  className="bg-slate-300 h-dvh flex justify-center ">
        <div  className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-100 text-center p-3 h-max px-4">
             <Heading label={"Sign in"}/>
             <Subheading label={"Enter your credentials to access your acoount"} />
             <Inputbox onChange={(e)=>{
                setusername(e.target.value)
             }} label={"Email"} placeholder={"jhonDoe@example.com"} />
             <Inputbox onChange={(e)=>{
                setPassword(e.target.value)
             }} label={"Password"} placeholder={"Password"} />
             <Button onClick={async()=>{
                const response=await axios.post("http://localhost:3000/api/v1/user/signin",{
                    username,
                    password
                })
                localStorage.setItem("token",response.data.token);
                navigate("/dashboard")


             }} label={"Sign in"} />
             <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"}/>

            </div>

        </div>

    </div>
}