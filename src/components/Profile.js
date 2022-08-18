import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faAddressCard } from "@fortawesome/free-solid-svg-icons";
import React from "react";

const Profile= ()=>{
    const user=JSON.parse(localStorage.getItem("user"));
    const handleLogout=async(e)=>{
        localStorage.clear();
        localStorage.setItem("isLoggedIn",false);
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
               <a href="/myBooks"><button>My Books</button></a>
               <a href="/addBook"><button>Add Book</button></a>
               <a href="/deleteBook"> <button>Delete book</button></a>
               <a href="/borrowed"><button>Borrowed Books</button></a>
            </div>
            </div>
            <div className="App-profileDetails">
            </div>

        </section>
    );

}

export default Profile;