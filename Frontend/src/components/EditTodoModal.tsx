import { useState, useEffect } from "react"
import { Form } from 'react-bootstrap'
import { useContext } from "react";
import { AuthStatusContext } from "../AuthContext";
import { IoClose } from "react-icons/io5";
import "../css/editModal.css"
import { type image } from "../pages/Todos"
import { type todos } from "../pages/Todos";
import "react-datepicker/dist/react-datepicker.css"
import DatePicker from "react-datepicker";

export interface EditTodoModalProps {
    clickedEditTodo: todos,
    editModalOpen: boolean,
    openEditImages: boolean,
    setOpenEditImages: (value: boolean) => void,
    setTodos: (value: todos[]) => void,
    todos: todos[]
    setEditModalOpen: (value: boolean) => void,
    getTodos: () => void,
}
export function EditTodoModal({ clickedEditTodo, editModalOpen, setEditModalOpen, getTodos }: EditTodoModalProps) {
    //Use values from useContext
    const User = useContext(AuthStatusContext)
    const [editTodoTitle, setEditTodoTitle] = useState("")
    const [todoImages, setTodoImages] = useState<image[]>([])
    const [editTodoText, setEditTodoText] = useState("")
    const [previewImage, setPreviewImage] = useState<string | undefined>(undefined)
    const [selectedImg, setSelectedImg] = useState<number | null>(null);
    const [editDateTime, setEditDateTime] = useState<Date | null>(new Date())


    //Sync selected todo =>
    // Show default todo text title and description when opening the editmodal
    // Use ?? to ensure todo title is always a string and not undefined
    useEffect(() => {
        setEditTodoTitle(clickedEditTodo.todos ?? "")
        setEditTodoText(clickedEditTodo.todo_description ?? "")
        setSelectedImg(clickedEditTodo.image_id)
        setPreviewImage(clickedEditTodo.image)
        if (clickedEditTodo.chosen_date) {
            setEditDateTime(new Date(clickedEditTodo.chosen_date));
        } else {
            setEditDateTime(null);
        }
    }, [editModalOpen, clickedEditTodo])


    //Get images if edit todo modal is open
    useEffect(() => {
        if (!editModalOpen) {
            return
        }
        const handleGetImages = async () => {
            //Get images from todoImages table to select an image for your todo
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/get-images`)
                if (!response.ok) {
                    return
                }
                const result = await response.json()
                setTodoImages(result)
            }
            catch (error) {
                console.log(error, "could not get images")
            }

        }
        handleGetImages()
        //Get images when opening the edit modal
    }, [editModalOpen])

    //Send the edited values to backend when clicking on save
    async function saveEditTodo(id: number) {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/todo/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ todos: editTodoTitle, todo_description: editTodoText, image_id: selectedImg, id: id, user_id: User?.currentUser?.userId, chosen_date: editDateTime ? editDateTime.toISOString() : null }),
                //Check if ediDateTime exists to convert to string when sending to backend
                headers: {
                    'Content-type': 'application/json',
                },
            })
            if (!response.ok) {
                return
            }
            await response.json()
            setEditModalOpen(false)
            getTodos()

        }


        catch (error) {
            console.log(error, 'error');
        };


    }
    return (
        <>
            {/*Show edit section when clicking on edit pen*/}
            {editModalOpen && clickedEditTodo && (
                <section className="editContainer">
                    <div className="editTodoModalContainer">
                        <IoClose data-testid="close-icon" className='closeEditTodo' onClick={() => {
                            setEditModalOpen(false)
                        }} />
                        {/*Show h3 element as input instead to be able to edit Todo*/}
                        <Form.Label className="editTodoLabel">Edit Todo text title:</Form.Label>
                        <input type="text" className="editTitleArea" value={editTodoTitle} onChange={(event) => {
                            setEditTodoTitle(event.target.value)
                        }} />
                        {/*Check if todo text exists to todo text*/}
                        {/*Show p element as input instead to be able to edit Todo*/}
                        {clickedEditTodo.todo_description ? <><Form.Label className="editTodoLabel">Edit Todo text:</Form.Label>
                            <input type="text" className="editTextArea" value={editTodoText} onChange={(event) => {
                                setEditTodoText(event.target.value)
                            }} /></> : <p></p>}
                        {/*Check if date and time exists to edit date and time*/}
                        {clickedEditTodo.chosen_date ? <div><form className="editDateSection">
                            <label>Edit date and time:</label>
                            <DatePicker
                                className="selectDateSection"
                                selected={editDateTime}
                                onChange={(date) => setEditDateTime(date)}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                timeCaption="time"
                                dateFormat="MMMM d, yyyy h:mm aa"
                            />
                        </form></div> : <p></p>}
                        {/*Check if image exists to edit image*/}
                        {clickedEditTodo.image ? <><label className="changeImgLabel">Change image:</label>

                            <img src={previewImage}></img></> : <p></p>}
                    </div>
                    {clickedEditTodo.image ?
                        <>

                            <label className="changeImgText">Select image:</label>
                            <div className="editImageSelection">
                                {todoImages && todoImages.map((img: image) => (
                                    //Check if selectedImg is equal to img.id to show image background when selecting img else default styling
                                    <label className={selectedImg === img.id ? "imageOption selected" : "imageOption"} key={img.id}>
                                        <input type="radio" name="img" checked={selectedImg === img.id} value={img.id} style={{ opacity: '0' }} onChange={(e) => {
                                            {/*Change image of the todo when clicking on any image from the container*/ }
                                            {/*Convert value to a number since selectedId has a number value*/ }
                                            const selectedId = parseInt(e.currentTarget.value);
                                            setSelectedImg(selectedId);
                                            {/*Look for clicked image that matches image that is in GetImages and change default image in the todo to the selected image*/ }
                                            const selectedImageObj = todoImages.find((img: image) => img.id === selectedId);

                                            if (selectedImageObj) {
                                                setPreviewImage(selectedImageObj.image);
                                            }
                                        }}>
                                        </input>
                                        <img src={img.image} className="todoImage" />

                                    </label>
                                ))}

                            </div></> : <p></p>}
                    <div className="editTodoBtnContainer">
                        <button onClick={() => {
                            saveEditTodo(clickedEditTodo.id)
                        }}>Save</button>
                        <button onClick={() => {
                            setEditModalOpen(false)
                        }}>Cancel</button>
                    </div>
                </section>
            )}
        </>
    )
}
