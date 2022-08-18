import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import axios from '../api/axios';

const LOGIN_URL = '/auth/signin';

const Login = ()=> {
    const {setAuth}  = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
  
    useEffect(() => {
      userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd])
    
  
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
        try{
            const response = await axios.post(LOGIN_URL,
            JSON.stringify({username: user,password: pwd })
            );
        
            console.log(JSON.stringify(response?.data));
            // console.log(JSON.stringify(response));
            const accessToken = response?.data.accessToken;
            const roles = response?.data?.roles;
            setAuth({ user, pwd, roles, accessToken });
            localStorage.setItem("accessToken",accessToken);
            localStorage.setItem("isLoggedIn",true);
            localStorage.setItem("user",JSON.stringify(response.data));
            console.log(localStorage.getItem("user"));
            setUser('');
            setPwd('');
            setSuccess(true);
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else{
                setErrMsg(err.response.data);
            }
            errRef.current.focus();
        }
    }
  return (
    <>
        {success ? (
            <section className='App-section'>
                <h1>You are logged in!</h1>
                <br />
                <p>
                    <a href="/">Go to Home</a>
                </p>
            </section>
        ) : (
            <section className='App-section'>
                <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                <h1>Sign In</h1>
                <form onSubmit={handleSubmit} className='form-login'>
                    <label htmlFor="username">Username:</label>
                    <br/>
                    <input
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={(e) => setUser(e.target.value)}
                        value={user}
                        required
                    />
                    <br/>
                    <label htmlFor="password">Password:</label>
                    <br/>
                    <input
                        type="password"
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                    />
                    <br/>
                    <button className='button-signin'>Sign In</button>
                </form>
                <br/>
                <p className='p-login'>
                    Need an Account?
                    <br />
                    <a href="/signup">Sign Up</a>
                </p>
            </section>
        )}
    </>
  )
}

export default Login