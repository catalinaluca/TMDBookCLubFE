import { useState, useEffect} from 'react';
import axios from '../api/axios';

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

    useEffect(()=>{
        setValidIsbn(isbn!=='');
    },[isbn])

    useEffect(()=>{
        setValidTitle(title!=='');
    },[title])

    useEffect(()=>{
        setValidAuthor(author!=='');
    },[author])

    const renderTable=()=>{
        return books.map(book=>{
            var focused=bookId===book.bookId;
            return(
                <tr key={book.bookId}  className="App-tr">
                <td>{book.bookId}</td>
                <td>{focused?(<input type="text" 
                                className='editBook' 
                                id="isbn"
                                onChange={(e) => setIsbn(e.target.value)}
                                value={isbn}
                                required
                                aria-invalid={validIsbn ? "false" : "true"}
                                />):(book.isbn)}</td>
                <td>{focused?(<input 
                                type="text" 
                                className='editBook' 
                                id="title"
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                                required
                                aria-invalid={validTitle ? "false" : "true"}/>):(book.title)}</td>
                <td>{focused?(<input 
                                type="text" 
                                className='editBook'
                                id="author"
                                onChange={(e) => setAuthor(e.target.value)}
                                value={author}
                                required
                                aria-invalid={validAuthor ? "false" : "true"}
                                />):(book.author)}</td>
                <td><button className='App-button' onClick={()=>{setBookId(book.bookId);setIsbn(book.isbn);setTitle(book.title);setAuthor(book.author);}}>Edit</button></td>
                </tr>
            )
            }
        )
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
        <article className='App-section'>
            {books?.length
                ?(
                    <section className='App-section'>
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
                    <form onSubmit={editBook}>
                    <button disabled={!validAuthor || !validTitle ||!validIsbn? true : false} className="book-action">Submit</button>
                    </form>
                    </section>
                ):<p className='p-err'>{errMsg}</p>
            }
        </article>
    );
}
export default MyBooks;