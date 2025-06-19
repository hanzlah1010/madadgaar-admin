import { useState } from "react"
import { auth } from "../../Firestore/firestore"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import { FirebaseError } from "firebase/app"
import apiController from "../../api/apiController"
import { AxiosError } from "axios"
import { useQueryClient } from "@tanstack/react-query"

const Auth = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const [isPending, setIsPending] = useState(false)
  const queryClient = useQueryClient()

  const isValidEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const signIn = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    evt.stopPropagation()

    if (!isValidEmail(email)) {
      setError("Invalid email format! Please enter a valid email.") // ❌ Show error
      return
    }
    setError("")

    setIsPending(true)
    try {
      const { data } = await apiController.post("/auth/login", {
        email,
        password,
        asRole: "ADMIN"
      })
      localStorage.setItem("access_token", data.access_token)
      queryClient.setQueryData(["session"], data.user)
    } catch (err) {
      const defaultMsg = "Failed to login. Please try again."
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || defaultMsg)
      } else {
        setError(defaultMsg)
      }
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form
      onSubmit={signIn}
      className="d-flex justify-content-center align-items-center vh-100 bg-dark"
    >
      <div
        style={{ maxWidth: "500px" }}
        className="container w-100 text-center"
      >
        <h2 className="text-light">Login</h2>
        &nbsp;
        <input
          required
          name="email"
          type="email"
          disabled={isPending}
          placeholder="Email"
          className="form-control my-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          required
          name="password"
          placeholder="Password"
          type="password"
          disabled={isPending}
          className="form-control my-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-danger">{error}</p>}
        <br />
        <button
          type="submit"
          disabled={isPending}
          className="btn btn-primary w-100 d-block mx-auto"
        >
          Sign in
        </button>
      </div>
    </form>
  )
}

export default Auth
