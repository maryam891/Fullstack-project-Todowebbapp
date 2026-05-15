import { TfiPencilAlt } from "react-icons/tfi";
import { FaRegUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import '../css/navbar.css'
import { AuthStatusContext } from "../AuthContext";
import { useContext } from "react";

export default function NavBarLoggedIn() {
    const User = useContext(AuthStatusContext)

    const navigate = useNavigate();

    const profileNavigate = () => {
        //Check if user is logged in to navigate to profile page else to login page
        if (User?.isLoggedIn === true) {
            navigate("/Profile")
        }
        else {
            navigate("/Login")
        }
    }
    const LoginNavigate = () => {
        //Check if user is not logged in to navigate to Login page else to Profile page
        if (User?.isLoggedIn === false) {
            navigate("/Login")
        }
        else {
            navigate("/Profile")
        }

    }
    console.log(User?.currentUser?.name)
    return (
        <>
            {/*Check if user is logged in to show logged in navbar else logged out navbar*/}
            {User?.isLoggedIn === true ?
                <nav className="navbar">
                    <div className="navContainer">
                        <h1>
                            MyTodo <TfiPencilAlt />
                        </h1>

                        {/* Desktop links */}
                        <ul className="menu desktopMenu">
                            <li><Link to="/" className="nav-link">Home</Link></li>
                            <li><Link to="/Todos" className="nav-link">Todos</Link></li>
                        </ul>
                        <button className="desktopIconBtn" onClick={profileNavigate}>
                            {User?.currentUser?.name}<FaRegUser className="desktopIcon" />
                        </button>
                    </div>
                    {/*Hamburger menu*/}
                    <div className="hamburger-menu">
                        {/*checkbox used to check if hamburger menu is clicked*/}
                        <input type="checkbox" id="menu-toggle" />
                        <label htmlFor="menu-toggle" className="hamburger">
                            {/*hamburger menu icon*/}
                            <span></span>
                            <span></span>
                            <span></span>
                        </label>

                        <ul className="menu MobileLinks">
                            <li>
                                <Link to="/" className='nav-link'>Home</Link>
                            </li>
                            <li>
                                <Link to="/Todos" className='nav-link'>Todos</Link>
                            </li>
                            <button className="mobileIconBtn" onClick={profileNavigate}>
                                {User?.currentUser?.name}<FaRegUser className="mobileIcon" />
                            </button>
                        </ul>
                    </div>
                </nav >
                : <nav className="navbar">

                    <div className="navContainer">
                        <h1>
                            MyTodo <TfiPencilAlt />
                        </h1>

                        {/* Desktop links */}
                        <ul className="menu desktopMenu">
                            <li><Link to="/" className="nav-link">Home</Link></li>
                            <li><Link to="/Todos" className="nav-link">Todos</Link></li>
                        </ul>
                        <button className="desktopIconBtn" onClick={LoginNavigate}>
                            Login
                            <FaRegUser className="desktopIcon" />
                        </button>
                    </div>


                    {/*Hamburger menu*/}
                    <div className="hamburger-menu">
                        {/*checkbox used to check if hamburger menu is clicked*/}
                        <input type="checkbox" id="menu-toggle" />
                        <label htmlFor="menu-toggle" className="hamburger">
                            {/*hamburger menu icon*/}
                            <span></span>
                            <span></span>
                            <span></span>
                        </label>

                        <ul className="menu MobileLinks">
                            <li>
                                <Link to="/" className='nav-link'>Home</Link>
                            </li>
                            <li>
                                <Link to="/Todos" className='nav-link'>Todos</Link>
                            </li>
                            <button className="mobileIconBtn" onClick={LoginNavigate}>
                                Login <FaRegUser className="mobileIcon" />
                            </button>
                        </ul>
                    </div>
                </nav>}
        </>
    )
}
