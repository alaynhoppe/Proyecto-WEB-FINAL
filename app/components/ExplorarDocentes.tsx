"use client"

import { useState, useEffect } from "react"

const ExplorarDocentes = ({ user }) => {
  const [docentes, setDocentes] = useState([])
  const [filteredDocentes, setFilteredDocentes] = useState([])
  const [filters, setFilters] = useState({
    nombre: "",
    facultad: "",
    especialidad: "",
  })
  const [stats, setStats] = useState({
    totalDocentes: 0,
    porFacultad: {},
    porEspecialidad: {},
  })

  useEffect(() => {
    const usuarios = JSON.parse(localStorage.getItem("uleam_users") || "[]")
    const publicaciones = JSON.parse(localStorage.getItem("uleam_publicaciones") || "[]")
    const proyectos = JSON.parse(localStorage.getItem("uleam_proyectos") || "[]")

    const docentesData = usuarios
      .filter((u) => u.userType === "docente")
      .map((docente) => {
        const misPublicaciones = publicaciones.filter((p) => p.autorId === docente.id)
        const misProyectos = proyectos.filter((p) => p.autorId === docente.id)

        return {
          ...docente,
          totalPublicaciones: misPublicaciones.length,
          totalProyectos: misProyectos.length,
          publicacionesRecientes: misPublicaciones.slice(-3).reverse(),
          proyectosRecientes: misProyectos.slice(-3).reverse(),
        }
      })

    setDocentes(docentesData)
    setFilteredDocentes(docentesData)

    // Calcular estadísticas
    const porFacultad = {}
    const porEspecialidad = {}

    docentesData.forEach((doc) => {
      porFacultad[doc.facultad] = (porFacultad[doc.facultad] || 0) + 1
      if (doc.especialidad) {
        porEspecialidad[doc.especialidad] = (porEspecialidad[doc.especialidad] || 0) + 1
      }
    })

    setStats({
      totalDocentes: docentesData.length,
      porFacultad,
      porEspecialidad,
    })
  }, [])

  useEffect(() => {
    let filtered = docentes

    if (filters.nombre) {
      filtered = filtered.filter((doc) =>
        `${doc.nombres} ${doc.apellidos}`.toLowerCase().includes(filters.nombre.toLowerCase()),
      )
    }

    if (filters.facultad) {
      filtered = filtered.filter((doc) => doc.facultad === filters.facultad)
    }

    if (filters.especialidad) {
      filtered = filtered.filter((doc) => doc.especialidad && doc.especialidad.includes(filters.especialidad))
    }

    setFilteredDocentes(filtered)
  }, [filters, docentes])

  const clearFilters = () => {
    setFilters({ nombre: "", facultad: "", especialidad: "" })
  }

  const getFacultadLabel = (facultad) => {
    const labels = {
      "ciencias-vida-tecnologias": "Ciencias de la Vida y Tecnologías",
      "ciencias-salud": "Ciencias de la Salud",
      "ciencias-sociales-derecho-bienestar": "Ciencias Sociales Derecho y Bienestar",
      "ciencias-administrativas-contables-comercio": "Ciencias Administrativas, Contables y Comercio",
      "educacion-turismo-artes-humanidades": "Educación Turismo Artes y Humanidades",
      "ingenieria-industria-arquitectura": "Ingeniería, Industria y Arquitectura",
    }
    return labels[facultad] || facultad
  }

  const getInitials = (nombres, apellidos) => {
    const firstInitial = nombres ? nombres.charAt(0).toUpperCase() : ""
    const lastInitial = apellidos ? apellidos.charAt(0).toUpperCase() : ""
    return firstInitial + lastInitial
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Cuerpo Docente ULEAM</h1>
        <p className="page-subtitle">Conoce a los docentes e investigadores de la universidad</p>
      </div>

      {/* Estadísticas */}
      <div className="stats-grid mb-20">
        <div className="stat-card" style={{ borderLeft: "4px solid #059669" }}>
          <div className="stat-number">{stats.totalDocentes}</div>
          <div className="stat-label">Total Docentes</div>
          <small style={{ color: "#666", fontSize: "12px" }}>Activos en el sistema</small>
        </div>

        <div className="stat-card" style={{ borderLeft: "4px solid #d97706" }}>
          <div className="stat-number">{Object.keys(stats.porFacultad).length}</div>
          <div className="stat-label">Facultades Representadas</div>
          <small style={{ color: "#666", fontSize: "12px" }}>Diversidad académica</small>
        </div>

        <div className="stat-card" style={{ borderLeft: "4px solid #dc2626" }}>
          <div className="stat-number">{docentes.reduce((total, doc) => total + doc.totalPublicaciones, 0)}</div>
          <div className="stat-label">Publicaciones Totales</div>
          <small style={{ color: "#666", fontSize: "12px" }}>Producción académica</small>
        </div>

        <div className="stat-card" style={{ borderLeft: "4px solid #2563eb" }}>
          <div className="stat-number">{docentes.reduce((total, doc) => total + doc.totalProyectos, 0)}</div>
          <div className="stat-label">Proyectos Activos</div>
          <small style={{ color: "#666", fontSize: "12px" }}>Investigación docente</small>
        </div>
      </div>

      {/* Filtros */}
      <div className="card mb-20">
        <div className="card-header">
          <h2 className="card-title">Filtros de Búsqueda</h2>
          <button className="btn btn-secondary" onClick={clearFilters}>
            Limpiar Filtros
          </button>
        </div>
        <div className="card-content">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Buscar por nombre</label>
              <input
                type="text"
                className="form-input"
                placeholder="Nombre del docente"
                value={filters.nombre}
                onChange={(e) => setFilters({ ...filters, nombre: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Facultad</label>
              <select
                className="form-input"
                value={filters.facultad}
                onChange={(e) => setFilters({ ...filters, facultad: e.target.value })}
              >
                <option value="">Todas las facultades</option>
                <option value="ciencias-vida-tecnologias">Ciencias de la Vida y Tecnologías</option>
                <option value="ciencias-salud">Ciencias de la Salud</option>
                <option value="ciencias-sociales-derecho-bienestar">Ciencias Sociales Derecho y Bienestar</option>
                <option value="ciencias-administrativas-contables-comercio">
                  Ciencias Administrativas, Contables y Comercio
                </option>
                <option value="educacion-turismo-artes-humanidades">Educación Turismo Artes y Humanidades</option>
                <option value="ingenieria-industria-arquitectura">Ingeniería, Industria y Arquitectura</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Especialidad</label>
              <input
                type="text"
                className="form-input"
                placeholder="Área de especialización"
                value={filters.especialidad}
                onChange={(e) => setFilters({ ...filters, especialidad: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Docentes */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Docentes Encontrados ({filteredDocentes.length})</h2>
        </div>
        <div className="card-content">
          {filteredDocentes.length > 0 ? (
            <div className="investigators-grid">
              {filteredDocentes.map((docente) => (
                <div key={docente.id} className="investigator-card">
                  <div className="investigator-header">
                    <div className="investigator-photo">
                      {docente.fotoPerfil ? (
                        <img
                          src={docente.fotoPerfil || "/placeholder.svg"}
                          alt={`${docente.nombres} ${docente.apellidos}`}
                          className="profile-photo-small"
                        />
                      ) : (
                        <div className="profile-placeholder-small">
                          {getInitials(docente.nombres, docente.apellidos)}
                        </div>
                      )}
                    </div>
                    <div className="investigator-info">
                      <h3 className="investigator-name">
                        {docente.nombres} {docente.apellidos}
                      </h3>
                      <p className="investigator-email">{docente.email}</p>
                      {docente.descripcionPersonal && (
                        <p className="investigator-description">{docente.descripcionPersonal}</p>
                      )}
                    </div>
                  </div>

                  <div className="investigator-details">
                    <div className="detail-item">
                      <strong>Facultad:</strong>
                      <span>{getFacultadLabel(docente.facultad)}</span>
                    </div>

                    {docente.especialidad && (
                      <div className="detail-item">
                        <strong>Especialidad:</strong>
                        <span>{docente.especialidad}</span>
                      </div>
                    )}

                    {docente.gradoAcademico && (
                      <div className="detail-item">
                        <strong>Grado Académico:</strong>
                        <span>{docente.gradoAcademico}</span>
                      </div>
                    )}

                    <div className="detail-item">
                      <strong>Teléfono:</strong>
                      <span>{docente.telefono}</span>
                    </div>
                  </div>

                  <div className="investigator-stats">
                    <div className="stat-item">
                      <span className="stat-number">{docente.totalPublicaciones}</span>
                      <span className="stat-label">Publicaciones</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{docente.totalProyectos}</span>
                      <span className="stat-label">Proyectos</span>
                    </div>
                  </div>

                  {docente.publicacionesRecientes.length > 0 && (
                    <div className="recent-work">
                      <h4>Publicaciones Recientes:</h4>
                      <ul>
                        {docente.publicacionesRecientes.slice(0, 2).map((pub, index) => (
                          <li key={index}>
                            <strong>{pub.titulo}</strong>
                            <small> ({pub.fechaPublicacion})</small>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No se encontraron docentes con los filtros aplicados.</p>
              <button className="btn btn-primary" onClick={clearFilters}>
                Mostrar Todos
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExplorarDocentes
