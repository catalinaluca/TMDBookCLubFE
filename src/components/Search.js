import axios from "../api/axios";
import { useRef,useState } from "react";
import Book from "./Book";

const Search=()=>{
    const [bookId,setBookId]=useState(0);
    const [books,setBooks]=useState();
    const [errMsg,setErrMsg]=useState('');
    const [success,setSuccess]=useState(false);
    const [inputText,setInputText]=useState();
    const ref=useRef(null);
    const inputHandler = (e) => {
        var lowerCase = e.target.value;
        setInputText(lowerCase);
    };

    const handleClick = () => {
        ref.current.focus();
    };

    const search=async()=>{
        let isMounted=true;
        setErrMsg('');
        const controller=new AbortController();
        console.log(inputText);
        try{
            const response = await axios.get(`/books/searchByTitleOrAuthor?word=${inputText}`,{headers:{'Authorization':`Bearer ${localStorage.getItem("accessToken")}`}},{
                signal:controller.signal
            },)
            setSuccess(true)
            console.log(response.data);
            isMounted && setBooks(response.data); 
        }catch(err){
            setErrMsg(err.response.data);
            setSuccess(false); 
        }
    }
    return(
            <section className='App-section'>
                <div className="searchDiv">
                <input ref={ref} type='text' placeholder="Search..." className="search" onClick={handleClick} onChange={inputHandler} onKeyUp={()=>search()}></input>
                <>
                {success?(
                  <div className='searchDiv'>
                        {books.map(book=>(                            
                            <button className='searchbutton' onClick={()=>setBookId(book[0])}>{book[2]}, {book[3]}</button>
                            )
                                  )
                        }
                  </div>
                )
               :(<div><a className={errMsg?'errMsg':"offscreen"} href='/search'>{errMsg}</a></div>)
               }
                </>
                {bookId!==0?(
                <Book id={bookId}/>
                ):(
                  <></>
                )
                }
                </div>
            </section>
    )
}

export default Search;