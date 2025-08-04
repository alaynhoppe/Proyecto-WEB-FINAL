"use client"

import { useState, useEffect } from "react"

const ExplorarPublicaciones = ({ user }) => {
  const [publicaciones, setPublicaciones] = useState([])
  const [filteredPublicaciones, setFilteredPublicaciones] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    tipo: "",
    año: "",
    indexacion: "",
  })

  useEffect(() => {
    loadPublicaciones()
  }, [])

  useEffect(() => {
    filterPublicaciones()
  }, [publicaciones, searchTerm, filters])

  const loadPublicaciones = () => {
    // Cargar TODAS las publicaciones para explorar
    const allPublicaciones = JSON.parse(localStorage.getItem("uleam_publicaciones") || "[]")
    setPublicaciones(allPublicaciones)
  }

  const filterPublicaciones = () => {
    let filtered = publicaciones

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.autores.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.autorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.revista && p.revista.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (p.doi && p.doi.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (p.palabrasClave && p.palabrasClave.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (filters.tipo) {
      filtered = filtered.filter((p) => p.tipo === filters.tipo)
    }

    if (filters.año) {
      filtered = filtered.filter((p) => p.año === filters.año)
    }

    if (filters.indexacion) {
      filtered = filtered.filter((p) => p.indexacion === filters.indexacion)
    }

    setFilteredPublicaciones(filtered)
  }

  const getPublicationTypes = () => {
    return [
      { value: "articulo", label: "Artículo Científico" },
      { value: "libro", label: "Libro" },
      { value: "capitulo", label: "Capítulo de Libro" },
      { value: "congreso", label: "Artículo de Congreso" },
      { value: "revista", label: "Artículo de Revista" },
      { value: "editorial", label: "Editorial" },
      { value: "reseña", label: "Reseña" },
    ]
  }

  const getUniqueYears = () => {
    const years = [...new Set(publicaciones.map((p) => p.año))].sort((a, b) => b - a)
    return years
  }

  const getUniqueIndexations = () => {
    const indexations = [...new Set(publicaciones.map((p) => p.indexacion).filter(Boolean))]
    return indexations
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Explorar Publicaciones Científicas</h1>
        <p className="page-subtitle">Busca y analiza publicaciones científicas de la comunidad ULEAM</p>
      </div>

      {/* Search and Filters */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por título, autor, revista, DOI o palabras clave..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="filter-select"
          value={filters.tipo}
          onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
        >
          <option value="">Todos los tipos</option>
          {getPublicationTypes().map((tipo) => (
            <option key={tipo.value} value={tipo.value}>
              {tipo.label}
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

        <select
          className="filter-select"
          value={filters.indexacion}
          onChange={(e) => setFilters({ ...filters, indexacion: e.target.value })}
        >
          <option value="">Todas las indexaciones</option>
          {getUniqueIndexations().map((indexacion) => (
            <option key={indexacion} value={indexacion}>
              {indexacion}
            </option>
          ))}
        </select>
      </div>

      {/* Statistics */}
      <div className="stats-container" style={{ marginBottom: "20px" }}>
        <div className="stat-card">
          <div className="stat-number">{filteredPublicaciones.length}</div>
          <div className="stat-label">Publicaciones encontradas</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{filteredPublicaciones.filter((p) => p.validado).length}</div>
          <div className="stat-label">Validadas</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{filteredPublicaciones.filter((p) => p.indexacion).length}</div>
          <div className="stat-label">Indexadas</div>
        </div>
      </div>

      {/* Publications List */}
      <div className="publications-grid">
        {filteredPublicaciones.map((pub) => (
          <div key={pub.id} className="publication-card">
            <div className="publication-header">
              <h3>{pub.titulo}</h3>
              <div style={{ display: "flex", gap: "5px" }}>
                <span className={`status ${pub.validado ? "validated" : "pending"}`}>
                  {pub.validado ? "Validado" : "Pendiente"}
                </span>
                {pub.indexacion && <span className="badge badge-info">{pub.indexacion}</span>}
              </div>
            </div>
            <div className="publication-content">
              <p>
                <strong>Autores:</strong> {pub.autores}
              </p>
              <p>
                <strong>Autor Principal:</strong> {pub.autorNombre}
              </p>
              <p>
                <strong>Tipo:</strong> {getPublicationTypes().find((t) => t.value === pub.tipo)?.label || pub.tipo}
              </p>
              <p>
                <strong>Año:</strong> {pub.año}
              </p>
              {pub.revista && (
                <p>
                  <strong>Revista:</strong> {pub.revista}
                </p>
              )}
              {pub.doi && (
                <p>
                  <strong>DOI:</strong> {pub.doi}
                </p>
              )}
              {pub.cuartil && (
                <p>
                  <strong>Cuartil:</strong> {pub.cuartil}
                </p>
              )}
              {pub.factorImpacto && (
                <p>
                  <strong>Factor de Impacto:</strong> {pub.factorImpacto}
                </p>
              )}
              {pub.palabrasClave && (
                <p>
                  <strong>Palabras Clave:</strong> {pub.palabrasClave}
                </p>
              )}
              {pub.resumen && (
                <div style={{ marginTop: "10px" }}>
                  <strong>Resumen:</strong>
                  <p style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
                    {pub.resumen.length > 200 ? `${pub.resumen.substring(0, 200)}...` : pub.resumen}
                  </p>
                </div>
              )}
            </div>
            <div className="publication-actions">
              <button className="btn btn-info">Ver Detalles</button>
              {pub.archivoUrl && <button className="btn btn-secondary">Descargar</button>}
              <button className="btn btn-outline">Citar</button>
            </div>
          </div>
        ))}
      </div>

      {filteredPublicaciones.length === 0 && (
        <div className="empty-state">
          <p>No se encontraron publicaciones que coincidan con los criterios de búsqueda.</p>
          <p style={{ color: "#666", fontSize: "14px", marginTop: "10px" }}>
            Intenta ajustar los filtros o términos de búsqueda.
          </p>
        </div>
      )}
    </div>
  )
}

export default ExplorarPublicaciones
