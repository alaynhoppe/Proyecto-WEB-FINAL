"use client"

import { useState, useEffect } from "react"

const ExplorarInvestigadores = ({ user }) => {
  const [investigadores, setInvestigadores] = useState([])
  const [filteredInvestigadores, setFilteredInvestigadores] = useState([])
  const [filters, setFilters] = useState({
    nombre: "",
    facultad: "",
    especialidad: "",
  })
  const [stats, setStats] = useState({
    totalInvestigadores: 0,
    porFacultad: {},
    porEspecialidad: {},
  })

  useEffect(() => {
    const usuarios = JSON.parse(localStorage.getItem("uleam_users") || "[]")
    const publicaciones = JSON.parse(localStorage.getItem("uleam_publicaciones") || "[]")
    const proyectos = JSON.parse(localStorage.getItem("uleam_proyectos") || "[]")

    const investigadoresData = usuarios
      .filter((u) => u.userType === "investigador")
      .map((investigador) => {
        const misPublicaciones = publicaciones.filter((p) => p.autorId === investigador.id)
        const misProyectos = proyectos.filter((p) => p.autorId === investigador.id)

        return {
          ...investigador,
          totalPublicaciones: misPublicaciones.length,
          totalProyectos: misProyectos.length,
          publicacionesRecientes: misPublicaciones.slice(-3).reverse(),
          proyectosRecientes: misProyectos.slice(-3).reverse(),
        }
      })

    setInvestigadores(investigadoresData)
    setFilteredInvestigadores(investigadoresData)

    // Calcular estadísticas
    const porFacultad = {}
    const porEspecialidad = {}

    investigadoresData.forEach((inv) => {
      porFacultad[inv.facultad] = (porFacultad[inv.facultad] || 0) + 1
      if (inv.especialidad) {
        porEspecialidad[inv.especialidad] = (porEspecialidad[inv.especialidad] || 0) + 1
      }
    })

    setStats({
      totalInvestigadores: investigadoresData.length,
      porFacultad,
      porEspecialidad,
    })
  }, [])

  useEffect(() => {
    let filtered = investigadores

    if (filters.nombre) {
      filtered = filtered.filter((inv) =>
        `${inv.nombres} ${inv.apellidos}`.toLowerCase().includes(filters.nombre.toLowerCase()),
      )
    }

    if (filters.facultad) {
      filtered = filtered.filter((inv) => inv.facultad === filters.facultad)
    }

    if (filters.especialidad) {
      filtered = filtered.filter((inv) => inv.especialidad && inv.especialidad.includes(filters.especialidad))
    }

    setFilteredInvestigadores(filtered)
  }, [filters, investigadores])

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
        <h1 className="page-title">Red de Investigadores ULEAM</h1>
        <p className="page-subtitle">Conecta con investigadores de todas las facultades</p>
      </div>

      {/* Estadísticas */}
      <div className="stats-grid mb-20">
        <div className="stat-card" style={{ borderLeft: "4px solid #059669" }}>
          <div className="stat-number">{stats.totalInvestigadores}</div>
          <div className="stat-label">Total Investigadores</div>
          <small style={{ color: "#666", fontSize: "12px" }}>Activos en el sistema</small>
        </div>

        <div className="stat-card" style={{ borderLeft: "4px solid #d97706" }}>
          <div className="stat-number">{Object.keys(stats.porFacultad).length}</div>
          <div className="stat-label">Facultades Representadas</div>
          <small style={{ color: "#666", fontSize: "12px" }}>Diversidad académica</small>
        </div>

        <div className="stat-card" style={{ borderLeft: "4px solid #dc2626" }}>
          <div className="stat-number">{investigadores.reduce((total, inv) => total + inv.totalPublicaciones, 0)}</div>
          <div className="stat-label">Publicaciones Totales</div>
          <small style={{ color: "#666", fontSize: "12px" }}>Producción científica</small>
        </div>

        <div className="stat-card" style={{ borderLeft: "4px solid #2563eb" }}>
          <div className="stat-number">{investigadores.reduce((total, inv) => total + inv.totalProyectos, 0)}</div>
          <div className="stat-label">Proyectos Activos</div>
          <small style={{ color: "#666", fontSize: "12px" }}>Investigación en curso</small>
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
                placeholder="Nombre del investigador"
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

      {/* Lista de Investigadores */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Investigadores Encontrados ({filteredInvestigadores.length})</h2>
        </div>
        <div className="card-content">
          {filteredInvestigadores.length > 0 ? (
            <div className="investigators-grid">
              {filteredInvestigadores.map((investigador) => (
                <div key={investigador.id} className="investigator-card">
                  <div className="investigator-header">
                    <div className="investigator-photo">
                      {investigador.fotoPerfil ? (
                        <img
                          src={investigador.fotoPerfil || "/placeholder.svg"}
                          alt={`${investigador.nombres} ${investigador.apellidos}`}
                          className="profile-photo-small"
                        />
                      ) : (
                        <div className="profile-placeholder-small">
                          {getInitials(investigador.nombres, investigador.apellidos)}
                        </div>
                      )}
                    </div>
                    <div className="investigator-info">
                      <h3 className="investigator-name">
                        {investigador.nombres} {investigador.apellidos}
                      </h3>
                      <p className="investigator-email">{investigador.email}</p>
                      {investigador.descripcionPersonal && (
                        <p className="investigator-description">{investigador.descripcionPersonal}</p>
                      )}
                    </div>
                  </div>

                  <div className="investigator-details">
                    <div className="detail-item">
                      <strong>Facultad:</strong>
                      <span>{getFacultadLabel(investigador.facultad)}</span>
                    </div>

                    {investigador.especialidad && (
                      <div className="detail-item">
                        <strong>Especialidad:</strong>
                        <span>{investigador.especialidad}</span>
                      </div>
                    )}

                    {investigador.gradoAcademico && (
                      <div className="detail-item">
                        <strong>Grado Académico:</strong>
                        <span>{investigador.gradoAcademico}</span>
                      </div>
                    )}

                    <div className="detail-item">
                      <strong>Teléfono:</strong>
                      <span>{investigador.telefono}</span>
                    </div>
                  </div>

                  <div className="investigator-stats">
                    <div className="stat-item">
                      <span className="stat-number">{investigador.totalPublicaciones}</span>
                      <span className="stat-label">Publicaciones</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{investigador.totalProyectos}</span>
                      <span className="stat-label">Proyectos</span>
                    </div>
                  </div>

                  {investigador.publicacionesRecientes.length > 0 && (
                    <div className="recent-work">
                      <h4>Publicaciones Recientes:</h4>
                      <ul>
                        {investigador.publicacionesRecientes.slice(0, 2).map((pub, index) => (
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
              <p>No se encontraron investigadores con los filtros aplicados.</p>
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

export default ExplorarInvestigadores
