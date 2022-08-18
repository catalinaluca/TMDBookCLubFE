import { useEffect, useState } from 'react';
import axios from "../api/axios"
const Users=()=> {
    const [users, setUsers]=useState();
    const [errMsg,setErrMsg]=useState('');
    useEffect( () => {
        let isMounted=true;
        setErrMsg('');
        const controller=new AbortController();
        const getUsers = async ()=>{

            try{
                const response = await axios.get("/users",{headers:{'Authorization':`Bearer ${localStorage.getItem("accessToken")}`}},{
                    signal:controller.signal
                },)
                console.log(response.data);
                isMounted && setUsers(response.data);                
            }catch(err){
                setErrMsg(err.response.data);
            }
        }
        getUsers();

        return ()=>{
            isMounted=false;
            controller.abort();
        }
    },[])

    const renderTable = () => {
        return users.map(user => {
          return (
            <tr key={user.userId}  className="App-tr">
              <td>{user.userId}</td>
              <td>{user.username}</td>
              <td>{user.name}</td> 
              <td>{user.surname}</td>
              <td>{user.email}</td>
            </tr>
          )
        })
      }

    return (
        <article className='App-section'>
            {users?.length
                ?(                    
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Name</th>
                            <th>Surname</th>
                            <th>Email</th>
                        </tr>
                        </thead>
                        <tbody>{renderTable()}</tbody>
                    </table>
                ):<p className='p-err'>{errMsg}</p>
            }
        </article>
    );
}
  
export default Users;


