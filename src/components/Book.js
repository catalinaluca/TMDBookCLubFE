import { useEffect, useState } from "react";
import axios from "../api/axios";

const Book=(props)=>{
    const [book,setBook]=useState();
    const [errMsg,setErrMsg]=useState('');
    useEffect(() => {
        let isMounted=true;
        setErrMsg('');
        const controller=new AbortController();
        const getBooks =async ()=>{

            try{
                const response =await axios.get(`/books/details?bookId=${props.id}`,{headers:{'Authorization':`Bearer ${localStorage.getItem("accessToken")}`}},{
                    signal:controller.signal
                },)
                console.log(response.data);
                isMounted && setBook(response.data);
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
    function available(av){
        if(av!==null){
            return <>Available at: {av.substring(0,10)}</>
        }else{
            return <a href="/availableBooks" className="App-a">Rent</a>
        }
    }
    function renderDiv(){
                let title=book[1];
                let author=book[2];
                let isbn=book[3];
                let av=book[4];
                return(
                     <div>  
                        {title}, {author}, {isbn}
                        <br/>
                        {available(av)}
                    </div>
                )
    }

    return(
        <div className="searchDiv">
            {book?(
                <div>{renderDiv()}</div>
            ):(<p className={errMsg?"errMsg":"offScreen"}>{errMsg}</p>)
            }
        </div>

    )

}

export default Book;