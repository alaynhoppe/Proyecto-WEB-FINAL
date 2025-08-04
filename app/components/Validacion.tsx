"use client"

import { useState, useEffect } from "react"

const Validacion = ({ user }) => {
  const [publicacionesPendientes, setPublicacionesPendientes] = useState([])
  const [proyectosPendientes, setProyectosPendientes] = useState([])
  const [activeTab, setActiveTab] = useState("publicaciones")

  useEffect(() => {
    loadPendingItems()
  }, [])

  const loadPendingItems = () => {
    const publicaciones = JSON.parse(localStorage.getItem("uleam_publicaciones") || "[]")
    const proyectos = JSON.parse(localStorage.getItem("uleam_proyectos") || "[]")

    setPublicacionesPendientes(publicaciones.filter((p) => p.validado === undefined || p.validado === null))
    setProyectosPendientes(proyectos.filter((p) => p.validado === undefined || p.validado === null))
  }

  const handleValidatePublication = (id, isValid) => {
    const publicaciones = JSON.parse(localStorage.getItem("uleam_publicaciones") || "[]")
    const index = publicaciones.findIndex((p) => p.id === id)

    if (index !== -1) {
      publicaciones[index].validado = isValid
      publicaciones[index].fechaValidacion = new Date().toISOString()
      publicaciones[index].validadoPor = user.nombres + " " + user.apellidos

      localStorage.setItem("uleam_publicaciones", JSON.stringify(publicaciones))
      loadPendingItems()
      alert(isValid ? "Publicación validada" : "Publicación rechazada")
    }
  }

  const handleValidateProject = (id, isValid) => {
    const proyectos = JSON.parse(localStorage.getItem("uleam_proyectos") || "[]")
    const index = proyectos.findIndex((p) => p.id === id)

    if (index !== -1) {
      proyectos[index].validado = isValid
      proyectos[index].fechaValidacion = new Date().toISOString()
      proyectos[index].validadoPor = user.nombres + " " + user.apellidos

      localStorage.setItem("uleam_proyectos", JSON.stringify(proyectos))
      loadPendingItems()
      alert(isValid ? "Proyecto validado" : "Proyecto rechazado")
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Validación de Contenido</h1>
        <p className="page-subtitle">Revisa y valida publicaciones y proyectos</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{publicacionesPendientes.length}</div>
          <div className="stat-label">Publicaciones Pendientes</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{proyectosPendientes.length}</div>
          <div className="stat-label">Proyectos Pendientes</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{publicacionesPendientes.length + proyectosPendientes.length}</div>
          <div className="stat-label">Total Pendientes</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {JSON.parse(localStorage.getItem("uleam_publicaciones") || "[]").filter((p) => p.validado === true).length +
              JSON.parse(localStorage.getItem("uleam_proyectos") || "[]").filter((p) => p.validado === true).length}
          </div>
          <div className="stat-label">Total Validados</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <div className="card-content">
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              className={`btn ${activeTab === "publicaciones" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setActiveTab("publicaciones")}
            >
              Publicaciones ({publicacionesPendientes.length})
            </button>
            <button
              className={`btn ${activeTab === "proyectos" ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setActiveTab("proyectos")}
            >
              Proyectos ({proyectosPendientes.length})
            </button>
          </div>
        </div>
      </div>

      {/* Publications Tab */}
      {activeTab === "publicaciones" && (
        <div>
          {publicacionesPendientes.length === 0 ? (
            <div className="card">
              <div className="card-content">
                <div className="empty-state">
                  <p>No hay publicaciones pendientes de validación.</p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {publicacionesPendientes.map((pub) => (
                <div key={pub.id} className="card">
                  <div className="card-header">
                    <h3 className="card-title">{pub.titulo}</h3>
                    <p className="card-subtitle">Por: {pub.autorNombre}</p>
                  </div>
                  <div className="card-content">
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Autores</label>
                        <div>{pub.autores}</div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Tipo</label>
                        <span className="badge badge-info">{pub.tipo}</span>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Año</label>
                        <div>{pub.año}</div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">DOI</label>
                        <div>{pub.doi || "No especificado"}</div>
                      </div>
                    </div>

                    {pub.resumen && (
                      <div className="form-group" style={{ marginTop: "20px" }}>
                        <label className="form-label">Resumen</label>
                        <div style={{ padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
                          {pub.resumen}
                        </div>
                      </div>
                    )}

                    <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                      <button className="btn btn-danger" onClick={() => handleValidatePublication(pub.id, false)}>
                        Rechazar
                      </button>
                      <button className="btn btn-success" onClick={() => handleValidatePublication(pub.id, true)}>
                        Validar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === "proyectos" && (
        <div>
          {proyectosPendientes.length === 0 ? (
            <div className="card">
              <div className="card-content">
                <div className="empty-state">
                  <p>No hay proyectos pendientes de validación.</p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {proyectosPendientes.map((proyecto) => (
                <div key={proyecto.id} className="card">
                  <div className="card-header">
                    <h3 className="card-title">{proyecto.nombre}</h3>
                    <p className="card-subtitle">Por: {proyecto.autorNombre}</p>
                  </div>
                  <div className="card-content">
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Autor Principal</label>
                        <div>{proyecto.autorPrincipal}</div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Duración</label>
                        <div>{proyecto.duracion}</div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Estado</label>
                        <span className="badge badge-warning">{proyecto.estado}</span>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Financiamiento</label>
                        <span className="badge badge-info">{proyecto.tipoFinanciamiento}</span>
                      </div>
                    </div>

                    {proyecto.objetivos && (
                      <div className="form-group" style={{ marginTop: "20px" }}>
                        <label className="form-label">Objetivos</label>
                        <div style={{ padding: "10px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
                          {proyecto.objetivos}
                        </div>
                      </div>
                    )}

                    <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                      <button className="btn btn-danger" onClick={() => handleValidateProject(proyecto.id, false)}>
                        Rechazar
                      </button>
                      <button className="btn btn-success" onClick={() => handleValidateProject(proyecto.id, true)}>
                        Validar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Validacion
