import { useState, useEffect } from 'react';
import axios from '../api/axios';

const BorrowedBooks=()=>{
    const [books,setBooks]=useState();
    const [errMsg, setErrMsg]=useState('');

    useEffect( () => {
        let isMounted=true;
        setErrMsg('');
        const controller=new AbortController();
        let user=JSON.parse(localStorage.getItem("user"));
        let id=user.id;
        const getBooks = async ()=>{

            try{
                const response = await axios.get(`/books/borrowed/rented?userId=${id}`,{headers:{'Authorization':`Bearer ${localStorage.getItem("accessToken")}`}},{
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

    const renderTable=()=>{
        return books.map((book,index)=>{
            return(
                <tr key={book[0].bookId} className="App-tr">
                    <td>{book[0].bookId}</td>
                    <td>{book[0].isbn}</td>
                    <td>{book[0].title}</td>
                    <td>{book[0].author}</td>
                    <td>{book[1].substring(0,10)}</td>
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
                            <th>End Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderTable()}
                        </tbody>
                    </table>
                ):<p className='p-err'>{errMsg}</p>
            }
        </article>
    );
}
export default BorrowedBooks;