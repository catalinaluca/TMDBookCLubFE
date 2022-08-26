import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faAddressCard } from "@fortawesome/free-solid-svg-icons";
import React from "react";

const Profile= ()=>{
    const user=JSON.parse(localStorage.getItem("user"));
    const handleLogout=async(e)=>{
        localStorage.clear();
        localStorage.setItem("isLoggedIn",false);
        window.location.href='/login';
    }

    const handleRedirect=(path)=>{
        window.location.href=path;
    }
    return(
        <section className="App-section">
            <div className="App-profile">
            <div className="profile-left">
                <div><FontAwesomeIcon icon={faUserCircle}/>{user.username}</div>
            <div className="contact">
                <FontAwesomeIcon icon={faAddressCard}/> {user.email}
                <button className="button-logout" onClick={handleLogout}>Logout</button>
            </div>
            </div>
            <div className="profile-right">
               <button onClick={()=>handleRedirect('/myBooks')}>My Books</button>
               <button onClick={()=>handleRedirect('/addBook')}>Add Book</button>
               <button onClick={()=>handleRedirect('/deleteBook')}>Delete book</button>
               <button onClick={()=>handleRedirect('/borrowed')}>Borrowed Books</button>
               <button onClick={()=>handleRedirect('/wishlist')}>Wishlist</button>
            </div>
            </div>
            <div className="App-profileDetails">
            </div>

        </section>
    );

}

export default Profile;