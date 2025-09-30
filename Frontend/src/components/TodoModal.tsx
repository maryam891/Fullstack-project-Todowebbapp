import type { todos } from '../components/Todos'
import { IoClose } from "react-icons/io5";

export interface TodoModalProps {
    clickedTodo: todos | null,
    modalOpen: boolean,
    setModalOpen: (value: boolean) => void
}
export default function TodoModal({ clickedTodo, modalOpen, setModalOpen }: TodoModalProps) {


    return (
        <>
            {modalOpen && clickedTodo &&
                <div className="todoModalContainer">
                    <IoClose className='closeTodo' onClick={() => {
                        setModalOpen(false)
                    }} />
                    <h3>
                        {clickedTodo.Todos}
                    </h3>
                    <p>{clickedTodo.todo_description}</p>

                    {/*Check if modal is clicked and a date is chosen to show in details*/}
                    {/*Format the date to display in string form*/}
                    <p>
                        {clickedTodo.chosen_date &&
                            new Date(clickedTodo.chosen_date).toLocaleString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                            })}
                    </p>
                    <img src={clickedTodo.image}></img>
                </div>
            }
        </>
    )
}
