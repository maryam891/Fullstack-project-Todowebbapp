import "../css/Home.css"
import { useState, useEffect } from "react"
import { useContext } from "react";
import { AuthStatusContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import todoImage from "../assets/todoImage.svg"
import seeProgressicon from "../assets/progressIcon.svg"
import addSticker from "../assets/addSticker.svg"


export interface Home {
    Todos: string,
    image: string
}


export default function Home() {

    const todoIcon = todoImage
    const progressIcon = seeProgressicon
    const addStickerIcon = addSticker

    const navigate = useNavigate();
    //Use values from useContext
    const user = useContext(AuthStatusContext)
    const [logStatus, setLogStatus] = useState(false)
    const [userInfo, setUserInfo] = useState<Home[]>([])
    const [userName, setGetUserName] = useState(null)

    //Check if user is logged in before getting user name
    useEffect(() => {
        if (user?.isLoggedIn === true && user.currentUser) {
            fetch('http://localhost:3000/UserName', {
                method: 'POST',
                body: JSON.stringify({ id: user?.currentUser?.userId }),
                headers: {
                    'Content-type': 'application/json',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setGetUserName(data.Name);
                })
                .catch((err) => {
                    console.log(err.message, 'error');
                })
        }


    }, [user])


    useEffect(() => {
        setLogStatus(user?.isLoggedIn === true)
    }, [user?.isLoggedIn])

    useEffect(() => {
        fetch('http://localhost:3000/Home', {
            method: 'POST',
            body: JSON.stringify({ id: user?.currentUser?.userId }),
            headers: {
                'Content-type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setUserInfo(data);
            })
            .catch((err) => {
                console.log(err.message, 'error');
            });

    }, [user])

    return (
        <>
            {/*Check if the user is loged in to show logedin layout else show other layout*/}
            {logStatus === true ?
                <main className="HomeLogedIn">
                    <div className="homePagetextbtnContainer">
                        <div className="homeLoginHeaderSection">
                            <h1>
                                {/*Render name of user that is logged in*/}
                                Welcome {userName}!
                            </h1>
                            {userInfo !== null ? <h2>
                                Here are your todos
                            </h2> : <h2>You don't have any todos, start adding todos!</h2>}
                        </div>
                    </div>
                    <div className="hompageloginTodoContainer">
                        {/*Show todos of the user that is logged in*/}
                        {userInfo &&
                            userInfo.map((userTodos, index) => (
                                <div key={index}>
                                    <div className="homepageLoginTodoSection">
                                        <h3>
                                            {userTodos.Todos}
                                        </h3>
                                        <div className="homepageLoginImgContainer" >
                                            <img src={userTodos.image}></img>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </main >
                :
                <main className="HomeLogedOut">
                    <div className="textBtnContainer">
                        <div className="homeHeaderSection">
                            <h1>
                                Welcome to a planning game changer!
                            </h1>
                            <h2>
                                Manage your daily todos and see your progress!
                            </h2>
                        </div>
                        <div>
                            <button onClick={() => {
                                navigate("/SignUp")
                            }}>Get started</button>
                        </div>
                    </div>
                    <div className="homePageTodoContainerLogedOut">
                        <div className="homePageTodoSectionLogedOut">
                            <h3>
                                Add todos
                            </h3>
                            <img src={todoIcon} className="homePageTodoImg"></img>
                        </div>
                        <div className="homePageTodoSectionLogedOut">
                            <h3>
                                See your progress

                            </h3>
                            <img src={progressIcon} className="homePageTodoImg"></img>
                        </div>
                        <div className="homePageTodoSectionLogedOut">
                            <h3>
                                Add images to your todos
                            </h3>
                            <img src={addStickerIcon} className="homePageTodoImg"></img>
                        </div>
                    </div>
                </main >}
        </>
    )
}
