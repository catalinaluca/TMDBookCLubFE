import { useEffect,useState } from "react";
import axios from "../api/axios";

const Waitlist=(props)=>{
    const [books, setBooks]=useState();    
    const [errMsg, setErrMsg]=useState('');

    useEffect(() => {
        let isMounted=true;
        setErrMsg('');
        const controller=new AbortController();
        const getBooks =async ()=>{

            try{
                const response =await axios.get(`/books/waitingList/getWaiters?bookId=${props.id}`,{headers:{'Authorization':`Bearer ${localStorage.getItem("accessToken")}`}},{
                    signal:controller.signal
                },)
                console.log(response.data);
                isMounted && setBooks(response.data);
            }catch(err){
                setErrMsg(err.response.data);
            }
        }
        getBooks();
        return ()=>{
            isMounted=false;
            controller.abort();
        }
    },[props.id])

    const renderList=()=>{
        return (books.map(book=>{
            return <li>{book.waitingId}</li>
        })
            )
    }

    return(
        <div className="searchDiv">
            {books?.length?(
                <ul>
                    {renderList};
                </ul>
            ):(<ul>
                <li>There are no people on the waiting list!</li>
            </ul>)

            }
        </div>
    )
}

export default Waitlist;