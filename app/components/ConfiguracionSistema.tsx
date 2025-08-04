"use client"

import { useState, useEffect } from "react"

const ConfiguracionSistema = ({ user }) => {
  const [config, setConfig] = useState({
    nombreSistema: "Sistema ULEAM",
    version: "1.0.0",
    mantenimiento: false,
    registroAbierto: true,
  })

  const [stats, setStats] = useState({
    totalUsuarios: 0,
    totalPublicaciones: 0,
    totalProyectos: 0,
  })

  useEffect(() => {
    loadConfig()
    loadStats()
  }, [])

  const loadConfig = () => {
    const savedConfig = localStorage.getItem("uleam_config")
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig))
    }
  }

  const loadStats = () => {
    const usuarios = JSON.parse(localStorage.getItem("uleam_users") || "[]")
    const publicaciones = JSON.parse(localStorage.getItem("uleam_publicaciones") || "[]")
    const proyectos = JSON.parse(localStorage.getItem("uleam_proyectos") || "[]")

    setStats({
      totalUsuarios: usuarios.length,
      totalPublicaciones: publicaciones.length,
      totalProyectos: proyectos.length,
    })
  }

  const handleConfigChange = (key, value) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    localStorage.setItem("uleam_config", JSON.stringify(newConfig))
    alert("Configuración guardada")
  }

  const handleBackup = () => {
    const data = {
      usuarios: JSON.parse(localStorage.getItem("uleam_users") || "[]"),
      publicaciones: JSON.parse(localStorage.getItem("uleam_publicaciones") || "[]"),
      proyectos: JSON.parse(localStorage.getItem("uleam_proyectos") || "[]"),
      fecha: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(data, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `backup_uleam.json`
    link.click()
    alert("Backup descargado")
  }

  const handleRestore = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)

        if (confirm("¿Restaurar backup? Se perderán los datos actuales.")) {
          localStorage.setItem("uleam_users", JSON.stringify(data.usuarios || []))
          localStorage.setItem("uleam_publicaciones", JSON.stringify(data.publicaciones || []))
          localStorage.setItem("uleam_proyectos", JSON.stringify(data.proyectos || []))
          alert("Backup restaurado. La página se recargará.")
          window.location.reload()
        }
      } catch (error) {
        alert("Error al leer el archivo")
      }
    }
    reader.readAsText(file)
  }

  const handleClearData = () => {
    if (confirm("¿Eliminar todos los datos? Esta acción no se puede deshacer.")) {
      if (confirm("¿Estás seguro? Se eliminarán TODOS los datos.")) {
        localStorage.removeItem("uleam_users")
        localStorage.removeItem("uleam_publicaciones")
        localStorage.removeItem("uleam_proyectos")
        alert("Datos eliminados. La página se recargará.")
        window.location.reload()
      }
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Configuración</h1>
        <p className="page-subtitle">Configuración básica del sistema</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalUsuarios}</div>
          <div className="stat-label">Usuarios</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalPublicaciones}</div>
          <div className="stat-label">Publicaciones</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalProyectos}</div>
          <div className="stat-label">Proyectos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">v{config.version}</div>
          <div className="stat-label">Versión</div>
        </div>
      </div>

      {/* Basic Configuration */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <div className="card-header">
          <h2 className="card-title">Configuración Básica</h2>
        </div>
        <div className="card-content">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nombre del Sistema</label>
              <input
                type="text"
                className="form-input"
                value={config.nombreSistema}
                onChange={(e) => handleConfigChange("nombreSistema", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Versión</label>
              <input
                type="text"
                className="form-input"
                value={config.version}
                onChange={(e) => handleConfigChange("version", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  checked={config.mantenimiento}
                  onChange={(e) => handleConfigChange("mantenimiento", e.target.checked)}
                />
                Modo Mantenimiento
              </label>
              <small style={{ color: "#666" }}>Solo administradores pueden acceder</small>
            </div>

            <div className="form-group">
              <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  checked={config.registroAbierto}
                  onChange={(e) => handleConfigChange("registroAbierto", e.target.checked)}
                />
                Permitir Registro
              </label>
              <small style={{ color: "#666" }}>Nuevos usuarios pueden registrarse</small>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Gestión de Datos</h2>
        </div>
        <div className="card-content">
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={handleBackup}>
              Descargar Backup
            </button>

            <div>
              <input
                type="file"
                accept=".json"
                onChange={handleRestore}
                style={{ display: "none" }}
                id="restore-file"
              />
              <label htmlFor="restore-file" className="btn btn-secondary" style={{ cursor: "pointer" }}>
                Restaurar Backup
              </label>
            </div>

            <button className="btn btn-danger" onClick={handleClearData}>
              Eliminar Todos los Datos
            </button>
          </div>

          <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
            <h4 style={{ margin: "0 0 10px 0" }}>Información</h4>
            <ul style={{ margin: "0", paddingLeft: "20px" }}>
              <li>Backup: Descarga todos los datos en un archivo JSON</li>
              <li>Restaurar: Carga datos desde un archivo de backup</li>
              <li>Eliminar: Borra permanentemente todos los datos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfiguracionSistema
