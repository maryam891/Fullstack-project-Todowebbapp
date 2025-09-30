import Footer from "./components/Footer"
import Home from './components/Home'
import Todos from './components/Todos'
import { createHashRouter, Outlet, RouterProvider } from 'react-router-dom'
import Login from './components/Login'
import Profile from './components/Profile'
import NavBar from './components/NavBar'
import { AuthStatusContext } from "./AuthContext"
import { useState, useEffect } from 'react'
import SignUp from './components/SignUp'

export interface User {
  email: string;
  name?: string; //make name optional
  password: string;
  userId: number;

}

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem("userId", JSON.stringify(user.userId));
    localStorage.setItem("userEmail", JSON.stringify(user.email));
    localStorage.setItem("isLoggedIn", JSON.stringify(true));


  };


  const signup = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    localStorage.setItem("userId", JSON.stringify(user.userId));
    localStorage.setItem("userEmailValue", JSON.stringify(user.email));
    localStorage.setItem("userNameValue", JSON.stringify(user.name || ""));
    localStorage.setItem("isLoggedIn", JSON.stringify(true));
  };

  const logout = () => {
    setCurrentUser({ email: "", password: "", userId: 0, name: "" });
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const storedEmail = localStorage.getItem("userEmail");
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    const storedUserName = localStorage.getItem("userNameValue")


    if (storedUserId && storedEmail && storedIsLoggedIn === "true") {
      setCurrentUser({
        email: JSON.parse(storedEmail),
        name: storedUserName ? JSON.parse(storedUserName) : "",
        password: "",
        userId: JSON.parse(storedUserId)

      });
      setIsLoggedIn(true);
    }
  }, []);

  const router = createHashRouter([
    {
      element: (
        <>
          <NavBar />
          <Outlet />
          <Footer />
        </>
      ),
      children: [
        { element: <Home />, path: "/" },
        { element: <Todos />, path: "/Todos" },
        { element: <Login />, path: "/Login" },
        { element: <Profile />, path: "/Profile" },
        { element: <SignUp />, path: "/SignUp" }
      ],
    },

  ]);

  return <AuthStatusContext.Provider value={{ currentUser, logout, login, signup, isLoggedIn }}><RouterProvider router={router} />
  </AuthStatusContext.Provider>

}
export default App
