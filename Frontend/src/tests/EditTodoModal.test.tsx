import { fireEvent, render, screen, waitFor, } from '@testing-library/react'
import { EditTodoModal } from '../components/EditTodoModal'
import { describe, it, expect, vi, beforeEach, afterAll } from "vitest"
import { AuthStatusContext } from '../AuthContext'
import { BrowserRouter } from 'react-router-dom'
import { todoData } from './testData'

//Set logged in status
const userStatus = {
    isLoggedIn: true,
    isLoading: false,
    currentUser: { userId: 1, email: "test@gmail.com", password: "test12345", name: "Test" },
    login: vi.fn(),
    logout: vi.fn(),
    signup: vi.fn()
}

describe("Edit todo modal", () => {
    beforeEach(() => {
        global.fetch = vi.fn().mockResolvedValue({
            json: () => Promise.resolve(todoData)
        })
    })
    it("Should close todo modal when you click the Cancel button", async () => {
        const mockSetEditModalOpen = vi.fn()
        render(
            <AuthStatusContext.Provider value={userStatus}>
                <BrowserRouter>
                    <EditTodoModal clickedEditTodo={todoData[0]} editModalOpen={true} setEditModalOpen={mockSetEditModalOpen} openEditImages={false} setOpenEditImages={vi.fn()} setTodos={vi.fn()}
                        Todos={todoData}
                        getTodos={vi.fn()} />
                </BrowserRouter>
            </AuthStatusContext.Provider>
        )
        const cancelBtn = screen.getByRole("button", { name: "Cancel" })
        fireEvent.click(cancelBtn)
        await waitFor(() => {

            expect(mockSetEditModalOpen).toHaveBeenCalledWith(false)
        })

    })
    it("Should be able to change Todo title", async () => {
        render(
            <AuthStatusContext.Provider value={userStatus}>
                <BrowserRouter>
                    <EditTodoModal clickedEditTodo={todoData[0]} editModalOpen={true} setEditModalOpen={vi.fn()} openEditImages={true} setOpenEditImages={vi.fn()} setTodos={vi.fn()}
                        Todos={todoData}
                        getTodos={vi.fn()} />
                </BrowserRouter>
            </AuthStatusContext.Provider>
        )
        await waitFor(() => {
            const todoTitleInput = screen.getByDisplayValue("Have meeting")
            fireEvent.change(todoTitleInput, { target: { value: "Have monday meeting" } })
            const saveBtn = screen.getByRole("button", { name: "Save" })
            fireEvent.click(saveBtn)
            expect(screen.getByDisplayValue("Have monday meeting")).toBeInTheDocument()
        })

    })

    it("Should render correct value in input field for Edit Todo title", async () => {
        render(
            <AuthStatusContext.Provider value={userStatus}>
                <BrowserRouter>
                    <EditTodoModal clickedEditTodo={todoData[0]} editModalOpen={true} setEditModalOpen={vi.fn()} openEditImages={true} setOpenEditImages={vi.fn()} setTodos={vi.fn()}
                        Todos={todoData}
                        getTodos={vi.fn()} />
                </BrowserRouter>
            </AuthStatusContext.Provider>
        )
        await waitFor(() => {
            const editTodoInput = screen.getByDisplayValue("Have meeting")
            expect(editTodoInput).toBeInTheDocument()
        })

    })
    it("Should render: Edit Todo title label", async () => {
        render(
            <AuthStatusContext.Provider value={userStatus}>
                <BrowserRouter>
                    <EditTodoModal clickedEditTodo={todoData[0]} editModalOpen={true} setEditModalOpen={vi.fn()} openEditImages={true} setOpenEditImages={vi.fn()} setTodos={vi.fn()}
                        Todos={todoData}
                        getTodos={vi.fn()} />
                </BrowserRouter>
            </AuthStatusContext.Provider>
        )
        await waitFor(() => {
            const editTodoTitle = screen.getByText("Edit Todo text title:")
            expect(editTodoTitle).toBeInTheDocument()
        })

    })

    it("Should render Save and Cancel buttons", async () => {
        render(
            <AuthStatusContext value={userStatus}>
                <BrowserRouter>
                    <EditTodoModal clickedEditTodo={todoData[0]} editModalOpen={true} setEditModalOpen={vi.fn()} openEditImages={true} setOpenEditImages={vi.fn()} setTodos={vi.fn()}
                        Todos={todoData}
                        getTodos={vi.fn()} />
                </BrowserRouter>
            </AuthStatusContext>
        )
        await waitFor(() => {
            const saveBtn = screen.getByRole("button", { name: "Save" })
            const cancelBtn = screen.getByRole("button", { name: "Cancel" })
            expect(cancelBtn).toBeInTheDocument()
            expect(saveBtn).toBeInTheDocument()
        })

    })

    it("Should render close icon", async () => {
        render(
            <AuthStatusContext value={userStatus}>
                <BrowserRouter>
                    <EditTodoModal clickedEditTodo={todoData[0]} editModalOpen={true} setEditModalOpen={vi.fn()} openEditImages={true} setOpenEditImages={vi.fn()} setTodos={vi.fn()}
                        Todos={todoData}
                        getTodos={vi.fn()} />
                </BrowserRouter>
            </AuthStatusContext>
        )
        await waitFor(() => {
            const closeIcon = screen.getByTestId("close-icon")
            expect(closeIcon).toBeInTheDocument()
        })

    })
    afterAll(() => {
        vi.clearAllMocks()
    })
})
