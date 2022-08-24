import {React,useRef, useState} from 'react';
import axios from '../api/axios';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch} from "@fortawesome/free-solid-svg-icons";
import '../css/App.css'
import '../css/buttons.css'
import '../css/profile.css'
import '../css/forms.css'
import Home from './Home';
import Profile from './Profile';
import Users from './Users';
import Login from './Login';
import Register from './Register';
import Books from './Books';
import Book from './Book';
import AddBook from './AddBook';
import AvailableBooks from './AvailableBooks';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyBooks from './MyBooks';
import BorrowedBooks from './BorrowedBooks';
import DeleteBook from './DeleteBook';
import Search from './Search';


const App = ()=>{
  const [bookId,setBookId]=useState(0);
  const [books,setBooks]=useState();
  const [errMsg,setErrMsg]=useState('');
  const [success,setSuccess]=useState(false);
  const [inputText,setInputText]=useState();
  const [show, setShow]=useState(false);
  const ref=useRef(null);
  const inputHandler = (e) => {
    var lowerCase = e.target.value;
    if(lowerCase.length>2 || lowerCase.length===0)setInputText(lowerCase);
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
  const onKeyUp=(event)=> {
    if (event.key ==="Enter") {
      window.location.href="/search";
    }else {
      search();
    }
}

  if(localStorage.getItem("isLoggedIn")==="true"){
  return(
    <Router>
    <div className="App">
      <div className='App-header'>TMD Book Rental Application </div>
          <div className='App-topnav'>
          <div className="dropdown">
          <button  className='button-topnav' onClick={()=>setShow(!show)}><FontAwesomeIcon icon={faSearch} aria-hidden="true" className='searchIcon'/>
          </button>
          {show? 
          (
                <div className='dropdown'>
                <input ref={ref} type='text' placeholder="Search..." className="search" onClick={handleClick} onChange={inputHandler} onKeyUp={onKeyUp} ></input>
                <div>
                {success?(
                  <div className='dropdown-content'>
                        {books.slice(0,3).map(book=>(                            
                            <button className='searchbutton' onClick={()=>setBookId(book[0])}>{book[2]}, {book[3]}</button>
                            )
                                  )
                        }
                  </div>
                )
               :(<div className='dropdown-content'><a className='errMsg' href='/'>{errMsg}</a></div>)
               }
                </div>
                {bookId!==0?(
                <Book id={bookId}/>
                ):(
                  <></>
                )
          } 
            </div>):
            (<></>)
          }</div>
          <a href="/"><button  className='button-topnav' >Home</button></a>
          <a href='/profile'><button className='button-topnav'>Profile</button></a>
          <a href='/users'><button className='button-topnav'>Users</button></a>
          <a href='/books'><button className='button-topnav'>Books</button></a>
          <a href='/availableBooks'><button className='button-topnav'>Available Books</button></a>
        </div>
    </div>
      <Routes>
      <Route exact path="/" element={<Home />}> </Route>
      <Route exact path='/profile' element={<Profile/>}></Route>
      <Route exact path="/login" element={<Login/>}></Route>
      <Route exact path='/users' element={<Users/>}></Route>
      <Route exact path='/books/*' element={<Books/>}></Route>
      <Route exact path='/availableBooks' element={<AvailableBooks/>}></Route>
      <Route exact path='/addBook' element={<AddBook/>}></Route>
      <Route exact path='/mybooks' element={<MyBooks/>}></Route>
      <Route exact path='/deleteBook' element={<DeleteBook/>}></Route>
      <Route exact path='/borrowed' element={<BorrowedBooks/>}></Route>
      <Route exact path='/search' element={<Search/>}></Route>
      </Routes>
    </Router>
    );
    }else{
      return(
        <Router>
        <div className="App">
          <div className='App-header'>TMD Book Rental Application </div>
            <div className='App-topnav'>
              <a href="/"><button  className='button-topnav'>Home</button></a>
              <a href="/signup"><button className='button-login'>Signup</button></a>
              <a href="/login"><button className='button-login'>Login</button></a>
            </div> 
        </div>
          <Routes>
            <Route exact path="/" element={<Home />}> </Route>
            <Route exact path="/login" element={<Login/>}></Route>
            <Route exact path="/signup" element={<Register/>}></Route>
          </Routes>
        </Router>
        );
  }
}
export default App;


