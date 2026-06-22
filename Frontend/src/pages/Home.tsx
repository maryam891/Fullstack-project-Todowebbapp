import "../css/Home.css"
import { useState, useEffect } from "react"
import { useContext } from "react";
import { AuthStatusContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import todoImage from "../assets/todoImage.svg"
import seeProgressicon from "../assets/progressIcon.svg"
import addSticker from "../assets/addSticker.svg"
import Spinner from 'react-bootstrap/Spinner';
import { Modal } from "react-bootstrap";


export interface Home {
    Todos: string,
    image: string,
    id: number
}


export default function Home() {

    const todoIcon = todoImage
    const progressIcon = seeProgressicon
    const addStickerIcon = addSticker

    const navigate = useNavigate();
    //Use values from useContext
    const user = useContext(AuthStatusContext)
    const [todos, setTodos] = useState<Home[]>([])
    const [getUserTodosErrPopUp, setGetUserTodosErrPopUp] = useState(false)

    useEffect(() => {
        const getCurrentUser = async () => {
            try {

                const response = await fetch(`${import.meta.env.VITE_API_URL}/todos/${user?.currentUser?.userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                })
                if (!response.ok) {
                    setGetUserTodosErrPopUp(true)
                    return
                }
                const result = await response.json()
                setTodos(result);
            }
            catch (error) {
                setGetUserTodosErrPopUp(true)
                console.log(error, 'Could not get user todos');
            }
        }
        getCurrentUser()

    }, [user?.currentUser?.userId, user])

    //Show loading spinner when refreshing page when loading === true
    if (user?.isLoading) {
        return <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    }
    return (
        <>
            <Modal show={getUserTodosErrPopUp === true} onHide={() => setGetUserTodosErrPopUp(false)}>
                <Modal.Header>
                    <Modal.Title style={{ color: "#081051" }}>Could not get user todos!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <button className="close-btn" onClick={() => setGetUserTodosErrPopUp(false)}>Ok</button>
                </Modal.Body>
            </Modal>
            {/*Check if the user is loged in to show logedin layout else show other layout*/}
            {user?.isLoggedIn === true ?
                <main className="HomeLoggedIn">
                    <div className="homePagetextbtnContainer">
                        <div className="homeLoginHeaderSection">
                            <h1>
                                {/*Render name of user that is logged in*/}
                                Welcome {user?.currentUser?.name}!
                            </h1>
                            {todos.length > 0 ? <h2>Here are your todos</h2> : <div style={{ height: "500px" }}><h2>You don't have any todos, start adding todos!</h2> <button className="homeTodosBtn" style={{ marginTop: "10px" }} onClick={() => navigate("/Todos")}>Todos</button></div>}

                        </div>
                    </div>
                    <div className="hompageloginTodoContainer">
                        {/*Show todos of the user that is logged in*/}
                        {
                            todos.map((userTodos) => (
                                <div key={userTodos?.id}>
                                    <div className="homepageLoginTodoSection">
                                        <h3 data-testid="todo-item">
                                            {userTodos.Todos}
                                        </h3>
                                        <div className="homepageLoginImgContainer" >
                                            <img src={userTodos.image} alt={userTodos.Todos}></img>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </main >
                :
                <main className="HomeLoggedOut">
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
                            <button className="HomeBtn" onClick={() => {
                                navigate("/SignUp")
                            }}>Get started</button>
                        </div>
                    </div>
                    <div className="homePageTodoContainerLoggedOut">
                        <div className="homePageTodoSectionLoggedOut">
                            <h3>
                                Add todos
                            </h3>
                            <img src={todoIcon} className="homePageTodoImg"></img>
                        </div>
                        <div className="homePageTodoSectionLoggedOut">
                            <h3>
                                See your progress

                            </h3>
                            <img src={progressIcon} className="homePageTodoImg"></img>
                        </div>
                        <div className="homePageTodoSectionLoggedOut">
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
