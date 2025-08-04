"use client"

import { useState, useEffect } from "react"

const MisPublicaciones = ({ user }) => {
  const [publicaciones, setPublicaciones] = useState([])
  const [filteredPublicaciones, setFilteredPublicaciones] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingPublication, setEditingPublication] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const [formData, setFormData] = useState({
    titulo: "",
    autores: "",
    tipo: "",
    revista: "",
    año: "",
    volumen: "",
    numero: "",
    paginas: "",
    doi: "",
    issn: "",
    isbn: "",
    editorial: "",
    indexacion: "",
    cuartil: "",
    factorImpacto: "",
    resumen: "",
    palabrasClave: "",
    idioma: "",
    pais: "",
    archivo: null,
    archivoNombre: "",
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (user.role !== "estudiante") {
      loadPublicaciones()
    }
  }, [user])

  useEffect(() => {
    if (user.role !== "estudiante") {
      filterPublicaciones()
    }
  }, [publicaciones, searchTerm])

  const loadPublicaciones = () => {
    const allPublicaciones = JSON.parse(localStorage.getItem("uleam_publicaciones") || "[]")
    // Solo cargar MIS publicaciones
    setPublicaciones(allPublicaciones.filter((p) => p.autorId === user.id))
  }

  const filterPublicaciones = () => {
    let filtered = publicaciones

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.autores.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.revista && p.revista.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (p.doi && p.doi.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredPublicaciones(filtered)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.titulo.trim()) newErrors.titulo = "El título es obligatorio"
    if (!formData.autores.trim()) newErrors.autores = "Los autores son obligatorios"
    if (!formData.tipo) newErrors.tipo = "El tipo es obligatorio"
    if (!formData.año) newErrors.año = "El año es obligatorio"
    if (!formData.idioma) newErrors.idioma = "El idioma es obligatorio"

    if (formData.tipo === "articulo" && !formData.revista.trim()) {
      newErrors.revista = "La revista es obligatoria para artículos"
    }

    if (formData.tipo === "libro" && !formData.editorial.trim()) {
      newErrors.editorial = "La editorial es obligatoria para libros"
    }

    if (formData.doi && !/^10\.\d{4,}\//.test(formData.doi)) {
      newErrors.doi = "Formato de DOI inválido (debe comenzar con 10.)"
    }

    if (formData.issn && !/^\d{4}-\d{3}[\dX]$/.test(formData.issn)) {
      newErrors.issn = "Formato de ISSN inválido (XXXX-XXXX)"
    }

    if (formData.isbn && !/^(978|979)-?\d{1,5}-?\d{1,7}-?\d{1,7}-?\d{1}$/.test(formData.isbn.replace(/-/g, ""))) {
      newErrors.isbn = "Formato de ISBN inválido"
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

      if (file.size > 10 * 1024 * 1024) {
        alert("El archivo no puede ser mayor a 10MB")
        return
      }

      setFormData({ ...formData, archivo: file, archivoNombre: file.name })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

   // Mantener archivo anterior si no se sube uno nuevo
let archivoUrl = editingPublication?.archivoUrl || null
let archivoNombre = editingPublication?.archivoNombre || ""

if (formData.archivo) {
  archivoUrl = `uploads/${Date.now()}_${formData.archivoNombre}`
  archivoNombre = formData.archivoNombre
}

const newPublication = {
  id: editingPublication ? editingPublication.id : Date.now(),
  ...formData,
  archivo: undefined, // No guardar el objeto File en localStorage
  archivoUrl,
  archivoNombre,
  autorId: user.id,
  autorNombre: user.name,
  fechaCreacion: editingPublication ? editingPublication.fechaCreacion : new Date().toISOString(),
  fechaModificacion: new Date().toISOString(),
  validado: false,
}
    if (editingPublication) {
      const index = allPublicaciones.findIndex((p) => p.id === editingPublication.id)
      allPublicaciones[index] = newPublication
    } else {
      allPublicaciones.push(newPublication)
    }

    localStorage.setItem("uleam_publicaciones", JSON.stringify(allPublicaciones))
    loadPublicaciones()
    resetForm()
    setShowModal(false)
    alert("Publicación guardada correctamente")
  }

  const resetForm = () => {
    setFormData({
      titulo: "",
      autores: "",
      tipo: "",
      revista: "",
      año: "",
      volumen: "",
      numero: "",
      paginas: "",
      doi: "",
      issn: "",
      isbn: "",
      editorial: "",
      indexacion: "",
      cuartil: "",
      factorImpacto: "",
      resumen: "",
      palabrasClave: "",
      idioma: "",
      pais: "",
      archivo: null,
      archivoNombre: "",
    })
    setErrors({})
    setEditingPublication(null)
  }

  const handleEdit = (publication) => {
    setFormData(publication)
    setEditingPublication(publication)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (confirm("¿Estás seguro de eliminar esta publicación?")) {
      const allPublicaciones = JSON.parse(localStorage.getItem("uleam_publicaciones") || "[]")
      const filtered = allPublicaciones.filter((p) => p.id !== id)
      localStorage.setItem("uleam_publicaciones", JSON.stringify(filtered))
      loadPublicaciones()
      alert("Publicación eliminada")
    }
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

  if (user.role === "estudiante") {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Acceso Restringido</h1>
          <p className="page-subtitle">Las publicaciones científicas son solo para investigadores y docentes.</p>
        </div>
        <div className="card">
          <div className="card-content text-center">
            <p>Como estudiante, puedes registrar tus trabajos en "Mis Proyectos".</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Mis Publicaciones Científicas</h1>
        <p className="page-subtitle">Gestiona tus publicaciones científicas</p>
      </div>

      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar en mis publicaciones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
          Nueva Publicación
        </button>
      </div>

      {/* Publications List */}
      <div className="publications-grid">
        {filteredPublicaciones.map((pub) => (
          <div key={pub.id} className="publication-card">
            <div className="publication-header">
              <h3>{pub.titulo}</h3>
              <span className={`status ${pub.validado ? "validated" : "pending"}`}>
                {pub.validado ? "Validado" : "Pendiente"}
              </span>
            </div>
            <div className="publication-content">
              <p>
                <strong>Autores:</strong> {pub.autores}
              </p>
              <p>
                <strong>Tipo:</strong> {pub.tipo}
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
              {pub.indexacion && (
                <p>
                  <strong>Indexación:</strong> {pub.indexacion}
                </p>
              )}
              {pub.archivoNombre && (
                <p>
                  <strong>Archivo:</strong> <span className="badge badge-info">{pub.archivoNombre}</span>
                </p>
              )}
            </div>
            <div className="publication-actions">
              <button className="btn btn-secondary" onClick={() => handleEdit(pub)}>
                Editar
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(pub.id)}>
                Eliminar
              </button>
              {pub.archivoUrl && <button className="btn btn-info">Descargar</button>}
            </div>
          </div>
        ))}
      </div>

      {filteredPublicaciones.length === 0 && (
        <div className="empty-state">
          <p>No tienes publicaciones científicas registradas aún.</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Crear Primera Publicación
          </button>
        </div>
      )}

      {/* Modal - Formulario simplificado para brevedad */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: "800px", width: "95%" }}>
            <div className="modal-header">
              <h2>{editingPublication ? "Editar Publicación" : "Nueva Publicación"}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-content" style={{ maxHeight: "70vh", overflowY: "auto" }}>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group form-full">
                    <label className="form-label">Título *</label>
                    <input
                      type="text"
                      className={`form-input ${errors.titulo ? "error" : ""}`}
                      value={formData.titulo}
                      onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    />
                    {errors.titulo && <div className="error-message">{errors.titulo}</div>}
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label">Autores *</label>
                    <input
                      type="text"
                      className={`form-input ${errors.autores ? "error" : ""}`}
                      placeholder="Separados por comas"
                      value={formData.autores}
                      onChange={(e) => setFormData({ ...formData, autores: e.target.value })}
                    />
                    {errors.autores && <div className="error-message">{errors.autores}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tipo *</label>
                    <select
                      className={`form-select ${errors.tipo ? "error" : ""}`}
                      value={formData.tipo}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    >
                      <option value="">Seleccionar tipo</option>
                      {getPublicationTypes().map((tipo) => (
                        <option key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </option>
                      ))}
                    </select>
                    {errors.tipo && <div className="error-message">{errors.tipo}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Año *</label>
                    <input
                      type="number"
                      className={`form-input ${errors.año ? "error" : ""}`}
                      min="1900"
                      max="2030"
                      value={formData.año}
                      onChange={(e) => setFormData({ ...formData, año: e.target.value })}
                    />
                    {errors.año && <div className="error-message">{errors.año}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Revista/Editorial</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.revista}
                      onChange={(e) => setFormData({ ...formData, revista: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">DOI</label>
                    <input
                      type="text"
                      className={`form-input ${errors.doi ? "error" : ""}`}
                      placeholder="10.1000/182"
                      value={formData.doi}
                      onChange={(e) => setFormData({ ...formData, doi: e.target.value })}
                    />
                    {errors.doi && <div className="error-message">{errors.doi}</div>}
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label">Archivo</label>
                    <input type="file" className="form-input" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                    <small style={{ color: "#666", fontSize: "12px" }}>PDF, DOC, DOCX. Máximo 10MB</small>
                    {formData.archivoNombre && (
                      <div style={{ marginTop: "5px" }}>
                        <span className="badge badge-success">Archivo: {formData.archivoNombre}</span>
                      </div>
                    )}
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label">Resumen</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      value={formData.resumen}
                      onChange={(e) => setFormData({ ...formData, resumen: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingPublication ? "Actualizar" : "Guardar"}
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

export default MisPublicaciones
