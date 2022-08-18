import { useState,useEffect } from "react";
import axios from "../api/axios"
const Books=()=>{
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

    const renderTable=()=>{
        return books.map(book=>{
            return(
                <tr key={book.bookId} className="App-tr">
                <td>{book.bookId}</td>
                <td>{book.isbn}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
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
        </article>
    );
}

export default Books