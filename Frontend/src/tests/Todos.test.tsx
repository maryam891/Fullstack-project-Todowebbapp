import { render, screen, waitFor } from '@testing-library/react'
import Todos from '../pages/Todos'
import { describe, it, expect, vi, afterAll, beforeEach } from "vitest"
import { BrowserRouter } from 'react-router-dom'
import { AuthStatusContext } from '../AuthContext'
import { todoData } from './testData'

//Set logged in status
const userStatus = {
    isLoggedIn: true,
    isLoading: false,
    currentUser: { userId: 1, email: "Alice@gmail.com", password: "Secret123", name: "Alice" },
    login: vi.fn(),
    logout: vi.fn(),
    signup: vi.fn()
}

//Set logged out status
const loggedOutStatus = {
    isLoggedIn: false,
    isLoading: false,
    currentUser: { userId: 0, email: "", password: "", name: "" },
    login: vi.fn(),
    logout: vi.fn(),
    signup: vi.fn()
}
//Fetch data
describe("Todos", () => {
    beforeEach(() => {
        global.fetch = vi.fn().mockResolvedValue({
            json: () => Promise.resolve(todoData)
        })

    })
    it("Should render: Login to see your todos! text when user is logged out", () => {
        render(<AuthStatusContext.Provider value={loggedOutStatus}>
            <BrowserRouter>
                <Todos />
            </BrowserRouter></AuthStatusContext.Provider>)
        const loggedOutText = screen.getByText("Login to see your todos!")
        expect(loggedOutText).toBeInTheDocument()

    })
    it("Should render total of completed todos out of available todos", async () => {
        render(<AuthStatusContext.Provider value={userStatus}>
            <BrowserRouter>
                <Todos />
            </BrowserRouter></AuthStatusContext.Provider>)
        await waitFor(() => {
            const completedTodoText = screen.getByText("1/3")
            expect(completedTodoText).toBeInTheDocument()
        })

    })
    it("Should render: Add new todo button and View profile button", async () => {
        render(<AuthStatusContext.Provider value={userStatus}>
            <BrowserRouter>
                <Todos />
            </BrowserRouter></AuthStatusContext.Provider>)
        await waitFor(() => {
            const addTodoBtn = screen.getByRole("button", { name: "+ Add new todo" })
            const viewProfileBtn = screen.getByRole("button", { name: "View profile" })
            expect(viewProfileBtn).toBeInTheDocument()
            expect(addTodoBtn).toBeInTheDocument()
        })
    })
    it("Should render: My Todos header and Completed todos today header", async () => {
        render(<AuthStatusContext.Provider value={userStatus}>
            <BrowserRouter>
                <Todos />
            </BrowserRouter></AuthStatusContext.Provider>)
        await waitFor(() => {
            const header = screen.getByText("My todos")
            const header2 = screen.getByText("Completed todos today")
            expect(header).toBeInTheDocument()
            expect(header2).toBeInTheDocument()
        })
    })

    it("Should render todos and length of todos for the user that is logged in", async () => {
        render(
            <AuthStatusContext.Provider value={userStatus}>
                <BrowserRouter>
                    <Todos />
                </BrowserRouter></AuthStatusContext.Provider>)

        await waitFor(() => {
            const todoHeaders = screen.queryAllByTestId("todo-item")
            expect(todoHeaders.length).toBeGreaterThan(0)
            expect(todoHeaders).toHaveLength(3)

        })

    })

    afterAll(() => {
        vi.clearAllMocks()
    })
})
