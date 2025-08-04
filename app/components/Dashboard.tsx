"use client"

import { useState } from "react"
import PanelPrincipal from "./PanelPrincipal"
import MisPublicaciones from "./MisPublicaciones"
import ExplorarPublicaciones from "./ExplorarPublicaciones"
import MisProyectos from "./MisProyectos"
import ExplorarProyectos from "./ExplorarProyectos"
import ExplorarInvestigadores from "./ExplorarInvestigadores"
import ExplorarDocentes from "./ExplorarDocentes"
import Perfil from "./Perfil"
import Validacion from "./Validacion"
import Reportes from "./Reportes"
import GestionUsuarios from "./GestionUsuarios"
import ConfiguracionSistema from "./ConfiguracionSistema"

const Dashboard = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState("panel")

  const getUserTypeLabel = (type) => {
    const labels = {
      estudiante: "Estudiante",
      docente: "Docente",
      investigador: "Investigador",
      admin: "Administrador",
    }
    return labels[type] || type
  }

  const navigationItems = [
    { key: "panel", label: "Inicio", roles: ["admin", "investigador", "docente", "estudiante"] },
    { key: "mis-publicaciones", label: "Mis Publicaciones", roles: ["admin", "investigador", "docente"] },
    {
      key: "explorar-publicaciones",
      label: "Explorar Publicaciones",
      roles: ["admin", "investigador", "docente", "estudiante"],
    },
    { key: "mis-proyectos", label: "Mis Proyectos", roles: ["admin", "investigador", "docente", "estudiante"] },
    {
      key: "explorar-proyectos",
      label: "Explorar Proyectos",
      roles: ["admin", "investigador", "docente", "estudiante"],
    },
    { key: "investigadores", label: "Investigadores", roles: ["admin", "investigador", "docente", "estudiante"] },
    { key: "docentes", label: "Docentes", roles: ["admin", "investigador", "docente", "estudiante"] },
    { key: "perfil", label: "Mi Perfil", roles: ["investigador", "docente", "estudiante"] },
    { key: "validacion", label: "Validar", roles: ["admin"] },
    { key: "reportes", label: "Reportes", roles: ["admin"] },
    { key: "usuarios", label: "Usuarios", roles: ["admin"] },
    { key: "configuracion", label: "Configuración", roles: ["admin"] },
  ]

  const visibleItems = navigationItems.filter((item) => item.roles.includes(user.role))

  const renderContent = () => {
    switch (currentView) {
      case "panel":
        return <PanelPrincipal user={user} onNavigate={setCurrentView} />
      case "mis-publicaciones":
        return <MisPublicaciones user={user} />
      case "explorar-publicaciones":
        return <ExplorarPublicaciones user={user} />
      case "mis-proyectos":
        return <MisProyectos user={user} />
      case "explorar-proyectos":
        return <ExplorarProyectos user={user} />
      case "investigadores":
        return <ExplorarInvestigadores user={user} />
      case "docentes":
        return <ExplorarDocentes user={user} />
      case "perfil":
        return <Perfil user={user} />
      case "validacion":
        return <Validacion user={user} />
      case "reportes":
        return <Reportes user={user} />
      case "usuarios":
        return <GestionUsuarios user={user} />
      case "configuracion":
        return <ConfiguracionSistema user={user} />
      default:
        return <PanelPrincipal user={user} onNavigate={setCurrentView} />
    }
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <img src="https://www.uleam.edu.ec/wp-content/uploads/2012/09/LOGO-ULEAM.png" alt="Logo ULEAM" className="header-logo" />
            <h1 className="header-title">Sistema de Producción Científica ULEAM</h1>
          </div>
          <div className="header-right">
            <span className={`user-badge ${user.role}`}>
              {getUserTypeLabel(user.role)}: {user.name}
            </span>
            <button className="btn btn-secondary" onClick={onLogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav-container">
        <div className="nav-content">
          {visibleItems.map((item) => (
            <button
              key={item.key}
              className={`nav-item ${currentView === item.key ? "active" : ""}`}
              onClick={() => setCurrentView(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">{renderContent()}</main>
    </div>
  )
}

export default Dashboard
