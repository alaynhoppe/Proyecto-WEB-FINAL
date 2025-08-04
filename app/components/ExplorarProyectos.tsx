"use client"

import { useState, useEffect } from "react"

const ExplorarProyectos = ({ user }) => {
  const [proyectos, setProyectos] = useState([])
  const [filteredProyectos, setFilteredProyectos] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    tipo: "",
    estado: "",
    año: "",
    userRole: "",
  })

  useEffect(() => {
    loadProyectos()
  }, [])

  useEffect(() => {
    filterProyectos()
  }, [proyectos, searchTerm, filters])

  const loadProyectos = () => {
    // Cargar TODOS los proyectos para explorar
    const allProyectos = JSON.parse(localStorage.getItem("uleam_proyectos") || "[]")
    setProyectos(allProyectos)
  }

  const filterProyectos = () => {
    let filtered = proyectos

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.autorPrincipal.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.autorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.tutor && p.tutor.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (p.palabrasClave && p.palabrasClave.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (filters.tipo) {
      filtered = filtered.filter((p) => p.tipo === filters.tipo)
    }

    if (filters.estado) {
      filtered = filtered.filter((p) => p.estado === filters.estado)
    }

    if (filters.año) {
      filtered = filtered.filter((p) => new Date(p.fechaInicio).getFullYear().toString() === filters.año)
    }

    if (filters.userRole) {
      filtered = filtered.filter((p) => p.userRole === filters.userRole)
    }

    setFilteredProyectos(filtered)
  }

  const getAllProjectTypes = () => {
    return [
      // Tipos de estudiantes
      { value: "tesis", label: "Tesis de Grado" },
      { value: "trabajo_grado", label: "Trabajo de Grado" },
      { value: "informe_practicas", label: "Informe de Prácticas" },
      { value: "proyecto_vinculacion", label: "Proyecto de Vinculación" },
      { value: "ensayo", label: "Ensayo Académico" },
      { value: "monografia", label: "Monografía" },
      // Tipos de docentes/investigadores
      { value: "investigacion", label: "Proyecto de Investigación" },
      { value: "desarrollo", label: "Proyecto de Desarrollo" },
      { value: "innovacion", label: "Proyecto de Innovación" },
      { value: "extension", label: "Proyecto de Extensión" },
      { value: "consultoria", label: "Consultoría" },
    ]
  }

  const getAllProjectStates = () => {
    return [
      { value: "planificacion", label: "En Planificación" },
      { value: "desarrollo", label: "En Desarrollo" },
      { value: "revision", label: "En Revisión" },
      { value: "defensa", label: "Listo para Defensa" },
      { value: "ejecucion", label: "En Ejecución" },
      { value: "finalizado", label: "Finalizado" },
      { value: "suspendido", label: "Suspendido" },
    ]
  }

  const getUniqueYears = () => {
    const years = [...new Set(proyectos.map((p) => new Date(p.fechaInicio).getFullYear()))].sort((a, b) => b - a)
    return years
  }

  const getUserRoles = () => {
    return [
      { value: "estudiante", label: "Estudiante" },
      { value: "docente", label: "Docente" },
      { value: "investigador", label: "Investigador" },
    ]
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Explorar Proyectos</h1>
        <p className="page-subtitle">Busca y analiza proyectos académicos y de investigación de la comunidad ULEAM</p>
      </div>

      {/* Search and Filters */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por nombre, autor, tutor o palabras clave..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="filter-select"
          value={filters.tipo}
          onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
        >
          <option value="">Todos los tipos</option>
          {getAllProjectTypes().map((tipo) => (
            <option key={tipo.value} value={tipo.value}>
              {tipo.label}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={filters.estado}
          onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
        >
          <option value="">Todos los estados</option>
          {getAllProjectStates().map((estado) => (
            <option key={estado.value} value={estado.value}>
              {estado.label}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={filters.userRole}
          onChange={(e) => setFilters({ ...filters, userRole: e.target.value })}
        >
          <option value="">Todos los roles</option>
          {getUserRoles().map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={filters.año}
          onChange={(e) => setFilters({ ...filters, año: e.target.value })}
        >
          <option value="">Todos los años</option>
          {getUniqueYears().map((año) => (
            <option key={año} value={año}>
              {año}
            </option>
          ))}
        </select>
      </div>

      {/* Statistics */}
      <div className="stats-container" style={{ marginBottom: "20px" }}>
        <div className="stat-card">
          <div className="stat-number">{filteredProyectos.length}</div>
          <div className="stat-label">Proyectos encontrados</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{filteredProyectos.filter((p) => p.validado).length}</div>
          <div className="stat-label">Validados</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{filteredProyectos.filter((p) => p.estado === "finalizado").length}</div>
          <div className="stat-label">Finalizados</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{filteredProyectos.filter((p) => p.userRole === "estudiante").length}</div>
          <div className="stat-label">Académicos</div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="publications-grid">
        {filteredProyectos.map((proyecto) => (
          <div key={proyecto.id} className="publication-card">
            <div className="publication-header">
              <h3>{proyecto.nombre}</h3>
              <div style={{ display: "flex", gap: "5px" }}>
                <span className={`status ${proyecto.validado ? "validated" : "pending"}`}>
                  {proyecto.validado ? "Validado" : "Pendiente"}
                </span>
                <span className={`badge badge-${proyecto.userRole === "estudiante" ? "success" : "info"}`}>
                  {proyecto.userRole === "estudiante" ? "Académico" : "Investigación"}
                </span>
              </div>
            </div>
            <div className="publication-content">
              <p>
                <strong>Tipo:</strong>{" "}
                {getAllProjectTypes().find((t) => t.value === proyecto.tipo)?.label || proyecto.tipo}
              </p>
              <p>
                <strong>Autor Principal:</strong> {proyecto.autorPrincipal}
              </p>
              <p>
                <strong>Responsable:</strong> {proyecto.autorNombre}
              </p>
              {proyecto.tutor && (
                <p>
                  <strong>Tutor:</strong> {proyecto.tutor}
                </p>
              )}
              {proyecto.carrera && (
                <p>
                  <strong>Carrera:</strong> {proyecto.carrera}
                </p>
              )}
              <p>
                <strong>Estado:</strong>{" "}
                {getAllProjectStates().find((e) => e.value === proyecto.estado)?.label || proyecto.estado}
              </p>
              <p>
                <strong>Fecha Inicio:</strong> {new Date(proyecto.fechaInicio).toLocaleDateString("es-ES")}
              </p>
              {proyecto.palabrasClave && (
                <p>
                  <strong>Palabras Clave:</strong> {proyecto.palabrasClave}
                </p>
              )}
              {proyecto.objetivos && (
                <div style={{ marginTop: "10px" }}>
                  <strong>Objetivos:</strong>
                  <p style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
                    {proyecto.objetivos.length > 150
                      ? `${proyecto.objetivos.substring(0, 150)}...`
                      : proyecto.objetivos}
                  </p>
                </div>
              )}
            </div>
            <div className="publication-actions">
              <button className="btn btn-info">Ver Detalles</button>
              {proyecto.archivoUrl && <button className="btn btn-secondary">Descargar</button>}
              <button className="btn btn-outline">Contactar Autor</button>
            </div>
          </div>
        ))}
      </div>

      {filteredProyectos.length === 0 && (
        <div className="empty-state">
          <p>No se encontraron proyectos que coincidan con los criterios de búsqueda.</p>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "10px" }}>
            Intenta ajustar los filtros o términos de búsqueda.
          </p>
        </div>
      )}
    </div>
  )
}

export default ExplorarProyectos
