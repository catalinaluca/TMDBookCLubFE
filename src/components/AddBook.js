import { useEffect, useState, useRef } from "react";
import axios from "../api/axios";

const ADD_BOOK_URL="/books/owners/add";

const AddBook = ()=>{
    const userRef = useRef();
    const errRef = useRef();

    const [isbn, setIsbn]=useState('');
    const [validIsbn,setValidIsbn]=useState(false);

    const [title, setTitle]=useState('');
    const [validTitle,setValidTitle]=useState(false);

   
    const [author, setAuthor]=useState('');
    const [validAuthor,setValidAuthor]=useState(false);

   

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    
    useEffect(() => {
          userRef.current.focus();
    }, [])

    useEffect(()=>{
        setValidIsbn(isbn!=='');
    },[isbn])

    useEffect(()=>{
        setValidTitle(title!=='');
    },[title])

    useEffect(()=>{
        setValidAuthor(author!=='');
    },[author])

    const handleSubmit= async (e)=>{
        e.preventDefault();
        let user=JSON.parse(localStorage.getItem("user"));
        let id=user.id;
        try{
            const response=await axios.post(ADD_BOOK_URL+`?id=${id}`,JSON.stringify({isbn:isbn,title:title,author:author}),{headers:{'Authorization':`Bearer ${localStorage.getItem("accessToken")}`}});
            console.log(JSON.stringify(response?.data));
            setSuccess(true);
            setIsbn('');
            setTitle('');
            setAuthor('');
        }catch(err){
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg(err.response.data);
            }
            errRef.current.focus();
        }
    }

    return(
        <>           
                {success?(
                    <section className="App-section">
                    <h1>Success!</h1>
                    <h3>
                        <a href="/addBook">More?</a>
                    </h3>
                    </section>
                ):(
                    <section className="App-section">
                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                        <h1>Add Book</h1>
                        <form onSubmit={handleSubmit} className="form-add">
                            <label htmlFor="isbn">
                                ISBN:
                            </label>
                            <br/>
                            <input
                                type="text"
                                id="isbn"
                                ref={userRef}
                                autoComplete="off"
                                onChange={(e) => setIsbn(e.target.value)}
                                value={isbn}
                                required
                                aria-invalid={validIsbn ? "false" : "true"}
                            />
                            <br/>
                            <label htmlFor="title">
                                Title:
                            </label>
                            <br/>
                            <input
                                type="text"
                                id="title"
                                ref={userRef}
                                autoComplete="off"
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                                required
                                aria-invalid={validTitle ? "false" : "true"}
                            />
                            <br/>
                            <label htmlFor="author">
                                Author:
                            </label>
                            <br/>
                            <input
                                type="text"
                                id="author"
                                ref={userRef}
                                autoComplete="off"
                                onChange={(e) => setAuthor(e.target.value)}
                                value={author}
                                required
                                aria-invalid={validAuthor ? "false" : "true"}
                            />
                            <br/>
                            <button disabled={!validAuthor || !validTitle ||!validIsbn? true : false} className="button-signin">Add</button>
                        </form>
                    </section>
                )

                }
        </>
    );

}

export default AddBook;