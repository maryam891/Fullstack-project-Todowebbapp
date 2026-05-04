import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"
import "../css/profile.css"
import { useContext } from "react";
import { AuthStatusContext } from "../AuthContext";
import { CiUser } from "react-icons/ci";
import { Modal } from "react-bootstrap";
export interface Profile {
    Name: string,
    user_img: string
}

export default function Profile() {
    //Use values from useContext
    const Auth = useContext(AuthStatusContext)
    const [userInfo, setUserInfo] = useState<Profile | null>(null)
    const [confirmAccDelete, setConfirmAccDel] = useState(false)
    const [delAcc, setDelAcc] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        //Check if user is loggedin and that the user exists before sending request
        if (Auth?.isLoggedIn && Auth?.currentUser) {
            fetch('http://localhost:3000/Profile', {
                method: 'POST',
                body: JSON.stringify({ id: Auth?.currentUser?.userId }),
                headers: {
                    'Content-type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setUserInfo(data);
                })
                .catch((err) => {
                    alert("User does not exist")
                    console.log(err.message);
                });
        }

    }, [Auth?.currentUser?.userId, Auth?.isLoggedIn, Auth?.currentUser])
    //Render everytime a new user loggs in and userId changes

    //Remove account
    function handleDelAccount() {
        fetch(`${import.meta.env.VITE_API_URL}http://localhost:3000/removeAccount`, {
            method: 'DELETE',
            body: JSON.stringify({ id: Auth?.currentUser?.userId }),
            headers: {
                'Content-type': 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    setDelAcc(true)
                }
                else {
                    console.log('error');
                }

            })
            .catch((err) => {
                console.log(err.message, 'error');
            });
    }

    useEffect(() => {
        if (!confirmAccDelete) return;
        const timer = setTimeout(() => {
            Auth?.logout()
            navigate('/Login')
        }, 1400);
        return () => clearTimeout(timer)

    }, [confirmAccDelete, Auth, navigate]);
    return (
        <>
            <Modal show={delAcc === true}>
                <Modal.Header><Modal.Title style={{ color: "#081051" }}>Delete Account!</Modal.Title></Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete account?</p>
                </Modal.Body>
                <Modal.Footer className="delBtnContainer">
                    <button onClick={() => { setConfirmAccDel(true); setDelAcc(false) }} className="yesDelBtn"   >Yes</button>
                    <button onClick={() => setDelAcc(false)} className="noDelBtn">No</button></Modal.Footer>
            </Modal>
            <Modal show={confirmAccDelete === true}>
                <Modal.Header>
                    <Modal.Title style={{ color: "#081051" }}>Account deleted!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Account has been deleted</Modal.Body>
            </Modal>
            {/*Check to see if email value isn't null, user exists and that the user is logged in to display user profile*/}
            {
                Auth?.isLoggedIn === true && Auth.currentUser && Auth.currentUser?.email !== null && userInfo &&
                <main className="Profile">
                    <h1>Profile</h1>
                    <div className="profileContainer">
                        <div className="profileHeader">
                            {userInfo?.user_img ? <img src={userInfo.user_img}></img> : <CiUser className="profileIconImage" />}
                            <h2>{userInfo?.Name}</h2>
                        </div>

                        <form>
                            <label>Email</label>
                            <input type="text" name="email" defaultValue={Auth.currentUser.email} readOnly ></input>
                        </form>
                        <div className="btnContainer">
                            <button className="logOutBtn" type="submit" onClick={() => {
                                localStorage.clear()
                                Auth?.logout()
                                navigate('/Login')
                            }}>Log out</button>
                            <button className="deleteBtn" onClick={() => handleDelAccount()}>Delete account</button>
                        </div>
                    </div>

                </main>
            }
        </>
    )
}
