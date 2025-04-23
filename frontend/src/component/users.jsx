import { useEffect, useState } from "react"
import { Button } from "./button";
import axios from "axios";
import { useNavigate} from "react-router-dom";

export const Users= ()=>{
    const[users,setUser]=useState([]);
    const [filter,setFilter]=useState("");
    

    useEffect(()=>{
        axios.get("http://localhost:3000/api/v1/user/bulk?filter=" + filter)
        .then(response=>{
            setUser(response.data.users)
        })
    },[filter])

    return<>
    <div className="font-bold text-xl mt-6">
        Users
    </div>
    <div className="my-2">
        <input onChange={(e)=>{
            setFilter(e.target.value)
        }} type ="text" placeholder="search users..." className="w-full shadow border rounded px-2 py-1 border-slate-200  "> 
        </input>

    </div>
    <div>
        {users.map(user=> <User user={user}/>)}
    </div>

    </>
}


function User({user}){
    const navigate = useNavigate();
    return  <div className=" flex justify-between ">
        <div className="flex pt-1">
            <div className=" rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2 ">
               <div className="flex flex-col justify-center h-full -text-xl" >
               {user.firstName[0].toUpperCase()}
               </div>
            </div>
            

          <div className="flex flex-col justify-center text-lg font-bold px-2 ">
            <div>
                {user.firstName}{user.lastName}
            </div>
            
          </div>


        </div>
        
        <div className="flex flex-col justify-center h-full">
            <Button onClick={(e)=>{
               navigate("/send?id="+user._id +"&name="+user.firstName);
            }} label={"send money"} />


         
        </div>

    </div>


}