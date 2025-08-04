"use client"
import { useState, useEffect } from "react"
import Login from "./components/Login"
import Dashboard from "./components/Dashboard"
import "./globals.css"

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay una sesión activa
    const savedUser = localStorage.getItem("uleam_current_user")
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setCurrentUser(userData)
    localStorage.setItem("uleam_current_user", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem("uleam_current_user")
  }

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando Sistema ULEAM...</p>
      </div>
    )
  }

  return (
    <div className="app">
      {!currentUser ? <Login onLogin={handleLogin} /> : <Dashboard user={currentUser} onLogout={handleLogout} />}
    </div>
  )
}
