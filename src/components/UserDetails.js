import axios from "../api/axios";
import { useState,useEffect } from "react";
const UserDetails=(props)=>{
    const [user,setUser]=useState();
    const [errMsg,setErrMsg]=useState('');
    useEffect(() => {
        let isMounted=true;
        setErrMsg('');
        const controller=new AbortController();
        const getUsers =async ()=>{

            try{
                const response =await axios.get(`/users/user?userId=${props.id}`,{headers:{'Authorization':`Bearer ${localStorage.getItem("accessToken")}`}},{
                    signal:controller.signal
                },)
                console.log(response.data);
                isMounted && setUser(response.data);
            }catch(err){
                setErrMsg(err.response.data);
            }
        }
        getUsers();
        return ()=>{
            isMounted=false;
            controller.abort();
        }
    },[props.id])

    function renderDiv(){
        return(
             <div>
                {user.username}, {user.email}, {user.name} {user.surname}
            </div>
        )
    }

    return(
    <div className="searchDiv">
        {user?(
            <div>{renderDiv()}</div>
        ):(<p className={errMsg?"errMsg":"offScreen"}>{errMsg}</p>)
        }
    </div>

)
}

export default UserDetails;