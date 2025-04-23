import { Appbar } from "../component/appbar"
import { Balance } from "../component/balance"
import { Users } from "../component/users"


export const Dashboard= ()=>{
    return <div>
        <Appbar />
        <div className="m-8">
           <Balance value={"10000"}/>
           <Users />

            
        </div>

    </div>
}