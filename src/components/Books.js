import { useState,useEffect } from "react";
import axios from "../api/axios"
import Waitlist from "./Waitlist";
const Books=()=>{
    const [id,setId]=useState(0);
    const [show,setShow]=useState(false);
    const [books, setBooks]=useState();
    const [errMsg, setErrMsg]=useState('');
    const [wishList,setWishList]=useState();

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
            setShow(!show);
            setId(bookId);
            console.log(id);
     }

     const wishlist=async (bookId)=>{
        let isMounted=true;
        const controller=new AbortController();
        let user=JSON.parse(localStorage.getItem("user"));
        let userId=user.id;
        try{
            const response = await axios.post(`/books/wishlist/add?userId=${userId}&bookId=${bookId}`,{},{headers:{'Authorization':`Bearer ${localStorage.getItem("accessToken")}`}},{
                signal:controller.signal
            },)
            console.log(response.data);    
            isMounted && setWishList(response.data);         
        }catch(err){
            setErrMsg(err.response.data);
        } 
     }
    const renderTable=()=>{
        return books.map(book=>{
            return(
                <tr key={book.bookId} className="App-tr" >
                <td>{book.isbn}</td>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>
                    <button className="App-button" onClick={()=>waitlist(book.bookId)}>
                        {(show && id===book.bookId)?('Unsee '):('See ')} Waitlist
                    </button>
                    <button className="App-button" onClick={()=>wishlist(book.bookId)}>Add on wishlist</button>
                </td>
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
            {show?(
                    <Waitlist id={id}/>
                ):(
                    <></>
                )
            }
            {wishList?
                (<p>Book with ID:{wishList.bookId} added to your wishlist!</p>):
                (<p className={errMsg?"errMsg":"offscreen"}>{errMsg}</p>)
            }
        </article>
    );
}

export default Books