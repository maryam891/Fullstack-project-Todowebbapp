import { describe, it, expect, } from "vitest"
import { fireEvent, render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import SignUp from "../pages/SignUp"


describe("SignUp", () => {
    it("Should render error message if password does not match password in confirm password field", () => {
        render(
            <BrowserRouter>
                <SignUp />
            </BrowserRouter>)
        const passwordInput = screen.getByLabelText("Password")
        const confirmPasswordInput = screen.getByLabelText("Confirm password")
        fireEvent.change(passwordInput, { target: { value: "12345678" } })
        fireEvent.change(confirmPasswordInput, { target: { value: "12232" } })
        const errorMsg = screen.getByText("Password must be at least 8 characters and match password field")
        expect(errorMsg).toBeInTheDocument()


    })
    it("Should render Confirm password filed", () => {
        render(
            <BrowserRouter>
                <SignUp />
            </BrowserRouter>)
        const confirmPasswordLabel = screen.getByLabelText("Confirm password")
        expect(confirmPasswordLabel).toBeInTheDocument()
    })


    it("Should render Sign up button", () => {
        render(
            <BrowserRouter>
                <SignUp />
            </BrowserRouter>)
        const loginBtn = screen.getByRole("button", { name: "Sign up" })
        expect(loginBtn).toBeInTheDocument()
    })

    it("Should render name input field", () => {
        render(
            <BrowserRouter>
                <SignUp />
            </BrowserRouter>)
        const nameLabel = screen.getByLabelText("Name")
        expect(nameLabel).toBeInTheDocument()
    })

    it("Should render: Already have an account? text and Login text", () => {
        render(
            <BrowserRouter>
                <SignUp />
            </BrowserRouter>)
        const signupText = screen.getByText("Already have an account?")
        expect(signupText).toBeInTheDocument()
        const loginText = screen.getByText("Login")
        expect(loginText).toBeInTheDocument()
    })



})
