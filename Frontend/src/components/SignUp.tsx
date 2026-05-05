import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { AuthStatusContext } from "../AuthContext";
import { useContext } from "react";
import "../css/signUp.css"
import { CiUser } from "react-icons/ci";
import Modal from 'react-bootstrap/Modal';

export default function SignUp() {
    const [userSignedUpPopUp, setUserSignedUpPopUp] = useState(false)
    const Auth = useContext(AuthStatusContext)
    const [signUpForm, setSignUpForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: ""

    })

    const [fieldErrors, setFieldErrors] = useState({
        emailField: false,
        passwordField: false,
        confirmPasswordField: false,
        nameField: false,

    });
    const [tooShort, setTooShort] = useState({
        nameShort: false,
        emailShort: false,
        passwordShort: false,
        confirmPasswordShort: false
    })
    const [failedSignUpPopUpShow, setShowFailedSignUpPopUp] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const navigate = useNavigate();

    /*Change border color of input based on empty and non empty field*/
    const styles = {
        emailInput: {
            border: ((submitted && (signUpForm.email.trim().length === 0 && signUpForm.email.trim().length < 11))
                || (signUpForm.email.trim().length > 0 && signUpForm.email.trim().length < 11)) ? "2px solid rgb(134, 19, 48)" : "2px solid #081051"
        },
        passwordInput: {
            border: ((submitted && (signUpForm.password.trim().length === 0 || signUpForm.password.trim().length < 8))
                || (signUpForm.password.trim().length > 0 && signUpForm.password.trim().length < 8)) ? "2px solid rgb(134, 19, 48)" : "2px solid #081051"
        },

        confirmPasswordInput: {
            border: ((submitted && (signUpForm.confirmPassword.trim().length === 0 || signUpForm.confirmPassword.trim().length < 8 || signUpForm.password !== signUpForm.confirmPassword))
                || (signUpForm.confirmPassword.trim().length > 0 && (signUpForm.confirmPassword.trim().length < 8 || signUpForm.password !== signUpForm.confirmPassword))) ? "2px solid rgb(134, 19, 48)" : "2px solid #081051"
        },

        nameInput: {
            border: ((submitted && (signUpForm.name.trim().length === 0 || signUpForm.name.trim().length < 2))
                || (signUpForm.name.trim().length > 0 && signUpForm.name.trim().length < 2)) ? "2px solid rgb(134, 19, 48)" : "2px solid #081051"
        }
    };


    /*Sign up function*/
    function signup(event: React.MouseEvent) {
        event.preventDefault()
        setSubmitted(true)
        // Validate all fields first
        const nameEmpty = signUpForm.name.trim().length === 0
        const emailEmpty = signUpForm.email.trim().length === 0
        const passwordEmpty = signUpForm.password.trim().length === 0
        const confirmPasswordEmpty = signUpForm.confirmPassword.trim().length === 0

        const nameTooShort = signUpForm.name.trim().length > 0 && signUpForm.name.trim().length <= 2
        const emailTooShort = signUpForm.email.trim().length > 0 && signUpForm.email.trim().length < 11
        const passwordTooShort = signUpForm.password.trim().length > 0 && signUpForm.password.trim().length < 8
        const passwordMismatch = signUpForm.password !== signUpForm.confirmPassword

        // Update fieldErrors
        setFieldErrors({
            nameField: !nameEmpty,
            emailField: !emailEmpty,
            passwordField: !passwordEmpty,
            confirmPasswordField: !confirmPasswordEmpty
        })

        // Update tooShort
        setTooShort({
            nameShort: nameTooShort,
            emailShort: emailTooShort,
            passwordShort: passwordTooShort,
            confirmPasswordShort: signUpForm.confirmPassword.trim().length > 0 && signUpForm.confirmPassword.trim().length < 8 || passwordMismatch
        })

        // Stop if something is wrong
        if (nameEmpty || emailEmpty || passwordEmpty || confirmPasswordEmpty || nameTooShort || emailTooShort || passwordTooShort || passwordMismatch) {
            setShowFailedSignUpPopUp(true)
            return
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Email: signUpForm.email, Password: signUpForm.password, Name: signUpForm.name })
        }
        /*Check if the input field is not empty to send input data to backend*/
        if (signUpForm.email.trim().length !== 0 && signUpForm.password.trim().length !== 0 && signUpForm.name.trim().length !== 0) {
            fetch(`${import.meta.env.VITE_API_URL}/SignUp`, requestOptions)
                .then((res) => {
                    //If filled in fields have to short length or there are errors triggered error popup for failed sign up

                    if (res.status === 200) {
                        return res.json()
                    }
                    else {
                        setShowFailedSignUpPopUp(true)

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
                        setSubmitted(false)
                        setUserSignedUpPopUp(true)
                        setFieldErrors({ emailField: false, passwordField: false, confirmPasswordField: false, nameField: false })
                        setTooShort({
                            nameShort: false,
                            emailShort: false,
                            passwordShort: false,
                            confirmPasswordShort: false
                        })


                    }
                    else {
                        setShowFailedSignUpPopUp(true)
                        setFieldErrors({ emailField: true, passwordField: true, confirmPasswordField: true, nameField: true })

                    }

                })
                .catch(() => {

                    setShowFailedSignUpPopUp(true)
                });

        }
        if (signUpForm.email.trim().length !== 0 && signUpForm.password.trim().length === 0) {
            setFieldErrors({ emailField: false, passwordField: true, confirmPasswordField: true, nameField: true })

        }
        else if (signUpForm.password.trim().length !== 0 && signUpForm.email.trim().length === 0) {
            setFieldErrors({ emailField: true, passwordField: false, confirmPasswordField: false, nameField: false })
        }

        else {
            setFieldErrors({ emailField: false, passwordField: false, confirmPasswordField: false, nameField: false })
        }

    }
    //Show welcome modal for a few seconds and navigate to profile page when user is signed up
    useEffect(() => {
        if (!userSignedUpPopUp) return;
        const timer = setTimeout(() => {
            setUserSignedUpPopUp(false); navigate("/Profile")
        }, 1400);
        //Return clearTimeout if timer unmounts
        return () => clearTimeout(timer)
    }, [userSignedUpPopUp, navigate])
    return (
        <>
            <main className="Signup">
                <Modal show={failedSignUpPopUpShow === true} onHide={() => setShowFailedSignUpPopUp(false)} dialogClassName="errorPopUp">
                    <Modal.Header>
                        <Modal.Title style={{ color: "#081051" }}>Could not create account!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Sorry your account could not be created please try again!</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="failedSignUpBtn" onClick={() => setShowFailedSignUpPopUp(false)}>Ok</button>
                    </Modal.Footer>

                </Modal>
                <Modal show={userSignedUpPopUp === true}>
                    <Modal.Header>
                        <Modal.Title style={{ color: "#081051" }}>Welcome!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Welcome {signUpForm.name}!
                    </Modal.Body>
                </Modal>
                <section id="signUpSection">
                    <h1>Sign Up</h1>
                    <form>
                        <div className="imageSection">
                            <CiUser className="profileIconImage" />
                        </div>

                        <label>Name</label>
                        {/*Show error message if filed is empty when signing up*/}
                        {submitted && signUpForm?.name.trim().length === 0 && <p style={{ color: "rgb(134, 19, 48)", fontSize: "13px", margin: 0 }}>Please fill in name</p>}
                        {/*Show error message if length of name is less than 2 when signing up*/}
                        {signUpForm?.name.trim().length < 2 && signUpForm?.name.trim().length > 0 && <p style={{ color: "rgb(134, 19, 48)", fontSize: "13px", margin: 0 }}> Name must be at least 2 characters</p>}
                        <input type="text" name="name" value={signUpForm.name} style={styles.nameInput} onChange={(event) => {

                            setSignUpForm({
                                ...signUpForm,
                                [event.target.name]: event.target.value
                            })

                            setFieldErrors({
                                ...fieldErrors, nameField: event.target.value.trim().length !== 0
                            })

                            setTooShort({
                                ...tooShort, nameShort: event.target.value.trim().length > 0 && event.target.value.trim().length < 2
                            })

                        }}></input>
                        <label>Email</label>
                        {/*Show error message if filed is empty when signing up*/}
                        {submitted && signUpForm?.email.trim().length === 0 && <p style={{ color: "rgb(134, 19, 48)", fontSize: "13px", margin: 0 }}>Please fill in email</p>}
                        {/*Show error message if length of email is less than 11 when signing up*/}
                        {signUpForm?.email.trim().length < 11 && signUpForm?.email.trim().length > 0 && <p style={{ color: "rgb(134, 19, 48)", fontSize: "13px", margin: 0 }}> Email must be at least 11 characters</p>}
                        <input type="text" name="email" value={signUpForm.email} style={styles.emailInput} onChange={(event) => {

                            setSignUpForm({
                                ...signUpForm,
                                [event.target.name]: event.target.value
                            })

                            setFieldErrors({
                                ...fieldErrors, emailField: event.target.value.trim().length !== 0
                            })

                            setTooShort(
                                {
                                    ...tooShort, emailShort: event.target.value.trim().length > 0 && event.target.value.trim().length < 11
                                })




                        }}></input>

                        <label>Password</label>
                        {/*Show error message if filed is empty when signing up*/}
                        {submitted && signUpForm?.password.trim().length === 0 && <p style={{ color: "rgb(134, 19, 48)", fontSize: "13px", margin: 0 }}>Please fill in password</p>}
                        {/*Show error message if length of password is less than 8 when signing up*/}
                        {signUpForm?.password.trim().length < 8 && signUpForm?.password.trim().length > 0 && <p style={{ color: "rgb(134, 19, 48)", fontSize: "13px", margin: 0 }}> Password must be at least 8 characters</p>}
                        <input type="password" name="password" style={styles.passwordInput}
                            value={signUpForm.password} onChange={(event) => {

                                setSignUpForm({
                                    ...signUpForm,
                                    [event.target.name]: event.target.value
                                })
                                setFieldErrors({
                                    ...fieldErrors, [event.target.name + "Field"]: event.target.value.trim().length !== 0
                                })

                                setTooShort({
                                    ...tooShort, passwordShort: event.target.value.trim().length > 0 && event.target.value.trim().length < 8
                                })


                            }}></input>
                        <label>Confirm password</label>
                        {/*Show error message if filed is empty when signing up*/}
                        {submitted && signUpForm?.confirmPassword.trim().length === 0 && <p style={{ color: "rgb(134, 19, 48)", fontSize: "13px", margin: 0 }}>Please fill in confirm password</p>}
                        {/*Show error message if length of confirm password is less than 8 and does not match password written in password field when signing up*/}
                        {signUpForm?.confirmPassword.trim().length < 8 && signUpForm?.confirmPassword.trim().length > 0 && signUpForm.password !== signUpForm.confirmPassword && <p className="confirmPassword-Error"> Password must be at least 8 characters and match password field</p>}
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
            </main >

        </>
    )
}
