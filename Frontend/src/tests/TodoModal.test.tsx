import { render, screen, } from '@testing-library/react'
import TodoModal from '../components/TodoModal'
import { describe, it, expect, vi, } from "vitest"
import { BrowserRouter } from 'react-router-dom'
import { todoData } from './testData'


describe("TodoModal", () => {

    it("Should not show todo modal when modalOpen is false", () => {
        render(
            <BrowserRouter>
                <TodoModal clickedTodo={todoData[0]} modalOpen={false} setModalOpen={vi.fn()} />
            </BrowserRouter>
        )
        const todoTitle = screen.queryByRole("heading", { level: 1 })
        expect(todoTitle).not.toBeInTheDocument()
    })
    it("Should render todo title and todo description when todo modal is open", () => {
        render(
            <BrowserRouter>
                <TodoModal clickedTodo={todoData[0]} modalOpen={true} setModalOpen={vi.fn()} />
            </BrowserRouter>
        )
        const todoTitle = screen.getByRole("heading", { level: 1 })
        const todoDescription = screen.getByText("At 8pm")
        expect(todoTitle.textContent).toContain("Have meeting")
        expect(todoDescription).toBeInTheDocument()
        expect(todoTitle).toBeInTheDocument()
    })

    it("Should render Close button", () => {
        render(
            <BrowserRouter>
                <TodoModal clickedTodo={todoData[0]} modalOpen={true} setModalOpen={vi.fn()} />
            </BrowserRouter>
        )
        const closeBtn = screen.getByTestId("close-icon")
        expect(closeBtn).toBeInTheDocument()
    })

})
