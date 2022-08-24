import { useState,useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import axios from "../api/axios"
import Waitlist from "./Waitlist";
const Books=()=>{
    const [id,setId]=useState(0);
    const [books, setBooks]=useState();
    const [errMsg, setErrMsg]=useState('');

    useEffect( () => {
        let isMounted=true;
        setErrMsg('');
        const controller=new AbortController();
        const getBooks = async ()=>{

            try{
                const response = await axios.get("/books",{headers:{'Authorization':`Bearer ${localStorage.getItem("accessToken")}`}},{
                    signal:controller.signal
                },)
                console.log(response.data);
                isMounted && setBooks(response.data);                
            }catch(err){
                setErrMsg("You need to be logged in to see this!");
            }
        }
        getBooks();

        return ()=>{
            isMounted=false;
            controller.abort();
        }
    },[])

     const waitlist=(bookId)=>{
        setId(bookId);
        console.log(id);
     }

    const renderTable=()=>{
        return books.map(book=>{
            return(
                <tr key={book.bookId} className="App-tr" >
                <td>{book.bookId}</td>
                <td>{book.isbn}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td><button className="App-button" onClick={()=>waitlist(book.bookId)}>See Waitlist</button></td>
                </tr>
            )
            }
        )
    }

    return (
        <article className='App-section'>
            {books?.length
                ?(
                    <table>
                        <thead>
                            <tr>
                            <th>ID</th>
                            <th>ISBN</th>
                            <th>Title</th>
                            <th>Author</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderTable()}
                        </tbody>
                        
                    </table>
                ):<p className="p-err">{errMsg}</p>
                
            }
            {id!==0?(
                            <Waitlist id={id}/>
                        ):(
                            <></>
                        )}
        </article>
    );
}

export default Books