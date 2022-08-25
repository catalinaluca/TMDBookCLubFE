import { useEffect,useState } from "react";
import axios from "../api/axios";
import Book from "./Book";
import UserDetails from "./UserDetails";
const Waitlist=(props)=>{
    const [id,setId]=useState(0);
    const [waiters, setWaiters]=useState();    
    const [errMsg, setErrMsg]=useState('');
    const [available,setAvailable]=useState(false);
    useEffect(() => {
        setId(props.id);
        let isMounted=true;
        setErrMsg('');
        const controller=new AbortController();
        const getBooks =async ()=>{

            try{
                const response =await axios.get(`/books/waitingList/getWaiters?bookId=${props.id}`,{headers:{'Authorization':`Bearer ${localStorage.getItem("accessToken")}`}},{
                    signal:controller.signal
                },)
                console.log(response.data);
                isMounted && setWaiters(response.data);
            }catch(err){
                if(err.response.data==='This book has not been borrowed yet!'){
                    setErrMsg('This book is available and you can not put yourself on the waiting list!');
                    setAvailable(true);
                }else{
                    setErrMsg(err.response.data);
                    setAvailable(false);
                }
            }
        }
        getBooks();
        return ()=>{
            isMounted=false;
            controller.abort();
        }
    },[props.id])

    const renderList=()=>{
        return waiters.map(waiter=>{
            return (<li key={waiter.waitingId}><UserDetails id={waiter.waiterId}/></li>);
        })
    }

    const addOnWaitingList=async()=>{
        const controller=new AbortController();
        let user=JSON.parse(localStorage.getItem("user"));
        let userId=user.id;
            try{
                const response =await axios.post(`/books/waitingList/add?userId=${userId}&bookId=${props.id}`,{},{headers:{'Authorization':`Bearer ${localStorage.getItem("accessToken")}`}},{
                    signal:controller.signal
                },)
                console.log(response.data);
            }catch(err){
                setErrMsg(err.response.data);
            }
        window.location.reload(true);
    }
    const removeFromWaitingList=async()=>{
        const controller=new AbortController();
        let user=JSON.parse(localStorage.getItem("user"));
        let userId=user.id;
            try{
                const response =await axios.delete(`/books/waitingList/delete/waiter?waiterId=${userId}`,{headers:{'Authorization':`Bearer ${localStorage.getItem("accessToken")}`}},{
                    signal:controller.signal
                },)
                console.log(response.data);
            }catch(err){
                setErrMsg(err.response.data);
            }
        window.location.reload(true);
    }

    return(
        <div className="searchDiv">
            {available===true?
                (
                    <Book id={id}/>
                ):
                (
                    <>
                    <h3>Waitlist:</h3>
                    {waiters?.length?
                        (
                         <ul>{renderList()}</ul>
                        )
                        :
                        (
                            <p>There is nobody on the waiting list at the moment!</p>
                        )
                    }
                    <button className="App-button" onClick={addOnWaitingList}>
                        Add yourself
                    </button>
                    <button className="App-button" onClick={removeFromWaitingList}>
                        Remove yourself
                    </button>
                    </>
                )
            }
            <p className={errMsg?'errMsg':'offscreen'}>{errMsg}</p>
        </div>
    )
}

export default Waitlist;