import { useState,useEffect} from "react";
import axios from "../api/axios";
 
const BORROW_URL="/books/borrowed/borrow";

const AvailableBooks=()=>{
    const [books, setBooks]=useState();
    const [period, setPeriod]=useState();
    const [bookId,setBookId]=useState();
    const [errMsg, setErrMsg]=useState('');
    const [success,setSuccess]=useState(true);
    useEffect( () => {
        let isMounted=true;
        setErrMsg('');
        const controller=new AbortController();
        const getBooks = async ()=>{

            try{
                const response = await axios.get("/books/available",{headers:{'Authorization':`Bearer ${localStorage.getItem("accessToken")}`}},{
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
    const rentBook= async(e)=>{
        e.preventDefault();
        let user=JSON.parse(localStorage.getItem("user"));
        let userId=user.id;
        const controller=new AbortController();
        console.log(`${bookId}`);
        try{
            const response=await axios.post(BORROW_URL+`?userId=${userId}&bookId=${bookId}&period=${period}`,{},{headers:{'Authorization':`Bearer ${localStorage.getItem("accessToken")}`}},{
                signal:controller.signal
            });
            console.log(JSON.stringify(response?.data));
            setSuccess(true);
        }catch(err){
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg(err.response.data);
            }
            setSuccess(false);
            
        }
    }

    

    function renderTable(){
        return books.map(book=>{
            var focused=book.bookId===bookId;
            return(
                <tr key={book.bookId} id='tr' className={focused?"trfocus":"App-tr"} onClick={()=>setBookId(book.bookId)}>
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
            {books?.length && success
                ?(  <section>
                    <table id='table'>
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
                    <div id="periodShow" className="periodShow">
                        Rent book with ID {bookId} for: 
                        <button className="period-action" onClick={()=>setPeriod(7)}>7 days</button>
                        <button className="period-action" onClick={()=>setPeriod(14)}>14 days</button>
                        <button className="period-action" onClick={()=>setPeriod(21)}>21 days</button>
                        <button className="period-action" onClick={()=>setPeriod(30)}>30 days</button>
                    </div>
                    <form onSubmit={rentBook}>
                    <button className="book-action">Rent</button>
                    </form>
                </section>
                ):<p className="p-err">
                    {errMsg}
                    <br/>
                    <a href="/availableBooks"><button className="App-button">Try again</button></a>
                    </p>
            }
        </article>
    );
}
export default AvailableBooks;