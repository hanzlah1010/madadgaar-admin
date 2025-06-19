import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import Auth from "./Components/Users/login"
import App from "./main"
import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useSession } from "./hooks/useSession"
import { CircularProgress } from "@mui/material"
import { Toaster } from "react-hot-toast"

const queryClient = new QueryClient()

const RootComponent = () => {
  const { user, isPending } = useSession()

  if (isPending) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100svh"
        }}
      >
        <CircularProgress />
      </div>
    )
  }

  return <BrowserRouter>{user ? <App /> : <Auth />}</BrowserRouter>
}

const rootElement = document.getElementById("root")
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RootComponent />
        <Toaster />
      </QueryClientProvider>
    </React.StrictMode>
  )
} else {
  console.error("Could not find the 'root' element in the DOM.")
}
