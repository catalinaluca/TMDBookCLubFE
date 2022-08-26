import axios from "../api/axios";
import {useState,useEffect} from 'react'
import Book from "./Book";

const Wishlist = ()=>{
    const [wishes, setWishes]=useState();
    const [errMsg, setErrMsg]=useState('');
    const [wishListMsg,setWishListMsg]=useState();
    
    useEffect( () => {
        let isMounted=true;
        setErrMsg('');
        let user=JSON.parse(localStorage.getItem("user"));
        let userId=user.id;
        const controller=new AbortController();
        const getBooks = async ()=>{

            try{
                const response = await axios.get(`/books/wishlist/user/?userId=${userId}`,{headers:{'Authorization':`Bearer ${localStorage.getItem("accessToken")}`}},{
                    signal:controller.signal
                },)
                console.log(response.data);
                isMounted && setWishes(response.data);                
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

    const removeFromWishlist=async (bookId)=>{
        let isMounted=true;
        const controller=new AbortController();
        let user=JSON.parse(localStorage.getItem("user"));
        let userId=user.id;
        try{
            const response = await axios.delete(`/books/wishlist/delete/wish?userId=${userId}&bookId=${bookId}`,{headers:{'Authorization':`Bearer ${localStorage.getItem("accessToken")}`}},{
                signal:controller.signal
            },)
            console.log(response.data);    
            isMounted && setWishListMsg(response.data);         
        }catch(err){
            setErrMsg(err.response.data);
        }
        window.location.reload(true);
    }

    const renderTable=()=>{
        return (wishes.map(wish=>{
            return (
                <tr key={wish.wish} className="App-tr">
                    <td>{<Book id={wish.bookId}/>}</td>
                    <td>
                        <button className="App-button" onClick={()=>removeFromWishlist(wish.bookId)}>Remove</button>
                    </td>
                </tr>
            )
            
        }
            ))
    }

    return(
        <section className="App-section">
            {wishes?.length?
                (
                    <table>
                        <thead>
                            <th>Book</th>
                        </thead>
                        <tbody>
                            {renderTable()}
                        </tbody>
                    </table>
                )
                :
                (<p className={errMsg?"errMsg":"offscreen"}>{errMsg}</p>)
            }
            {wishListMsg?
                (<p>{wishListMsg}</p>):
                (<p className={errMsg?"errMsg":"offscreen"}>{errMsg}</p>)
            }
        </section>
    )

}

export default Wishlist;