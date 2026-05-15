import { render, screen, waitFor } from '@testing-library/react'
import Home from '../pages/Home'
import { describe, it, expect, vi, afterAll, beforeEach } from "vitest"
import { AuthStatusContext } from '../AuthContext'
import { BrowserRouter } from 'react-router-dom'
import { todoData } from './testData'
//Set userdata
const userStatus = {
    isLoggedIn: true,
    isLoading: false,
    currentUser: { userId: 1, email: "Alice@gmail.com", password: "Secret123", name: "Alice" },
    login: vi.fn(),
    logout: vi.fn(),
    signup: vi.fn()
}
//Test for when user is logged out

describe("Home", () => {
    beforeEach(() => {
        global.fetch = vi.fn()
            .mockResolvedValue({
                json: () => Promise.resolve(todoData)

            })
    })
    //When user is logged out
    it("Should render text: Welcome to a planning game changer!", () => {
        render(<BrowserRouter>
            <Home /></BrowserRouter>)
        const headerText = screen.getByText("Welcome to a planning game changer!")
        expect(headerText).toBeInTheDocument()
    })
    it("Should render: Get started button", () => {
        render(<BrowserRouter>
            <Home /></BrowserRouter>)
        const homeButton = screen.getByRole("button", { name: "Get started" })
        expect(homeButton).toBeInTheDocument()
    })

    //When user is logged in
    it("Should render todos of user that is logged in", async () => {
        render(
            <AuthStatusContext.Provider value={userStatus}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter></AuthStatusContext.Provider>)
        await waitFor(() => {
            const todoHeaders = screen.queryAllByTestId("todo-item")
            expect(todoHeaders.length).toBeGreaterThan(0)

        })
    })

    it(("Should render Welcome text with username"), async () => {
        render(
            <AuthStatusContext.Provider value={userStatus}>
                <BrowserRouter>
                    <Home />
                </BrowserRouter></AuthStatusContext.Provider>)
        await waitFor(() => {
            const getHeader = screen.getByRole("heading", { level: 1 })
            expect(getHeader).toBeInTheDocument()
            expect(getHeader.textContent).toContain("Alice")

        })
    })


    afterAll(() => {
        vi.clearAllMocks()
    })
})
