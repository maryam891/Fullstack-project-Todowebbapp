import { describe, it, expect, } from "vitest"
import { fireEvent, render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Login from "../pages/Login"


describe("Login", () => {
    it("Should be able to type in email and password input and click on Login button", () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>)
        const emailLabel = screen.getByLabelText("Email")
        fireEvent.change(emailLabel, { target: { value: "Bob@gmail.com" } })
        const passwordLabel = screen.getByLabelText("Password")
        fireEvent.change(passwordLabel, { target: { value: "Secret222" } })
        const loginBtn = screen.getByRole("button", { name: "Login" })
        fireEvent.click(loginBtn)
        expect(screen.getByDisplayValue("Secret222")).toBeInTheDocument()
        expect(screen.getByDisplayValue("Bob@gmail.com")).toBeInTheDocument()
    })
    it("Should show field error messages if clicking on Login button and fileds for password and email is empty", () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>)

        const loginBtn = screen.getByRole("button", { name: "Login" })
        fireEvent.click(loginBtn)
        const emailErrorMsg = screen.getByText("Please fill in email")
        const passwordErrorMsg = screen.getByText("Please fill in password")

        expect(emailErrorMsg).toBeInTheDocument()
        expect(passwordErrorMsg).toBeInTheDocument()
    })
    it("Should render email and password input value", () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>)
        const emailLabel = screen.getByLabelText("Email")
        expect(emailLabel).toBeInTheDocument()
        const passwordLabel = screen.getByLabelText("Password")
        expect(passwordLabel).toBeInTheDocument()
    })

    it("Should render login button", () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>)
        const loginBtn = screen.getByRole("button", { name: "Login" })
        expect(loginBtn).toBeInTheDocument()
    })

    it("Should render: Don't have an account and Signup text", () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>)
        const loginText = screen.getByText("Don't have an account?")
        expect(loginText).toBeInTheDocument()
        const signupText = screen.getByText("Sign up")
        expect(signupText).toBeInTheDocument()
    })



})
