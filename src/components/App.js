import React from 'react';
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import AddBook from './AddBook';
import AvailableBooks from './AvailableBooks';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyBooks from './MyBooks';
import BorrowedBooks from './BorrowedBooks';
import DeleteBook from './DeleteBook';


const App = ()=>{

  if(localStorage.getItem("isLoggedIn")==="true"){
  return(
    <Router>
    <div className="App">
      <div className='App-header'>TMD Book Rental Application </div>
        <div className='App-topnav'>
          <a href="/"><button  className='button-topnav'>Home</button></a>
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
      <Route exact path='/books' element={<Books/>}></Route>
      <Route exact path='/availableBooks' element={<AvailableBooks/>}></Route>
      <Route exact path='/addBook' element={<AddBook/>}></Route>
      <Route exact path='/mybooks' element={<MyBooks/>}></Route>
      <Route exact path='/deleteBook' element={<DeleteBook/>}></Route>
      <Route exact path='/borrowed' element={<BorrowedBooks/>}></Route>
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


