import axios from "../api/axios";
import { useState, useEffect } from "react";


const DeleteBook=()=>{
    const [books,setBooks]=useState();
    const [bookId,setBookId]=useState();
    const [errMsg, setErrMsg]=useState('');

    useEffect( () => {
        let isMounted=true;
        setErrMsg('');
        const controller=new AbortController();
        let user=JSON.parse(localStorage.getItem("user"));
        let id=user.id;
        const getBooks = async ()=>{

            try{
                const response = await axios.get(`/books/owners/owner?ownerId=${id}`,{headers:{'Authorization':`Bearer ${localStorage.getItem("accessToken")}`}},{
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
    },[])
    const deleteBook=async (e)=>{
        const controller=new AbortController();
        const response =axios.delete(`/books/delete/book?bookId=${bookId}`,{headers:{'Authorization':`Bearer ${localStorage.getItem("accessToken")}`}},{
            signal:controller.signal
        },);
        console.log(response.data);
    }
    const renderTable=()=>{
        return books.map(book=>{
            var focused=book.bookId===bookId;
            return(
                <tr key={book.bookId} className={focused?"trfocus":"App-tr"} onClick={()=>setBookId(book.bookId)}>
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
                ?(<section className='App-section'>
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
                    <form onSubmit={deleteBook}>
                        <button className="book-action">Delete</button>
                    </form>
                    </section>
                ):<p className="p-err">{errMsg}</p>
            }
           </article>
    );
}

export default DeleteBook;