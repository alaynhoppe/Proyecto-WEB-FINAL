"use client"

import { useState, useEffect } from "react"

const PanelPrincipal = ({ user, onNavigate }) => {
  const [stats, setStats] = useState({
    totalPublicaciones: 0,
    totalProyectos: 0,
    publicacionesPendientes: 0,
    proyectosPendientes: 0,
    totalInvestigadores: 0,
    publicacionesRecientes: [],
    proyectosRecientes: [],
  })

  const [searchFilters, setSearchFilters] = useState({
    publicacionTitulo: "",
    revistaNombre: "",
    articuloTitulo: "",
    tipoArticulo: "",
    doi: "",
    issn: "",
    isbn: "",
    fecha: "",
  })

  const [searchResults, setSearchResults] = useState({
    publicaciones: [],
    proyectos: [],
    revistas: [],
    articulos: [],
  })

  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const publicaciones = JSON.parse(localStorage.getItem("uleam_publicaciones") || "[]")
    const proyectos = JSON.parse(localStorage.getItem("uleam_proyectos") || "[]")
    const usuarios = JSON.parse(localStorage.getItem("uleam_users") || "[]")

    if (user.role === "admin") {
      setStats({
        totalPublicaciones: publicaciones.length,
        totalProyectos: proyectos.length,
        publicacionesPendientes: publicaciones.filter((p) => !p.validado).length,
        proyectosPendientes: proyectos.filter((p) => !p.validado).length,
        totalInvestigadores: usuarios.length,
        publicacionesRecientes: publicaciones.slice(-3).reverse(),
        proyectosRecientes: proyectos.slice(-3).reverse(),
      })
    } else {
      const misPublicaciones = publicaciones.filter((p) => p.autorId === user.id)
      const misProyectos = proyectos.filter((p) => p.autorId === user.id)

      setStats({
        totalPublicaciones: misPublicaciones.length,
        totalProyectos: misProyectos.length,
        publicacionesPendientes: misPublicaciones.filter((p) => !p.validado).length,
        proyectosPendientes: misProyectos.filter((p) => !p.validado).length,
        totalInvestigadores: usuarios.length,
        publicacionesRecientes: misPublicaciones.slice(-3).reverse(),
        proyectosRecientes: misProyectos.slice(-3).reverse(),
      })
    }
  }, [user])

  const getUserWelcome = () => {
    switch (user.role) {
      case "estudiante":
        return "Bienvenido estudiante. Aquí puedes registrar tus trabajos de investigación y tesis."
      case "docente":
        return "Bienvenido docente. Gestiona tus publicaciones académicas y proyectos de investigación."
      case "investigador":
        return "Bienvenido investigador. Administra toda tu producción científica."
      case "admin":
        return "Panel de administración del sistema de producción científica ULEAM."
      default:
        return "Bienvenido al sistema de producción científica ULEAM."
    }
  }

  const handleSearchDocumentos = () => {
    if (!searchFilters.publicacionTitulo.trim()) {
      alert("Por favor ingrese un título para buscar")
      return
    }

    const publicaciones = JSON.parse(localStorage.getItem("uleam_publicaciones") || "[]")
    const resultados = publicaciones
      .filter((p) => p.titulo.toLowerCase().includes(searchFilters.publicacionTitulo.toLowerCase()))
      .slice(0, 10)

    setSearchResults((prev) => ({ ...prev, publicaciones: resultados }))
    setShowResults(true)
  }

  const handleSearchRevistas = () => {
    if (!searchFilters.revistaNombre.trim()) {
      alert("Por favor ingrese un nombre de revista para buscar")
      return
    }

    const publicaciones = JSON.parse(localStorage.getItem("uleam_publicaciones") || "[]")
    const resultados = publicaciones
      .filter((p) => p.revista && p.revista.toLowerCase().includes(searchFilters.revistaNombre.toLowerCase()))
      .slice(0, 10)

    setSearchResults((prev) => ({ ...prev, revistas: resultados }))
    setShowResults(true)
  }

  const handleSearchArticulos = () => {
    if (!searchFilters.articuloTitulo.trim()) {
      alert("Por favor ingrese un título de artículo para buscar")
      return
    }

    const publicaciones = JSON.parse(localStorage.getItem("uleam_publicaciones") || "[]")
    let resultados = publicaciones.filter((p) =>
      p.titulo.toLowerCase().includes(searchFilters.articuloTitulo.toLowerCase()),
    )

    if (searchFilters.tipoArticulo) {
      resultados = resultados.filter((p) => p.tipo === searchFilters.tipoArticulo)
    }

    setSearchResults((prev) => ({ ...prev, articulos: resultados.slice(0, 10) }))
    setShowResults(true)
  }

  const handleAdvancedSearch = () => {
    const publicaciones = JSON.parse(localStorage.getItem("uleam_publicaciones") || "[]")
    let resultados = publicaciones

    if (searchFilters.doi) {
      resultados = resultados.filter((p) => p.doi && p.doi.toLowerCase().includes(searchFilters.doi.toLowerCase()))
    }
    if (searchFilters.issn) {
      resultados = resultados.filter((p) => p.issn && p.issn.toLowerCase().includes(searchFilters.issn.toLowerCase()))
    }
    if (searchFilters.isbn) {
      resultados = resultados.filter((p) => p.isbn && p.isbn.toLowerCase().includes(searchFilters.isbn.toLowerCase()))
    }
    if (searchFilters.fecha) {
      resultados = resultados.filter((p) => p.fechaPublicacion && p.fechaPublicacion.includes(searchFilters.fecha))
    }

    setSearchResults((prev) => ({ ...prev, publicaciones: resultados.slice(0, 10) }))
    setShowResults(true)
  }

  const clearSearch = () => {
    setSearchFilters({
      publicacionTitulo: "",
      revistaNombre: "",
      articuloTitulo: "",
      tipoArticulo: "",
      doi: "",
      issn: "",
      isbn: "",
      fecha: "",
    })
    setSearchResults({ publicaciones: [], proyectos: [], revistas: [], articulos: [] })
    setShowResults(false)
  }

  const getAvailableActions = () => {
    const actions = []

    // Acciones según el rol
    if (user.role === "docente" || user.role === "investigador") {
      actions.push({
        title: "Nueva Publicación",
        description: "Registrar artículo, libro o trabajo académico",
        action: "mis-publicaciones",
        color: "btn-primary",
      })
    }

    if (user.role === "estudiante") {
      actions.push({
        title: "Nuevo Trabajo",
        description: "Registrar tesis o trabajo de investigación",
        action: "mis-proyectos",
        color: "btn-primary",
      })
    }

    if (user.role === "docente" || user.role === "investigador") {
      actions.push({
        title: "Nuevo Proyecto",
        description: "Registrar proyecto de investigación",
        action: "mis-proyectos",
        color: "btn-success",
      })
    }

    // Todos pueden explorar
    actions.push({
      title: "Explorar Publicaciones",
      description: "Buscar trabajos académicos y científicos",
      action: "explorar-publicaciones",
      color: "btn-secondary",
    })

    actions.push({
      title: user.role === "estudiante" ? "Ver Investigadores" : "Red de Investigadores",
      description:
        user.role === "estudiante" ? "Explorar investigadores de ULEAM" : "Conectar con otros investigadores",
      action: "investigadores",
      color: "btn-info",
    })

    // Admin tiene acciones especiales
    if (user.role === "admin") {
      actions.push(
        {
          title: "Validar Contenido",
          description: "Revisar publicaciones y proyectos",
          action: "validacion",
          color: "btn-warning",
        },
        {
          title: "Ver Reportes",
          description: "Estadísticas del sistema",
          action: "reportes",
          color: "btn-info",
        },
      )
    }

    return actions
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Panel Principal</h1>
        <p className="page-subtitle">{getUserWelcome()}</p>
      </div>

      {/* Search Section */}
      <div className="card mb-20">
        <div className="card-content" style={{ padding: "30px" }}>
          {/* Buscar documentos */}
          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ color: "#333", marginBottom: "10px", fontSize: "14px", fontWeight: "600" }}>
              Buscar documentos
            </h4>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Título del documento o Tesis"
                value={searchFilters.publicacionTitulo}
                onChange={(e) => setSearchFilters({ ...searchFilters, publicacionTitulo: e.target.value })}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              />
              <button
                onClick={handleSearchDocumentos}
                style={{
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  padding: "8px 20px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Buscar
              </button>
            </div>
          </div>

          {/* Buscar revistas */}
          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ color: "#333", marginBottom: "10px", fontSize: "14px", fontWeight: "600" }}>
              Buscar revistas
            </h4>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Nombre de la revista"
                value={searchFilters.revistaNombre}
                onChange={(e) => setSearchFilters({ ...searchFilters, revistaNombre: e.target.value })}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              />
              <button
                onClick={handleSearchRevistas}
                style={{
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  padding: "8px 20px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Buscar
              </button>
            </div>
          </div>

          {/* Buscar artículos */}
          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ color: "#333", marginBottom: "10px", fontSize: "14px", fontWeight: "600" }}>
              Buscar artículos
            </h4>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Título del artículo"
                value={searchFilters.articuloTitulo}
                onChange={(e) => setSearchFilters({ ...searchFilters, articuloTitulo: e.target.value })}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              />
              <select
                value={searchFilters.tipoArticulo}
                onChange={(e) => setSearchFilters({ ...searchFilters, tipoArticulo: e.target.value })}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  minWidth: "150px",
                }}
              >
                <option value="">Tipo de artículo</option>
                <option value="articulo">Artículo Científico</option>
                <option value="libro">Libro</option>
                <option value="tesis">Tesis</option>
                <option value="congreso">Congreso</option>
              </select>
              <button
                onClick={handleSearchArticulos}
                style={{
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  padding: "8px 20px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Buscar
              </button>
            </div>
          </div>

          {/* Datos técnicos (opcional) */}
          <div style={{ marginBottom: "20px" }}>
            <h4 style={{ color: "#333", marginBottom: "10px", fontSize: "14px", fontWeight: "600" }}>
              Datos técnicos (opcional)
            </h4>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <input
                type="text"
                placeholder="DOI"
                value={searchFilters.doi}
                onChange={(e) => setSearchFilters({ ...searchFilters, doi: e.target.value })}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  minWidth: "120px",
                }}
              />
              <input
                type="text"
                placeholder="ISSN"
                value={searchFilters.issn}
                onChange={(e) => setSearchFilters({ ...searchFilters, issn: e.target.value })}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  minWidth: "120px",
                }}
              />
              <input
                type="text"
                placeholder="ISBN"
                value={searchFilters.isbn}
                onChange={(e) => setSearchFilters({ ...searchFilters, isbn: e.target.value })}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  minWidth: "120px",
                }}
              />
              <input
                type="date"
                value={searchFilters.fecha}
                onChange={(e) => setSearchFilters({ ...searchFilters, fecha: e.target.value })}
                style={{
                  padding: "8px 12px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  fontSize: "14px",
                  minWidth: "140px",
                }}
              />
              <button
                onClick={handleAdvancedSearch}
                style={{
                  backgroundColor: "#059669",
                  color: "white",
                  border: "none",
                  padding: "8px 20px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Buscar Avanzado
              </button>
              <button
                onClick={clearSearch}
                style={{
                  backgroundColor: "#6b7280",
                  color: "white",
                  border: "none",
                  padding: "8px 20px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Limpiar
              </button>
            </div>
          </div>

          {/* Search Results */}
          {showResults && (
            <div style={{ marginTop: "30px", padding: "20px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
              <h4 style={{ color: "#1e3c72", marginBottom: "15px" }}>Resultados de Búsqueda</h4>

              {searchResults.publicaciones.length > 0 && (
                <div style={{ marginBottom: "15px" }}>
                  <h5 style={{ color: "#374151", marginBottom: "10px" }}>Documentos encontrados:</h5>
                  {searchResults.publicaciones.map((pub, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "10px",
                        backgroundColor: "white",
                        marginBottom: "8px",
                        borderRadius: "4px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <strong>{pub.titulo}</strong>
                      <br />
                      <small>
                        Por: {pub.autorNombre} | Tipo: {pub.tipo} | Año: {pub.fechaPublicacion}
                      </small>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.revistas.length > 0 && (
                <div style={{ marginBottom: "15px" }}>
                  <h5 style={{ color: "#374151", marginBottom: "10px" }}>Revistas encontradas:</h5>
                  {searchResults.revistas.map((pub, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "10px",
                        backgroundColor: "white",
                        marginBottom: "8px",
                        borderRadius: "4px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <strong>{pub.revista}</strong>
                      <br />
                      <small>
                        Artículo: {pub.titulo} | Por: {pub.autorNombre}
                      </small>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.articulos.length > 0 && (
                <div style={{ marginBottom: "15px" }}>
                  <h5 style={{ color: "#374151", marginBottom: "10px" }}>Artículos encontrados:</h5>
                  {searchResults.articulos.map((pub, index) => (
                    <div
                      key={index}
                      style={{
                        padding: "10px",
                        backgroundColor: "white",
                        marginBottom: "8px",
                        borderRadius: "4px",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <strong>{pub.titulo}</strong>
                      <br />
                      <small>
                        Por: {pub.autorNombre} | Tipo: {pub.tipo} | Año: {pub.fechaPublicacion}
                      </small>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.publicaciones.length === 0 &&
                searchResults.revistas.length === 0 &&
                searchResults.articulos.length === 0 && (
                  <p style={{ color: "#6b7280", textAlign: "center" }}>
                    No se encontraron resultados para los criterios de búsqueda.
                  </p>
                )}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Stats */}
      <div className="stats-grid mb-20">
        <div className="stat-card" style={{ borderLeft: "4px solid #059669" }}>
          <div className="stat-number">{stats.totalPublicaciones}</div>
          <div className="stat-label">{user.role === "admin" ? "Total Publicaciones" : "Mis Publicaciones"}</div>
          <small style={{ color: "#666", fontSize: "12px" }}>Artículos, libros, tesis</small>
        </div>

        {(user.role === "docente" || user.role === "investigador" || user.role === "admin") && (
          <div className="stat-card" style={{ borderLeft: "4px solid #d97706" }}>
            <div className="stat-number">{stats.totalProyectos}</div>
            <div className="stat-label">{user.role === "admin" ? "Total Proyectos" : "Mis Proyectos"}</div>
            <small style={{ color: "#666", fontSize: "12px" }}>Investigación activa</small>
          </div>
        )}

        <div className="stat-card" style={{ borderLeft: "4px solid #dc2626" }}>
          <div className="stat-number">{stats.publicacionesPendientes}</div>
          <div className="stat-label">Pendientes Validación</div>
          <small style={{ color: "#666", fontSize: "12px" }}>Requieren revisión</small>
        </div>

        {user.role === "admin" && (
          <div className="stat-card" style={{ borderLeft: "4px solid #2563eb" }}>
            <div className="stat-number">{stats.totalInvestigadores}</div>
            <div className="stat-label">Total Usuarios</div>
            <small style={{ color: "#666", fontSize: "12px" }}>Comunidad ULEAM</small>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Acciones Rápidas</h2>
          <p className="card-subtitle">Funciones principales disponibles para tu rol</p>
        </div>
        <div className="card-content">
          <div className="action-grid">
            {getAvailableActions().map((action, index) => (
              <div key={index} className="action-card">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
                <button className={`btn ${action.color}`} onClick={() => onNavigate(action.action)}>
                  {action.title}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="form-grid mt-20">
        {/* Recent Publications */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Publicaciones Recientes</h2>
            <button className="btn btn-secondary" onClick={() => onNavigate("explorar-publicaciones")}>
              Ver Todas
            </button>
          </div>
          <div className="card-content">
            {stats.publicacionesRecientes.length > 0 ? (
              <div className="activity-list">
                {stats.publicacionesRecientes.map((pub, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-text">
                      <strong>{pub.titulo}</strong>
                      <br />
                      <small>Por: {pub.autorNombre}</small>
                    </div>
                    <div className={`activity-status ${pub.validado ? "success" : "warning"}`}>
                      {pub.validado ? "Validado" : "Pendiente"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center">No hay publicaciones registradas</p>
            )}
          </div>
        </div>

        {/* Recent Projects - Solo para docentes, investigadores y admin */}
        {(user.role === "docente" || user.role === "investigador" || user.role === "admin") && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Proyectos Recientes</h2>
              <button className="btn btn-secondary" onClick={() => onNavigate("explorar-proyectos")}>
                Ver Todos
              </button>
            </div>
            <div className="card-content">
              {stats.proyectosRecientes.length > 0 ? (
                <div className="activity-list">
                  {stats.proyectosRecientes.map((proyecto, index) => (
                    <div key={index} className="activity-item">
                      <div className="activity-text">
                        <strong>{proyecto.nombre}</strong>
                        <br />
                        <small>Por: {proyecto.autorNombre}</small>
                      </div>
                      <div className={`activity-status ${proyecto.validado ? "success" : "warning"}`}>
                        {proyecto.validado ? "Validado" : "Pendiente"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center">No hay proyectos registrados</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PanelPrincipal
