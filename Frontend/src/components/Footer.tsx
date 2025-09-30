import { TfiPencilAlt } from "react-icons/tfi";
import { Link, } from 'react-router-dom'
import "../css/footer.css"
export default function Footer() {
    return (
        <>
            <hr style={{ marginTop: "20px" }} />
            <div className="Footer">
                <h1>
                    MyTodo <TfiPencilAlt />
                </h1>
                <p>Copyright © 2025</p>
                <ul>
                    <li>
                        <Link to="/" className='footer-link'>Home</Link>
                    </li>
                    <li>
                        <Link to="/Todos" className='footer-link'>Todos</Link>
                    </li>
                </ul>
            </div>
        </>
    )
}
