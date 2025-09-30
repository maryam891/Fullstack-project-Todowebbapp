import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { AuthStatusContext } from "../AuthContext";
import { useContext } from "react";
import "../css/signUp.css"
import { CiUser } from "react-icons/ci";

export default function SignUp() {
    const Auth = useContext(AuthStatusContext)
    const [signUpForm, setSignUpForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: ""

    })


    const [fieldErrors, setFieldErrors] = useState({
        emailField: true,
        passwordField: true,
        confirmPasswordField: true,
        nameField: true
    });

    const navigate = useNavigate();

    /*Change border color of input based on empty and non empty field*/
    const styles = {
        emailInput: {
            border: fieldErrors.emailField ? "2px solid #081051" : "2px solid rgb(134, 19, 48)"
        },
        passwordInput: {
            border: fieldErrors.passwordField ? "2px solid #081051" : "2px solid rgb(134, 19, 48)"
        },

        confirmPasswordInput: {
            border: fieldErrors.passwordField ? "2px solid #081051" : "2px solid rgb(134, 19, 48)"
        },

        nameInput: {
            border: fieldErrors.nameField ? "2px solid #081051" : "2px solid rgb(134, 19, 48)"
        }
    };

    /*Sign up function for sign up button*/
    function signup(event: React.MouseEvent) {
        event.preventDefault()

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Email: signUpForm.email, Password: signUpForm.password, Name: signUpForm.name })
        }
        //Check if password does not match with confirm password
        if (signUpForm.password !== signUpForm.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        /*Check if the input field is not empty to send input data to backend*/
        if (signUpForm.email.trim().length !== 0 && signUpForm.password.trim().length !== 0 && signUpForm.name.trim().length !== 0) {
            fetch("http://localhost:3000/SignUp", requestOptions)
                .then((res) => {
                    if (res.status === 200) {
                        return res.json()
                    }
                    else {
                        throw new Error("Invalid signup");

                    }
                })

                .then((result) => {

                    /*Compare if the input has the same values as in the backend*/
                    if (signUpForm.email && signUpForm.email === result.Email && signUpForm.password && signUpForm.password === result.Password && signUpForm.name && signUpForm.name === result.Name) {

                        //Check if useContext values exists and set values to localstorage values and SignUpForm values to automatically login the user when the user signs up
                        if (Auth) {
                            Auth.signup({
                                userId: result.id,
                                email: signUpForm.email,
                                name: signUpForm.name,
                                password: signUpForm.password,
                            })
                        }

                        alert("Welcome!")
                        setFieldErrors({ emailField: true, passwordField: true, confirmPasswordField: true, nameField: true })
                        navigate("/Profile")
                    }
                    else {
                        alert("wrong password or email")
                        setFieldErrors({ emailField: false, passwordField: false, confirmPasswordField: false, nameField: false })
                    }

                })
                .catch((error) => {
                    // Catch fetch errors or thrown ones
                    alert("Sign up failed: " + error.message);
                });

        }
        if (signUpForm.email.trim().length !== 0 && signUpForm.password.trim().length === 0) {
            setFieldErrors({ emailField: true, passwordField: false, confirmPasswordField: false, nameField: false })
        }
        else if (signUpForm.password.trim().length !== 0 && signUpForm.email.trim().length === 0) {
            setFieldErrors({ emailField: false, passwordField: true, confirmPasswordField: true, nameField: true })
        }

        else {
            setFieldErrors({ emailField: false, passwordField: false, confirmPasswordField: false, nameField: false })
        }

    }

    return (
        <>
            <main className="Signup">
                <section id="signUpSection">
                    <h1>Sign Up</h1>
                    <form>
                        <div className="imageSection">
                            <CiUser className="profileIconImage" />
                        </div>

                        <label>Name</label>
                        <input type="text" name="name" value={signUpForm.name} style={styles.nameInput} onChange={(event) => {

                            setSignUpForm({
                                ...signUpForm,
                                [event.target.name]: event.target.value
                            })

                            setFieldErrors({
                                ...fieldErrors, [event.target.name + "Field"]: event.target.value.trim().length !== 0
                            })

                        }}></input>
                        <label>Email</label>
                        <input type="text" name="email" value={signUpForm.email} style={styles.emailInput} onChange={(event) => {

                            setSignUpForm({
                                ...signUpForm,
                                [event.target.name]: event.target.value
                            })

                            setFieldErrors({
                                ...fieldErrors, [event.target.name + "Field"]: event.target.value.trim().length !== 0
                            })



                        }}></input>
                        <label>Password</label>
                        <input type="password" name="password" style={styles.passwordInput} value={signUpForm.password} onChange={(event) => {

                            setSignUpForm({
                                ...signUpForm,
                                [event.target.name]: event.target.value
                            })
                            setFieldErrors({
                                ...fieldErrors, [event.target.name + "Field"]: event.target.value.trim().length !== 0
                            })


                        }}></input>
                        <label>Confirm password</label>
                        <input type="password" name="confirmPassword" style={styles.confirmPasswordInput} value={signUpForm.confirmPassword} onChange={(event) => {

                            setSignUpForm({
                                ...signUpForm,
                                [event.target.name]: event.target.value
                            })
                            setFieldErrors({
                                ...fieldErrors, [event.target.name + "Field"]: event.target.value.trim().length !== 0
                            })


                        }}></input>
                        <button type="submit" onClick={signup}>Sign up</button>
                        <div className="signUpTextContainer">
                            <p>Already have an account?</p>
                            <p className="signUpText" onClick={() => {
                                navigate("/Login")
                            }}>Login</p>
                        </div>
                    </form>
                </section>
            </main>

        </>
    )
}
