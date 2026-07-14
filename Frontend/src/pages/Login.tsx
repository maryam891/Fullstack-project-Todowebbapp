import "../css/Login.css"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { AuthStatusContext } from "../AuthContext";
import { useContext } from "react";
import { Modal } from "react-bootstrap"

export default function Login() {
    const User = useContext(AuthStatusContext)
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: ""
    })

    const [fieldErrors, setFieldErrors] = useState({
        emailField: false,
        passwordField: false
    });
    const navigate = useNavigate();
    const [showPopUp, setShowPopUp] = useState(false);
    const [showLoginErrPopUp, setShowLoginErrPopUp] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    //SetTimeout to wait to navigate to profile page when user is logged in to be able to show popup first
    useEffect(() => {
        if (User?.isLoggedIn) {
            setTimeout(() => navigate("/Profile"), 1400);
        }
    }, [User?.isLoggedIn, navigate]);


    {/*Change border color of input based on empty and non empty field*/ }
    const styles = {
        emailInput: {
            border: (submitted && fieldErrors.emailField) ? "2px solid rgb(134, 19, 48)" : "2px solid #081051"
        },
        passwordInput: {
            border: (submitted && fieldErrors.passwordField) ? "2px solid rgb(134, 19, 48)" : "2px solid #081051"
        }
    };

    {/*Login function for login button*/ }
    async function Login(event: React.MouseEvent) {
        event.preventDefault()
        setSubmitted(true)

        if (!loginForm.email || !loginForm.password) {
            setFieldErrors({ emailField: false, passwordField: false })
            setShowLoginErrPopUp(true)
            return
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/Login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginForm.email, password: loginForm.password })
            })
            if (!response.ok) {
                setShowLoginErrPopUp(true)
                return
            }


            const result = await response.json()
            console.log(result)


            //Check if useContext values exists and set values to localstorage values and loginForm values
            if (User !== null) {
                User.login({ email: result.email, userId: result.id, name: result.name })
                setFieldErrors({ emailField: false, passwordField: false })
                setSubmitted(false)
                setShowPopUp(true);


            }

        }
        catch (error) {
            setShowLoginErrPopUp(true);
            console.log(error, "could not login, invalid email or password")

        };

    }
    return (
        <>
            <main className="Login">
                <section id="loginSection">
                    <Modal show={showLoginErrPopUp} onHide={() => setShowLoginErrPopUp(false)} dialogClassName="loginPopUpErr">
                        <Modal.Header>
                            <Modal.Title style={{ color: "#081051" }}>Could not login!</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Password or email is wrong, please try again!</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <button onClick={() => setShowLoginErrPopUp(false)} className="loginErrBtn">Ok</button>
                        </Modal.Footer>
                    </Modal>
                    <Modal show={showPopUp} onHide={() => setShowPopUp(false)} dialogClassName="welcomePopup">
                        <Modal.Header>
                            <Modal.Title>Welcome back {User?.currentUser?.name}!</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Modal.Title>
                                Check out your todos for today!
                            </Modal.Title>
                        </Modal.Body>
                    </Modal>
                    <h1>Login</h1>
                    <form>
                        <label htmlFor="email" >Email</label>
                        {/*Show error message if filed is empty when signing up*/}
                        {submitted && loginForm?.email.trim().length === 0 && <p style={{ color: "rgb(134, 19, 48)", fontSize: "13px", margin: 0 }}>Please fill in email</p>}
                        <input id="email" type="text" name="email" value={loginForm.email} style={styles.emailInput} onChange={(event) => {

                            setLoginForm({
                                ...loginForm,
                                email: event.target.value
                            })

                            setFieldErrors({
                                ...fieldErrors, emailField: event.target.value.trim().length === 0
                            })



                        }}></input>
                        <label htmlFor="password">Password</label>
                        {/*Show error message if filed is empty when signing up*/}
                        {submitted && loginForm?.password.trim().length === 0 && <p style={{ color: "rgb(134, 19, 48)", fontSize: "13px", margin: 0 }}>Please fill in password</p>}
                        <input id="password" type="password" name="password" style={styles.passwordInput} value={loginForm.password} onChange={(event) => {

                            setLoginForm({
                                ...loginForm,
                                password: event.target.value
                            })
                            setFieldErrors({
                                ...fieldErrors, passwordField: event.target.value.trim().length === 0
                            })


                        }}></input>
                        <button type="submit" onClick={Login}>Login</button>
                        <div className="loginTextContainer">
                            <p>Don't have an account?</p>
                            <p className="signUpText" onClick={() => {
                                navigate("/signUp")
                            }}>Sign up</p>
                        </div>
                    </form>
                </section>
            </main>

        </>
    )
}
