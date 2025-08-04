"use client"

import { useState, useEffect } from "react"

const Proyectos = ({ user }) => {
  const [proyectos, setProyectos] = useState([])
  const [filteredProyectos, setFilteredProyectos] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    estado: "",
    tipo: "",
    año: "",
  })

  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "",
    autorPrincipal: "",
    coautores: "",
    tutor: "",
    duracion: "",
    fechaInicio: "",
    fechaFin: "",
    tipoFinanciamiento: "",
    montoFinanciamiento: "",
    estado: "",
    objetivos: "",
    metodologia: "",
    resultadosEsperados: "",
    palabrasClave: "",
    archivo: null,
    archivoNombre: "",
    institucion: "",
    facultad: "",
    carrera: "",
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    loadProyectos()
  }, [user])

  useEffect(() => {
    filterProyectos()
  }, [proyectos, searchTerm, filters])

  const loadProyectos = () => {
    const allProyectos = JSON.parse(localStorage.getItem("uleam_proyectos") || "[]")
    if (user.role === "admin") {
      setProyectos(allProyectos)
    } else {
      setProyectos(allProyectos.filter((p) => p.autorId === user.id))
    }
  }

  const filterProyectos = () => {
    let filtered = proyectos

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.autorPrincipal.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.palabrasClave && p.palabrasClave.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (filters.estado) {
      filtered = filtered.filter((p) => p.estado === filters.estado)
    }

    if (filters.tipo) {
      filtered = filtered.filter((p) => p.tipo === filters.tipo)
    }

    if (filters.año) {
      filtered = filtered.filter((p) => new Date(p.fechaInicio).getFullYear().toString() === filters.año)
    }

    setFilteredProyectos(filtered)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nombre.trim()) newErrors.nombre = "El nombre del proyecto es obligatorio"
    if (!formData.tipo) newErrors.tipo = "El tipo de proyecto es obligatorio"
    if (!formData.autorPrincipal.trim()) newErrors.autorPrincipal = "El autor principal es obligatorio"
    if (!formData.fechaInicio) newErrors.fechaInicio = "La fecha de inicio es obligatoria"
    if (!formData.estado) newErrors.estado = "El estado es obligatorio"

    // Validaciones específicas para estudiantes
    if (user.role === "estudiante") {
      if ((formData.tipo === "tesis" || formData.tipo === "trabajo_grado") && !formData.tutor.trim()) {
        newErrors.tutor = "El tutor es obligatorio para tesis y trabajos de grado"
      }
      if (!formData.carrera.trim()) {
        newErrors.carrera = "La carrera es obligatoria para estudiantes"
      }
    }

    if (formData.fechaFin && formData.fechaInicio && new Date(formData.fechaFin) <= new Date(formData.fechaInicio)) {
      newErrors.fechaFin = "La fecha de fin debe ser posterior a la fecha de inicio"
    }

    if (formData.montoFinanciamiento && isNaN(Number.parseFloat(formData.montoFinanciamiento))) {
      newErrors.montoFinanciamiento = "El monto debe ser un número válido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const allowedTypes = [".pdf", ".doc", ".docx"]
      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."))

      if (!allowedTypes.includes(fileExtension)) {
        alert("Solo se permiten archivos PDF, DOC o DOCX")
        return
      }

      if (file.size > 20 * 1024 * 1024) {
        alert("El archivo no puede ser mayor a 20MB")
        return
      }

      setFormData({ ...formData, archivo: file, archivoNombre: file.name })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    const allProyectos = JSON.parse(localStorage.getItem("uleam_proyectos") || "[]")
    const newProject = {
      id: editingProject ? editingProject.id : Date.now(),
      ...formData,
      autorId: user.id,
      autorNombre: user.name,
      userRole: user.role,
      fechaCreacion: editingProject ? editingProject.fechaCreacion : new Date().toISOString(),
      fechaModificacion: new Date().toISOString(),
      validado: false,
      archivoUrl: formData.archivo ? `uploads/${Date.now()}_${formData.archivoNombre}` : null,
    }

    if (editingProject) {
      const index = allProyectos.findIndex((p) => p.id === editingProject.id)
      allProyectos[index] = newProject
    } else {
      allProyectos.push(newProject)
    }

    localStorage.setItem("uleam_proyectos", JSON.stringify(allProyectos))
    loadProyectos()
    resetForm()
    setShowModal(false)
    alert("Proyecto guardado exitosamente")
  }

  const resetForm = () => {
    setFormData({
      nombre: "",
      tipo: "",
      autorPrincipal: "",
      coautores: "",
      tutor: "",
      duracion: "",
      fechaInicio: "",
      fechaFin: "",
      tipoFinanciamiento: "",
      montoFinanciamiento: "",
      estado: "",
      objetivos: "",
      metodologia: "",
      resultadosEsperados: "",
      palabrasClave: "",
      archivo: null,
      archivoNombre: "",
      institucion: "",
      facultad: "",
      carrera: "",
    })
    setErrors({})
    setEditingProject(null)
  }

  const handleEdit = (project) => {
    setFormData(project)
    setEditingProject(project)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (confirm("¿Estás seguro de eliminar este proyecto?")) {
      const allProyectos = JSON.parse(localStorage.getItem("uleam_proyectos") || "[]")
      const filtered = allProyectos.filter((p) => p.id !== id)
      localStorage.setItem("uleam_proyectos", JSON.stringify(filtered))
      loadProyectos()
      alert("Proyecto eliminado exitosamente")
    }
  }

  const getProjectTypes = () => {
    if (user.role === "estudiante") {
      return [
        { value: "tesis", label: "Tesis de Grado" },
        { value: "trabajo_grado", label: "Trabajo de Grado" },
        { value: "informe_practicas", label: "Informe de Prácticas" },
        { value: "proyecto_vinculacion", label: "Proyecto de Vinculación" },
        { value: "ensayo", label: "Ensayo Académico" },
        { value: "monografia", label: "Monografía" },
      ]
    } else {
      return [
        { value: "investigacion", label: "Proyecto de Investigación" },
        { value: "desarrollo", label: "Proyecto de Desarrollo" },
        { value: "innovacion", label: "Proyecto de Innovación" },
        { value: "extension", label: "Proyecto de Extensión" },
        { value: "vinculacion", label: "Proyecto de Vinculación" },
        { value: "consultoria", label: "Consultoría" },
      ]
    }
  }

  const getProjectStates = () => {
    if (user.role === "estudiante") {
      return [
        { value: "planificacion", label: "En Planificación" },
        { value: "desarrollo", label: "En Desarrollo" },
        { value: "revision", label: "En Revisión" },
        { value: "defensa", label: "Listo para Defensa" },
        { value: "finalizado", label: "Finalizado" },
        { value: "suspendido", label: "Suspendido" },
      ]
    } else {
      return [
        { value: "planificacion", label: "Planificación" },
        { value: "ejecucion", label: "En Ejecución" },
        { value: "finalizado", label: "Finalizado" },
        { value: "suspendido", label: "Suspendido" },
      ]
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          {user.role === "estudiante" ? "Mis Proyectos Académicos" : "Proyectos de Investigación"}
        </h1>
        <p className="page-subtitle">
          {user.role === "estudiante"
            ? "Gestiona tus tesis, trabajos de grado e informes académicos"
            : user.role === "admin"
              ? "Gestiona todos los proyectos del sistema"
              : "Gestiona tus proyectos de investigación y desarrollo"}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por nombre, autor o palabras clave..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select"
          value={filters.tipo}
          onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
        >
          <option value="">Todos los tipos</option>
          {getProjectTypes().map((tipo) => (
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
          {getProjectStates().map((estado) => (
            <option key={estado.value} value={estado.value}>
              {estado.label}
            </option>
          ))}
        </select>
        <select
          className="filter-select"
          value={filters.año}
          onChange={(e) => setFilters({ ...filters, año: e.target.value })}
        >
          <option value="">Todos los años</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
        >
          {user.role === "estudiante" ? "Nuevo Proyecto Académico" : "Nuevo Proyecto"}
        </button>
      </div>

      {/* Projects Grid */}
      <div className="publications-grid">
        {filteredProyectos.map((proyecto) => (
          <div key={proyecto.id} className="publication-card">
            <div className="publication-header">
              <h3>{proyecto.nombre}</h3>
              <span className={`status ${proyecto.validado ? "validated" : "pending"}`}>
                {proyecto.validado ? "Validado" : "Pendiente"}
              </span>
            </div>
            <div className="publication-content">
              <p>
                <strong>Tipo:</strong> {getProjectTypes().find((t) => t.value === proyecto.tipo)?.label}
              </p>
              <p>
                <strong>Autor Principal:</strong> {proyecto.autorPrincipal}
              </p>
              {proyecto.tutor && (
                <p>
                  <strong>Tutor:</strong> {proyecto.tutor}
                </p>
              )}
              <p>
                <strong>Estado:</strong> {getProjectStates().find((e) => e.value === proyecto.estado)?.label}
              </p>
              <p>
                <strong>Fecha Inicio:</strong> {new Date(proyecto.fechaInicio).toLocaleDateString("es-ES")}
              </p>
              {proyecto.archivoNombre && (
                <p>
                  <strong>Archivo:</strong>
                  <span className="badge badge-info">{proyecto.archivoNombre}</span>
                </p>
              )}
            </div>
            <div className="publication-actions">
              <button className="btn btn-secondary" onClick={() => handleEdit(proyecto)}>
                Editar
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(proyecto.id)}>
                Eliminar
              </button>
              {proyecto.archivoUrl && <button className="btn btn-info">Descargar</button>}
            </div>
          </div>
        ))}
      </div>

      {filteredProyectos.length === 0 && (
        <div className="empty-state">
          <p>No se encontraron proyectos que coincidan con los criterios de búsqueda.</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            {user.role === "estudiante" ? "Crear Primer Proyecto Académico" : "Crear Primer Proyecto"}
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: "900px", width: "95%" }}>
            <div className="modal-header">
              <h2>
                {editingProject
                  ? "Editar Proyecto"
                  : user.role === "estudiante"
                    ? "Nuevo Proyecto Académico"
                    : "Nuevo Proyecto"}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-content" style={{ maxHeight: "80vh", overflowY: "auto" }}>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  {/* Información Básica */}
                  <div className="form-group form-full">
                    <label className="form-label">Nombre del Proyecto *</label>
                    <input
                      type="text"
                      className={`form-input ${errors.nombre ? "error" : ""}`}
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    />
                    {errors.nombre && <div className="error-message">{errors.nombre}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tipo de Proyecto *</label>
                    <select
                      className={`form-select ${errors.tipo ? "error" : ""}`}
                      value={formData.tipo}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    >
                      <option value="">Seleccionar tipo</option>
                      {getProjectTypes().map((tipo) => (
                        <option key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </option>
                      ))}
                    </select>
                    {errors.tipo && <div className="error-message">{errors.tipo}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Autor Principal *</label>
                    <input
                      type="text"
                      className={`form-input ${errors.autorPrincipal ? "error" : ""}`}
                      value={formData.autorPrincipal}
                      onChange={(e) => setFormData({ ...formData, autorPrincipal: e.target.value })}
                    />
                    {errors.autorPrincipal && <div className="error-message">{errors.autorPrincipal}</div>}
                  </div>

                  {user.role === "estudiante" && (
                    <div className="form-group">
                      <label className="form-label">
                        Tutor {formData.tipo === "tesis" || formData.tipo === "trabajo_grado" ? "*" : ""}
                      </label>
                      <input
                        type="text"
                        className={`form-input ${errors.tutor ? "error" : ""}`}
                        value={formData.tutor}
                        onChange={(e) => setFormData({ ...formData, tutor: e.target.value })}
                      />
                      {errors.tutor && <div className="error-message">{errors.tutor}</div>}
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Coautores</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Separados por comas"
                      value={formData.coautores}
                      onChange={(e) => setFormData({ ...formData, coautores: e.target.value })}
                    />
                  </div>

                  {user.role === "estudiante" && (
                    <div className="form-group">
                      <label className="form-label">Carrera *</label>
                      <input
                        type="text"
                        className={`form-input ${errors.carrera ? "error" : ""}`}
                        value={formData.carrera}
                        onChange={(e) => setFormData({ ...formData, carrera: e.target.value })}
                      />
                      {errors.carrera && <div className="error-message">{errors.carrera}</div>}
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Fecha de Inicio *</label>
                    <input
                      type="date"
                      className={`form-input ${errors.fechaInicio ? "error" : ""}`}
                      value={formData.fechaInicio}
                      onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                    />
                    {errors.fechaInicio && <div className="error-message">{errors.fechaInicio}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Fecha de Fin</label>
                    <input
                      type="date"
                      className={`form-input ${errors.fechaFin ? "error" : ""}`}
                      value={formData.fechaFin}
                      onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                    />
                    {errors.fechaFin && <div className="error-message">{errors.fechaFin}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Estado *</label>
                    <select
                      className={`form-select ${errors.estado ? "error" : ""}`}
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    >
                      <option value="">Seleccionar estado</option>
                      {getProjectStates().map((estado) => (
                        <option key={estado.value} value={estado.value}>
                          {estado.label}
                        </option>
                      ))}
                    </select>
                    {errors.estado && <div className="error-message">{errors.estado}</div>}
                  </div>

                  {/* Archivo */}
                  <div className="form-group form-full">
                    <label className="form-label">Archivo del Proyecto</label>
                    <input type="file" className="form-input" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                    <small style={{ color: "#666", fontSize: "12px" }}>
                      Formatos permitidos: PDF, DOC, DOCX. Tamaño máximo: 20MB
                    </small>
                    {formData.archivoNombre && (
                      <div style={{ marginTop: "5px" }}>
                        <span className="badge badge-success">Archivo: {formData.archivoNombre}</span>
                      </div>
                    )}
                  </div>

                  {/* Descripción del Proyecto */}
                  <div className="form-group form-full">
                    <label className="form-label">Objetivos</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      value={formData.objetivos}
                      onChange={(e) => setFormData({ ...formData, objetivos: e.target.value })}
                    />
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label">Metodología</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      value={formData.metodologia}
                      onChange={(e) => setFormData({ ...formData, metodologia: e.target.value })}
                    />
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label">Resultados Esperados</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      value={formData.resultadosEsperados}
                      onChange={(e) => setFormData({ ...formData, resultadosEsperados: e.target.value })}
                    />
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label">Palabras Clave</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Separadas por comas"
                      value={formData.palabrasClave}
                      onChange={(e) => setFormData({ ...formData, palabrasClave: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProject ? "Actualizar" : "Guardar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Proyectos
