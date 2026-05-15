import { render, screen } from '@testing-library/react'
import Profile from '../pages/Profile'
import { describe, it, expect, vi, afterAll, beforeEach } from "vitest"
import { waitFor } from '@testing-library/react'
import { AuthStatusContext } from '../AuthContext'
import { BrowserRouter } from 'react-router-dom'

//Set userdata
const userStatus = {
  isLoggedIn: true,
  isLoading: false,
  currentUser: { userId: 1, email: "Bob@gmail.com", password: "Secret222", name: "Bob" },
  login: vi.fn(),
  logout: vi.fn(),
  signup: vi.fn()
}

describe("Profile", () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ Name: "Bob", email: "Bob@gmail.com" })
    })
  })


  it("Should render correct userinfo", async () => {
    render(
      <AuthStatusContext.Provider value={userStatus}>
        <BrowserRouter>
          <Profile />
        </BrowserRouter></AuthStatusContext.Provider>)

    await waitFor(() => {
      const emailValue = screen.getByDisplayValue("Bob@gmail.com")
      expect(emailValue).toBeInTheDocument()
      const userName = screen.getByText("Bob")
      expect(userName).toBeInTheDocument()

    })


  })
  it("Should render Logout button and Delete button", async () => {
    render(
      <AuthStatusContext.Provider value={userStatus}>
        <BrowserRouter>
          <Profile />
        </BrowserRouter></AuthStatusContext.Provider>)
    await waitFor(() => {
      const logoutBtn = screen.getByRole("button", { name: "Log out" })
      expect(logoutBtn).toBeInTheDocument()
      const delBtn = screen.getByRole("button", { name: "Delete account" })
      expect(delBtn).toBeInTheDocument()
    })
  })

  afterAll(() => {
    vi.clearAllMocks()
  })
})
