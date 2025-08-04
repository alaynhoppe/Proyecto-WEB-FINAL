"use client"

import { useState } from "react"

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [registerData, setRegisterData] = useState({
    nombres: "",
    apellidos: "",
    cedula: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    userType: "",
    facultad: "",
  })
  const [registerErrors, setRegisterErrors] = useState({})

  // Credenciales del administrador
  const ADMIN_CREDENTIALS = {
    email: "admin@uleam.edu.ec",
    password: "Admin2024ULEAM!",
  }

  const validateEmail = (email) => {
    const uleamPattern = /^e\d{10}@live\.uleam\.edu\.ec$/
    return uleamPattern.test(email)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "El correo electrónico es obligatorio"
    } else if (formData.email !== ADMIN_CREDENTIALS.email && !validateEmail(formData.email)) {
      newErrors.email = "Debe usar el formato: e1312345678@live.uleam.edu.ec"
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria"
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateRegisterForm = () => {
    const newErrors = {}

    if (!registerData.nombres.trim()) {
      newErrors.nombres = "Los nombres son obligatorios"
    } else if (registerData.nombres.trim().length < 2) {
      newErrors.nombres = "Los nombres deben tener al menos 2 caracteres"
    }

    if (!registerData.apellidos.trim()) {
      newErrors.apellidos = "Los apellidos son obligatorios"
    } else if (registerData.apellidos.trim().length < 2) {
      newErrors.apellidos = "Los apellidos deben tener al menos 2 caracteres"
    }

    if (!registerData.cedula) {
      newErrors.cedula = "La cédula es obligatoria"
    } else if (!/^\d{10}$/.test(registerData.cedula)) {
      newErrors.cedula = "La cédula debe tener exactamente 10 dígitos"
    }

    if (!registerData.email) {
      newErrors.email = "El correo electrónico es obligatorio"
    } else if (!/^e\d{10}@live\.uleam\.edu\.ec$/.test(registerData.email)) {
      newErrors.email = "Debe usar el formato: e1312345678@live.uleam.edu.ec"
    }

    if (!registerData.telefono) {
      newErrors.telefono = "El teléfono es obligatorio"
    } else if (!/^09\d{8}$/.test(registerData.telefono)) {
      newErrors.telefono = "El teléfono debe tener formato ecuatoriano (09xxxxxxxx)"
    }

    if (!registerData.password) {
      newErrors.password = "La contraseña es obligatoria"
    } else if (registerData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = "Debe confirmar la contraseña"
    } else if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    if (!registerData.userType) {
      newErrors.userType = "Debe seleccionar un tipo de usuario"
    }

    if (!registerData.facultad) {
      newErrors.facultad = "Debe seleccionar una facultad"
    }

    setRegisterErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Verificar credenciales de administrador
      if (formData.email === ADMIN_CREDENTIALS.email && formData.password === ADMIN_CREDENTIALS.password) {
        onLogin({
          email: formData.email,
          role: "admin",
          name: "Administrador del Sistema",
          id: "admin",
        })
        return
      }

      // Verificar usuario regular en localStorage
      const users = JSON.parse(localStorage.getItem("uleam_users") || "[]")
      const user = users.find((u) => u.email === formData.email && u.password === formData.password)

      if (user) {
        onLogin({
          email: user.email,
          role: user.userType,
          name: `${user.nombres} ${user.apellidos}`,
          id: user.id,
          facultad: user.facultad,
        })
      } else {
        setErrors({ general: "Credenciales incorrectas" })
      }
    } catch (error) {
      setErrors({ general: "Error al iniciar sesión" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!validateRegisterForm()) return

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const existingUsers = JSON.parse(localStorage.getItem("uleam_users") || "[]")
      const userExists = existingUsers.some((u) => u.email === registerData.email || u.cedula === registerData.cedula)

      if (userExists) {
        setRegisterErrors({ general: "Ya existe un usuario con este correo o cédula" })
        setIsLoading(false)
        return
      }

      const newUser = {
        id: Date.now(),
        ...registerData,
        fechaRegistro: new Date().toISOString(),
      }

      existingUsers.push(newUser)
      localStorage.setItem("uleam_users", JSON.stringify(existingUsers))

      alert("¡Registro exitoso! Ahora puedes iniciar sesión con tus credenciales.")

      setRegisterData({
        nombres: "",
        apellidos: "",
        cedula: "",
        email: "",
        telefono: "",
        password: "",
        confirmPassword: "",
        userType: "",
        facultad: "",
      })
      setRegisterErrors({})
      setIsRegistering(false)
    } catch (error) {
      setRegisterErrors({ general: "Error al registrar usuario. Intente nuevamente." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()

    if (!forgotEmail) {
      alert("Por favor ingrese su correo electrónico")
      return
    }

    if (forgotEmail !== ADMIN_CREDENTIALS.email && !validateEmail(forgotEmail)) {
      alert("Debe usar el formato institucional: e1312345678@live.uleam.edu.ec")
      return
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simular envío de correo
      if (forgotEmail === ADMIN_CREDENTIALS.email) {
        alert("Se ha enviado un correo con instrucciones para restablecer la contraseña del administrador.")
      } else {
        const users = JSON.parse(localStorage.getItem("uleam_users") || "[]")
        const user = users.find((u) => u.email === forgotEmail)

        if (user) {
          alert(`Se ha enviado un correo a ${forgotEmail} con instrucciones para restablecer tu contraseña.`)
        } else {
          alert("No se encontró una cuenta asociada a este correo electrónico.")
        }
      }

      setShowForgotPassword(false)
      setForgotEmail("")
    } catch (error) {
      alert("Error al procesar la solicitud. Intente nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src="https://www.uleam.edu.ec/wp-content/uploads/2012/09/LOGO-ULEAM.png" alt="Logo ULEAM" className="login-logo"style={{ display: "block", margin: "0 auto" }} />
          <h1 className="login-title">Sistema de Producción Científica</h1>
          <p className="login-subtitle">Universidad Laica Eloy Alfaro de Manabí</p>
        </div>

        {/* Formulario de Login */}
        {!isRegistering && !showForgotPassword && (
          <form onSubmit={handleSubmit}>
            {errors.general && (
              <div className="error-message mb-20" style={{ textAlign: "center" }}>
                {errors.general}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <input
                type="email"
                className={`form-input ${errors.email ? "error" : ""}`}
                placeholder="e1312345678@live.uleam.edu.ec"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className={`form-input ${errors.password ? "error" : ""}`}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>

            {/* Botón de Olvidé mi contraseña */}
            <div style={{ textAlign: "center", marginTop: "15px" }}>
              <button
                type="button"
                className="btn-link"
                onClick={() => setShowForgotPassword(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#1e3c72",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                ¿Has olvidado tu contraseña?
              </button>
            </div>
          </form>
        )}

        {/* Formulario de Registro */}
        {isRegistering && !showForgotPassword && (
          <form onSubmit={handleRegister}>
            {registerErrors.general && (
              <div className="error-message mb-20" style={{ textAlign: "center" }}>
                {registerErrors.general}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Nombres *</label>
              <input
                type="text"
                className={`form-input ${registerErrors.nombres ? "error" : ""}`}
                placeholder="Ingrese sus nombres"
                value={registerData.nombres}
                onChange={(e) => setRegisterData({ ...registerData, nombres: e.target.value })}
              />
              {registerErrors.nombres && <div className="error-message">{registerErrors.nombres}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Apellidos *</label>
              <input
                type="text"
                className={`form-input ${registerErrors.apellidos ? "error" : ""}`}
                placeholder="Ingrese sus apellidos"
                value={registerData.apellidos}
                onChange={(e) => setRegisterData({ ...registerData, apellidos: e.target.value })}
              />
              {registerErrors.apellidos && <div className="error-message">{registerErrors.apellidos}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Cédula *</label>
              <input
                type="text"
                className={`form-input ${registerErrors.cedula ? "error" : ""}`}
                placeholder="1234567890"
                value={registerData.cedula}
                onChange={(e) =>
                  setRegisterData({ ...registerData, cedula: e.target.value.replace(/\D/g, "").slice(0, 10) })
                }
              />
              {registerErrors.cedula && <div className="error-message">{registerErrors.cedula}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Teléfono *</label>
              <input
                type="text"
                className={`form-input ${registerErrors.telefono ? "error" : ""}`}
                placeholder="0987654321"
                value={registerData.telefono}
                onChange={(e) =>
                  setRegisterData({ ...registerData, telefono: e.target.value.replace(/\D/g, "").slice(0, 10) })
                }
              />
              {registerErrors.telefono && <div className="error-message">{registerErrors.telefono}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Correo Institucional *</label>
              <input
                type="email"
                className={`form-input ${registerErrors.email ? "error" : ""}`}
                placeholder="e1312345678@live.uleam.edu.ec"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value.toLowerCase() })}
              />
              {registerErrors.email && <div className="error-message">{registerErrors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña *</label>
              <input
                type="password"
                className={`form-input ${registerErrors.password ? "error" : ""}`}
                placeholder="••••••••"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              />
              {registerErrors.password && <div className="error-message">{registerErrors.password}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirmar Contraseña *</label>
              <input
                type="password"
                className={`form-input ${registerErrors.confirmPassword ? "error" : ""}`}
                placeholder="••••••••"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
              />
              {registerErrors.confirmPassword && <div className="error-message">{registerErrors.confirmPassword}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de Usuario *</label>
              <select
                className={`form-input ${registerErrors.userType ? "error" : ""}`}
                value={registerData.userType}
                onChange={(e) => setRegisterData({ ...registerData, userType: e.target.value })}
              >
                <option value="">Selecciona tu rol</option>
                <option value="estudiante">Estudiante</option>
                <option value="docente">Docente</option>
                <option value="investigador">Investigador</option>
              </select>
              {registerErrors.userType && <div className="error-message">{registerErrors.userType}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Facultad *</label>
              <select
                className={`form-input ${registerErrors.facultad ? "error" : ""}`}
                value={registerData.facultad}
                onChange={(e) => setRegisterData({ ...registerData, facultad: e.target.value })}
              >
                <option value="">Selecciona tu facultad</option>
                <option value="ciencias-vida-tecnologias">Facultad de Ciencias de la Vida y Tecnologías</option>
                <option value="ciencias-salud">Facultad de Ciencias de la Salud</option>
                <option value="ciencias-sociales-derecho-bienestar">
                  Facultad de Ciencias Sociales Derecho y Bienestar
                </option>
                <option value="ciencias-administrativas-contables-comercio">
                  Facultad Ciencias Administrativas, Contables y Comercio
                </option>
                <option value="educacion-turismo-artes-humanidades">
                  Facultad de Educación Turismo Artes y Humanidades
                </option>
                <option value="ingenieria-industria-arquitectura">Facultad Ingeniería, Industria y Arquitectura</option>
              </select>
              {registerErrors.facultad && <div className="error-message">{registerErrors.facultad}</div>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Registrando..." : "Crear Cuenta"}
            </button>
          </form>
        )}

        {/* Formulario de Recuperar Contraseña */}
        {showForgotPassword && (
          <form onSubmit={handleForgotPassword}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <h3 style={{ color: "#1e3c72", marginBottom: "10px" }}>Recuperar Contraseña</h3>
              <p style={{ color: "#666", fontSize: "14px" }}>
                Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <input
                type="email"
                className="form-input"
                placeholder="e1312345678@live.uleam.edu.ec"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar Instrucciones"}
            </button>

            <div style={{ textAlign: "center", marginTop: "15px" }}>
              <button
                type="button"
                className="btn-link"
                onClick={() => {
                  setShowForgotPassword(false)
                  setForgotEmail("")
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#1e3c72",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                Volver al inicio de sesión
              </button>
            </div>
          </form>
        )}

        {/* Enlaces de navegación */}
        {!showForgotPassword && (
          <div className="register-link">
            <p>
              {isRegistering ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setIsRegistering(!isRegistering)
                }}
              >
                {isRegistering ? "Iniciar Sesión" : "Crear Cuenta"}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login
