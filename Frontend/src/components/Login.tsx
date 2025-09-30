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
        emailField: true,
        passwordField: true
    });
    const navigate = useNavigate();
    const [showPopUp, setShowPopUp] = useState(false);


    const handleShowPopUp = () => {
        setShowPopUp(true);

    }
    //SetTimeout to wait to navigate to profile page when user is logged in to be able to show popup first
    useEffect(() => {
        if (User?.isLoggedIn) {
            setTimeout(() => navigate("/Profile"), 1400);
        }
    }, [User?.isLoggedIn]);


    {/*Change border color of input based on empty and non empty field*/ }
    const styles = {
        emailInput: {
            border: fieldErrors.emailField ? "2px solid #081051" : "2px solid rgb(134, 19, 48)"
        },
        passwordInput: {
            border: fieldErrors.passwordField ? "2px solid #081051" : "2px solid rgb(134, 19, 48)"
        }
    };

    {/*Login function for login button*/ }
    function Login(event: React.MouseEvent) {
        event.preventDefault()

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Email: loginForm.email, Password: loginForm.password })
        }
        {/*Check if the input field is not empty to send input data to backend*/ }
        if (loginForm.email.trim().length !== 0 && loginForm.password.trim().length !== 0) {
            fetch("http://localhost:3000/Login", requestOptions)
                .then((res) => {
                    if (res.status === 200) {
                        return res.json()
                    }
                    else if (res.status === 400) {
                        throw new Error("Invalid login");

                    }
                })

                .then((result) => {

                    {/*Compare if the input has the same values as in the backend*/ }
                    if (loginForm.email && loginForm.email === result[0].Email && loginForm.password && loginForm.password === result[0].Password) {
                        {/*Save user id of the user that logs in to retrive in profile page*/ }

                        //Check if useContext values exists and set values to localstorage values and loginForm values

                        if (User) {
                            User.login({ email: loginForm.email, password: loginForm.password, userId: result[0].id })
                            setFieldErrors({ emailField: true, passwordField: true })
                            handleShowPopUp()


                        }

                    }
                    else {
                        alert("wrong password or email")
                        User?.logout()
                        setFieldErrors({ emailField: false, passwordField: false })
                    }

                })
                .catch((error) => {
                    // Catch fetch errors or thrown ones
                    alert("Login failed: " + error.message);
                });

        }
        else if (loginForm.email.trim().length !== 0 && loginForm.password.trim().length === 0) {
            setFieldErrors({ emailField: true, passwordField: false })
        }
        else if (loginForm.password.trim().length !== 0 && loginForm.email.trim().length === 0) {
            setFieldErrors({ emailField: false, passwordField: true })
        }

        else {
            setFieldErrors({ emailField: false, passwordField: false })
        }

    }
    return (
        <>
            <main className="Login">
                <section id="loginSection">
                    {showPopUp &&
                        <Modal show={showPopUp} dialogClassName="welcomePopup">
                            <Modal.Header>
                                <Modal.Title>Welcome back!</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Modal.Title>
                                    Check out your todos for today!
                                </Modal.Title>
                            </Modal.Body>
                        </Modal>}
                    <h1>Login</h1>
                    <form>
                        <label>Email</label>
                        <input type="text" name="email" value={loginForm.email} style={styles.emailInput} onChange={(event) => {

                            setLoginForm({
                                ...loginForm,
                                [event.target.name]: event.target.value
                            })

                            setFieldErrors({
                                ...fieldErrors, [event.target.name + "Field"]: event.target.value.trim().length !== 0
                            })



                        }}></input>
                        <label>Password</label>
                        <input type="password" name="password" style={styles.passwordInput} value={loginForm.password} onChange={(event) => {

                            setLoginForm({
                                ...loginForm,
                                [event.target.name]: event.target.value
                            })
                            setFieldErrors({
                                ...fieldErrors, [event.target.name + "Field"]: event.target.value.trim().length !== 0
                            })


                        }}></input>
                        <button type="submit" onClick={Login}>Login</button>
                        <div className="signUpTextContainer">
                            <p>Don't have an account?</p>
                            <p className="signUpText" onClick={() => {
                                navigate("/SignUp")
                            }}>Sign up</p>
                        </div>
                    </form>
                </section>
            </main>

        </>
    )
}
