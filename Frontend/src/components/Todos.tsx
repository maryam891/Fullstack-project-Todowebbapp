
import "../css/Todos.css"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import todoBackgroundImg from '../assets/todoBackgroundImg.svg'
import todoBackgroundImg2 from '../assets/todoBackgroundImg2.svg'
import { RiDeleteBin6Line } from "react-icons/ri";
import { LuPencil } from "react-icons/lu";
import { Modal, Button, Form } from 'react-bootstrap'
import { useContext } from "react";
import { AuthStatusContext } from "../AuthContext";
import TodoModal from "../components/TodoModal"
import { EditTodoModal } from "./EditTodoModal";
import "react-datepicker/dist/react-datepicker.css"
import DatePicker from "react-datepicker";

export interface todos {
    id: number,
    Todos: string,
    image: string,
    todo_description: string,
    image_id: number,
    completed_todo: number,
    chosen_date: string,


}

export interface image {
    id: number
    image: string,
}

export default function Todos() {

    //Use values from useContext
    const User = useContext(AuthStatusContext)

    const backgroundImg = todoBackgroundImg
    const backgroundImg2 = todoBackgroundImg2
    const navigate = useNavigate();
    const [showAddTodoContainer, setShowAddTodoContainer] = useState(false)
    const [selectedImg, setSelectedImg] = useState<number | null>(null);
    const [addTodoTitle, setAddTodoTitle] = useState("")
    const [addTodoText, setAddTodoText] = useState("")
    const [GetImages, setgetImages] = useState<image[]>([])
    const [clickedEditTodo, setClickedEditTodo] = useState<todos>()
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [openEditImages, setOpenEditImages] = useState(false)
    const [userTodos, setTodos] = useState<todos[]>([])
    const [clickedTodo, setClickedTodo] = useState<todos | null>(null)
    const [modalOpen, setModalOpen] = useState(false)
    const [showDelPopup, setShowDelPopup] = useState<number | null>(null)
    const [selectedDateTime, setSelectedDateTime] = useState(new Date());


    {/*Get current date*/ }
    const current = new Date()
    const date = `${current.getDate()}/${current.getMonth() + 1}/${current.getFullYear()}`;

    {/*Function to get all todos*/ }
    {/*Send userId, email and password to backend to compare and receive back data of user that is logged in*/ }
    function getTodos() {
        fetch('http://localhost:3000/Todos', {
            method: 'POST',
            body: JSON.stringify({ id: User?.currentUser?.userId, Email: User?.currentUser?.email, Password: User?.currentUser?.password }),
            headers: {
                'Content-type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data: todos[]) => {
                setTodos(data)

            })
            .catch((err) => {
                console.log(err.message, 'error');
            });
    }


    {/*Check which todos that are checked(true in backend(1)) and filter out all the todos that are checked)*/ }
    const completedTodos = userTodos.filter(completedTodo => completedTodo.completed_todo === 1).length
    function changeCheckState(event: React.ChangeEvent<HTMLInputElement>, id: number) {
        {/*Send the event target change to backend but also check if the todo is checked(1) or not checked(0)*/ }
        const isChecked = event.target.checked;
        fetch('http://localhost:3000/updateCompletedTodos', {
            method: 'POST',
            body: JSON.stringify({ completed_todo: isChecked ? 1 : 0, id: id, user_id: User?.currentUser?.userId }),
            headers: {
                'Content-type': 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    getTodos()
                }


            })
            .catch((err) => {
                console.log(err.message, 'error');
            });



    }

    {/*Get all todos when userid changes*/ }
    useEffect(() => {
        //Check before if userId exists
        if (User?.currentUser?.userId) {
            getTodos()
        }

    }, [User?.currentUser?.userId])


    //Show popup to confirm removal of todo
    function clickRemoveTodo(id: number) {
        setShowDelPopup(id)
    }
    //Close popup if selecting to not remove todo
    function handleHide() {
        setShowDelPopup(null)
    }

    {/*Send clicked id to backend to delete todo*/ }
    function removeTodo(id: number) {
        fetch('http://localhost:3000/DeleteTodo', {
            method: 'POST',
            body: JSON.stringify({ id: id }),
            headers: {
                'Content-type': 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    {/*Call function again to get all todos again after deleting a todo*/ }
                    getTodos()
                }
                else {
                    console.log('error');
                }

            })
            .catch((err) => {
                console.log(err.message, 'error');
            });


    }

    function addNewTodo() {
        setShowAddTodoContainer(true)
        //Get images from todoImages table to select an image for your todo

        fetch('http://localhost:3000/getImages')
            .then((response) => response.json())
            .then((result) => {
                setgetImages(result)
            })

    }

    //Send new values to backend and save todo

    function saveTodo() {
        fetch('http://localhost:3000/addNewTodo', {
            method: 'POST',
            body: JSON.stringify({ Todos: addTodoTitle, todo_description: addTodoText, image_id: selectedImg, user_id: User?.currentUser?.userId, chosen_date: selectedDateTime }),
            headers: {
                'Content-type': 'application/json',
            },
        })
            .then((response) => {
                if (response.ok) {
                    setShowAddTodoContainer(false)
                    {/*Call function again to get all todos again after saving todo*/ }
                    getTodos()
                }
                else {
                    console.log('error');
                }

            })
            .catch((err) => {
                console.log(err.message, 'error');
            });

    }

    return (
        <>

            {/*Show addTodoContainer when clicking on add todo button*/}
            {showAddTodoContainer && (
                <section className="addTodoContainer">
                    <h2>Add a new todo</h2>
                    <div className="inputTextContainer">
                        <div className="inputColumn">
                            <Form.Label className="todoLabel">Todo name:</Form.Label>
                            <Form.Control type="text" name="Enter Todo" className="addTodoInput" value={addTodoTitle} onChange={(event) => {
                                setAddTodoTitle(event.target.value)
                            }} />
                        </div>

                        <div className="inputColumn">
                            <Form.Label className="todoLabel">Description(Optional):</Form.Label>
                            <Form.Control as="textarea" rows={3} className="addTodoTextArea" value={addTodoText} onChange={(event) => {
                                setAddTodoText(event.target.value)
                            }} />
                        </div>
                    </div>

                    <div className="imageSelection">

                        <form className="dateSection">
                            <label>Choose date and time:</label>
                            <DatePicker
                                className="selectDateSection"
                                selected={selectedDateTime}
                                onChange={() => setSelectedDateTime(selectedDateTime)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                timeCaption="time"
                                dateFormat="MMMM d, yyyy h:mm aa"
                            />
                        </form>
                        <label className="chooseImgText">Choose image(Optional):</label>
                        {GetImages && GetImages.map((img, index) => (
                            //Check if image that is clicked is equal to img.id to show image background when selecting img else default styling
                            <label className={selectedImg === img.id ? "imageOption selected" : "imageOption"} key={index}>
                                <input type="radio" name="img" checked={selectedImg === img.id} value={img.id} style={{ opacity: '0' }} onChange={(e) => {
                                    //Convert to number to compare same values
                                    setSelectedImg(Number(e.currentTarget.value))
                                }}>
                                </input>
                                <img src={img.image} className="todoImage" />

                            </label>
                        ))}

                    </div>
                    <div className="addTodoBtnContainer">
                        <button onClick={saveTodo}>Save</button>
                        <button onClick={() => {
                            setShowAddTodoContainer(false)
                        }}>Cancel</button>
                    </div>
                </section>
            )}


            {/*Check if user is logged in to show loggedin layout else show other layout*/}
            {
                User?.isLoggedIn === true ?
                    <main className="Todos">
                        <div className="todosTextBtnContainer">
                            <div className="textContainer">
                                <h1>My todos</h1>
                                <h2>Today {date}</h2>
                                {/*Don't show if modals are open*/}
                                {modalOpen === false && editModalOpen === false ? <h3>You have this many todos</h3> : ""}
                            </div>
                            <button className="todoButton" onClick={addNewTodo}> + Add new todo </button>
                            <button onClick={() => {
                                if (User.isLoggedIn === true) {
                                    navigate("/Profile")
                                }
                                else {
                                    navigate("/Login")
                                }

                            }} className="profileButton"> View profile</button>
                        </div>
                        {/*Don't show if modals are open*/}
                        {modalOpen === false && editModalOpen === false ? <div className="completedTodoHeader">
                            <h2>
                                Completed todos today
                            </h2>
                            <h3>{completedTodos}/{userTodos && userTodos.length}</h3>
                        </div> : ""}
                        <div className="todoFlexContainer">
                            {userTodos && !modalOpen && !editModalOpen &&
                                userTodos.map((UserTodos, index) => (
                                    <div key={index} >
                                        <Modal show={showDelPopup === UserTodos.id} className="deletePopup">
                                            <Modal.Header className="delHeader">
                                                <Modal.Title>Delete todo</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body className="delHeader2">Are you sure you want to remove todo?</Modal.Body>
                                            <Modal.Footer>
                                                <Button onClick={() => removeTodo(UserTodos.id)}>Yes</Button>
                                                <Button onClick={handleHide} variant="primary">
                                                    No
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                        <div className="todoContainer">
                                            <input type="checkbox" onChange={(event) => changeCheckState(event, UserTodos.id)}
                                                //When a checkbox is checked it will be true(1)
                                                checked={UserTodos.completed_todo === 1}></input>
                                            <RiDeleteBin6Line className="dustbin" onClick={() => clickRemoveTodo(UserTodos.id)} />
                                            <LuPencil className="editPencil" onClick={() => {
                                                setOpenEditImages(true)
                                                setClickedEditTodo(UserTodos)
                                                setEditModalOpen(true)
                                            }} />
                                            <p onClick={() => {
                                                //Show details of one todo when clicking on details
                                                setModalOpen(true)
                                                setClickedTodo(UserTodos)
                                            }}>Details</p>
                                            <h3>
                                                {UserTodos.Todos}
                                            </h3>
                                            <div className="todoImgContainer">
                                                <img src={UserTodos.image}></img>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </main>
                    : <main className="logedOutLayout">

                        <h1>
                            Login to see your todos!
                        </h1>
                        <div className="logedOutImgContainer">
                            <img src={backgroundImg}></img>
                            <img src={backgroundImg2}></img>
                        </div>

                    </main>}

            {clickedTodo && modalOpen && <TodoModal clickedTodo={clickedTodo} setModalOpen={setModalOpen} modalOpen={modalOpen} />}

            {clickedEditTodo && editModalOpen && <EditTodoModal clickedEditTodo={clickedEditTodo} setEditModalOpen={setEditModalOpen} editModalOpen={editModalOpen} openEditImages={openEditImages} setOpenEditImages={setOpenEditImages} setTodos={setTodos} Todos={userTodos} getTodos={getTodos} />}
        </>
    )
}
