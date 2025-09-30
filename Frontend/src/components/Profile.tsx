import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react"
import "../css/profile.css"
import { useContext } from "react";
import { AuthStatusContext } from "../AuthContext";
import { CiUser } from "react-icons/ci";
export interface Profile {
    Name: string,
    user_img: string
}

export default function Profile() {
    //Use values from useContext
    const Auth = useContext(AuthStatusContext)
    const [userInfo, setUserInfo] = useState<Profile | null>(null)
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

    }, [Auth?.currentUser?.userId, Auth?.isLoggedIn])
    //Render everytime a new user loggs in and userId changes

    return (
        <>
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
                            <input type="text" name="email" defaultValue={Auth.currentUser.email} ></input>
                        </form>
                        <div className="btnContainer">
                            <button className="logOutBtn" type="submit" onClick={() => {
                                localStorage.clear()
                                Auth?.logout()
                                navigate('/Login')
                            }}>Log out</button>
                        </div>
                    </div>

                </main>
            }
        </>
    )
}
