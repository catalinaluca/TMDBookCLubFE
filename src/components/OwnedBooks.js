import { useState, useEffect} from 'react';
import axios from '../api/axios';
import UserDetails from './UserDetails';

const MyBooks=()=>{
    const [books,setBooks]=useState();
    const [bookId,setBookId]=useState();

    const [isbn,setIsbn]=useState();    
    const [validIsbn,setValidIsbn]=useState(false);

    const [title,setTitle]=useState();
    const [validTitle,setValidTitle]=useState(false);

    const [author,setAuthor]=useState();
    const [validAuthor,setValidAuthor]=useState(false);

    const [errMsg, setErrMsg]=useState('');

    useEffect( () => {
        let isMounted=true;
        setErrMsg('');
        const controller=new AbortController();
        let user=JSON.parse(localStorage.getItem("user"));
        let id=user.id;
        const getBooks = async ()=>{

            try{
                const response = await axios.get(`/books/borrowed/owned?ownerId=${id}`,{headers:{'Authorization':`Bearer ${localStorage.getItem("accessToken")}`}},{
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

    useEffect(()=>{
        setValidIsbn(isbn!=='');
    },[isbn])

    useEffect(()=>{
        setValidTitle(title!=='');
    },[title])

    useEffect(()=>{
        setValidAuthor(author!=='');
    },[author])
    
    function available(av){
        if(av!==null){
            return <>
            Available at: {av.endDate.substring(0,10)}
            <br/>
            Rented by: <UserDetails id={av.userId}/>
            </>
        }else{
            return <>Available</>
        }
    }

    const handleEdit=(isbn,title,author,av)=>{
        if(av===null){
            setIsbn(isbn);
            setTitle(title);
            setAuthor(author);
        }else{
            setErrMsg("You can not edit a book while rented!");
        }
    }

    const renderTable=()=>{
        return books.map(book=>{
            var focused=bookId===(book[0].bookId) && book[1]===null;
            let av=book[1];
            return(
                <tr key={book[0].bookId}  className="App-tr">
                <td>{focused?(<input type="text" 
                                className='editBook' 
                                id="isbn"
                                onChange={(e) => setIsbn(e.target.value)}
                                value={isbn}
                                required
                                aria-invalid={validIsbn ? "false" : "true"}
                                />):(book[0].isbn)}</td>
                <td>{focused?(<input 
                                type="text" 
                                className='editBook' 
                                id="title"
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                                required
                                aria-invalid={validTitle ? "false" : "true"}/>):(book[0].title)}</td>
                <td>{focused?(<input 
                                type="text" 
                                className='editBook'
                                id="author"
                                onChange={(e) => setAuthor(e.target.value)}
                                value={author}
                                required
                                aria-invalid={validAuthor ? "false" : "true"}
                                />):(book[0].author)}</td>
                <td>{available(av)}</td>
                <td><button className='App-button' onClick={()=>{handleEdit(book[0].isbn,book[0].title,book[0].author,av);setBookId(book[0].bookId);}}>Edit</button></td>
                </tr>
            )
            }
        )
    }
    const tryAgain=()=>{
        window.location.reload(true);
    }
    const editBook=async(e)=>{
        let isMounted=true;
        setErrMsg('');
        const controller=new AbortController();
        try{
            const response = await axios.post(`/books/edit`,JSON.stringify({bookId:bookId,isbn:isbn,title:title,author:author}),{headers:{'Authorization':`Bearer ${localStorage.getItem("accessToken")}`}},{
                signal:controller.signal
            },)
            console.log(response?.data);
            isMounted && setBooks(response.data);
            setIsbn('');
            setTitle('');
            setAuthor('');                
        }catch(err){
            setErrMsg(err.response.data);
            console.log(err.response.data);
        }
    }

    return (
        <section className='App-section'>
            {books?.length && errMsg?.length===0
                ?(
                    <>
                    <table>
                        <thead>
                            <tr>
                            <th>ISBN</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Availabilty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderTable()}
                        </tbody>
                    </table>
                    <form onSubmit={editBook}>
                    <button disabled={!validAuthor || !validTitle ||!validIsbn? true : false} className="book-action">Submit</button>
                    </form>
                    </>
                ):<p className='p-err'>{errMsg}
                <br/>
                <button className="App-button" onClick={tryAgain}>Try again</button>
                </p>
            }
        </section>
    );
}
export default MyBooks;