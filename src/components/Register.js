import { useRef, useState, useEffect } from "react";
import { faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX=/^(.+)@(.+)\.(.+)$/;
const REGISTER_URL = '/auth/signup';

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [name, setName]=useState('');
    const [nameFocus, setNameFocus] = useState(false);
    
    const [surname,setSurname]=useState('');
    const [surnameFocus, setSurnameFocus] = useState(false);

    const [email, setEmail]=useState('');
    const [validEmail, setValidEmail]=useState(false);
    const [emailFocus,setEmailFocus]=useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidName(USER_REGEX.test(user));
    }, [user])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
        setValidMatch(matchPwd!=='');
    }, [pwd, matchPwd])

    useEffect(()=>{
        setValidEmail(EMAIL_REGEX.test(email));
    },[email])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        const v3 = EMAIL_REGEX.test(email);
        if (!v1 || !v2 ||!v3) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ username: user , email:email, name:name, surname:surname, password:pwd})
            );
            console.log(JSON.stringify(response?.data));
            setSuccess(true);
            setUser('');
            setEmail('');
            setName('');
            setSurname('');
            setPwd('');
            setMatchPwd('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg(err.response.data);
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section className="App-section">
                    <h1>Success!</h1>
                    <h3>
                        <a href="/login">Sign In</a>
                    </h3>
                </section>
            ) : (
                <section className="App-section">
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit} className="form-login">
                        <label htmlFor="username">
                            Username:
                        </label>
                        <br/>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setUserFocus(true)}
                            onBlur={() => setUserFocus(false)}
                        />
                        <br/>
                        <p id="uidnote" className={userFocus || !validName ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            4 to 24 characters.<br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed.
                        </p>
                        
                        <label htmlFor="name">
                            Name:
                        </label>
                        <br/>
                        <input
                            type="text"
                            id="name"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            onFocus={() => setNameFocus(true)}
                            onBlur={() => setNameFocus(false)}
                        />
                        <br/>
                        <p id="namenote" className={ nameFocus ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Not required.<br />
                        </p>
                        <label htmlFor="surname">
                            Surname:
                        </label>
                        <br/>
                        <input
                            type="text"
                            id="surname"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setSurname(e.target.value)}
                            value={surname}
                            onFocus={() => setSurnameFocus(true)}
                            onBlur={() => setSurnameFocus(false)}
                        />
                        <br/>
                        <p id="surnamenote" className={surnameFocus ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Not required.<br />
                        </p>
                        <label htmlFor="email">
                            Email:
                        </label>
                        <br/>
                        <input
                            type="text"
                            id="email"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        />
                        <br/>
                        <p id="emailnote" className={emailFocus || !validEmail ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must be valid email.<br />
                        </p>
                        <label htmlFor="password">
                            Password:
                        </label>
                        <br/>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <br/>
                        <p id="pwdnote" className={pwdFocus || !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>
                        

                        <label htmlFor="confirm_pwd">
                            Confirm Password:
                        </label>
                        <br/>
                        <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <br/>
                        <p id="confirmnote" className={matchFocus || !validMatch ? "instructions" : "offscreen"} >
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p>
                        
                        <button disabled={!validName || !validPwd ||!validEmail || !validMatch ? true : false}>Sign Up</button>
                    </form>
                    <p className="p-login">
                        Already registered?<br />
                        <span>
                            <a href="/login">Sign In</a>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Register