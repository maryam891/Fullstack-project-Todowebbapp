import type { todos } from '../pages/Todos'
import { IoClose } from "react-icons/io5";

export interface TodoModalProps {
    clickedTodo: todos,
    setModalOpen: (value: boolean) => void
}
export default function TodoModal({ clickedTodo, setModalOpen }: TodoModalProps) {
    return (
        <>

            <div className="todoModalContainer">
                <IoClose data-testid="close-icon" className='closeTodo' onClick={() => {
                    setModalOpen(false)
                }} />
                <h1>
                    {clickedTodo.Todos}
                </h1>
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
                <img src={clickedTodo.image} alt={clickedTodo.Todos}></img>
            </div>

        </>
    )
}
