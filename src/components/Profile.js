import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faAddressCard } from "@fortawesome/free-solid-svg-icons";
import React from "react";

const Profile= ()=>{
    const user=JSON.parse(localStorage.getItem("user"));
    const handleLogout=async(e)=>{
        localStorage.clear();
        localStorage.setItem("isLoggedIn",false);
    }

    const handleRedirect=(path)=>{
        window.location.href=path;
    }
    return(
        <section className="App-section">
            <div className="App-profile">
            <div className="profile-left"><FontAwesomeIcon icon={faUserCircle}/>{user.username}
            <br/>
            <p>
                <FontAwesomeIcon icon={faAddressCard}/> {user.email}<br/>
                {user.name}<br/>
                {user.surname}
                <a href="/login"><button className="button-logout" onClick={handleLogout}>Logout</button></a>
            </p>
            </div>
            <div className="profile-right">
               <button onClick={()=>handleRedirect('/myBooks')}>My Books</button>
               <button onClick={()=>handleRedirect('/addBook')}>Add Book</button>
               <button onClick={()=>handleRedirect('/deleteBook')}>Delete book</button>
               <button onClick={()=>handleRedirect('/borrowed')}>Borrowed Books</button>
            </div>
            </div>
            <div className="App-profileDetails">
            </div>

        </section>
    );

}

export default Profile;