"use client"

import { useState, useEffect } from "react"

const Perfil = ({ user }) => {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    cedula: "",
    email: "",
    telefono: "",
    facultad: "",
    especialidad: "",
    gradoAcademico: "",
    lineaInvestigacion: "",
    biografia: "",
    descripcionPersonal: "",
    orcid: "",
    googleScholar: "",
    researchGate: "",
    linkedin: "",
    fotoPerfil: null,
    fotoPerfilUrl: "",
  })

  const [originalData, setOriginalData] = useState({})
  const [errors, setErrors] = useState({})
  const [showEditModal, setShowEditModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [stats, setStats] = useState({
    publicaciones: 0,
    proyectos: 0,
    colaboraciones: 0,
  })

  useEffect(() => {
    loadUserProfile()
    loadUserStats()
  }, [user])

  const loadUserProfile = () => {
    const usuarios = JSON.parse(localStorage.getItem("uleam_users") || "[]")
    const currentUser = usuarios.find((u) => u.id === user.id)

    if (currentUser) {
      const userData = {
        nombres: currentUser.nombres || "",
        apellidos: currentUser.apellidos || "",
        cedula: currentUser.cedula || "",
        email: currentUser.email || "",
        telefono: currentUser.telefono || "",
        facultad: currentUser.facultad || "",
        especialidad: currentUser.especialidad || "",
        gradoAcademico: currentUser.gradoAcademico || "",
        lineaInvestigacion: currentUser.lineaInvestigacion || "",
        biografia: currentUser.biografia || "",
        descripcionPersonal: currentUser.descripcionPersonal || "",
        orcid: currentUser.orcid || "",
        googleScholar: currentUser.googleScholar || "",
        researchGate: currentUser.researchGate || "",
        linkedin: currentUser.linkedin || "",
        fotoPerfil: null,
        fotoPerfilUrl: currentUser.fotoPerfilUrl || "",
      }
      setFormData(userData)
      setOriginalData(userData)
    }
  }

  const loadUserStats = () => {
    const publicaciones = JSON.parse(localStorage.getItem("uleam_publicaciones") || "[]")
    const proyectos = JSON.parse(localStorage.getItem("uleam_proyectos") || "[]")

    const misPublicaciones = publicaciones.filter((p) => p.autorId === user.id)
    const misProyectos = proyectos.filter((p) => p.autorId === user.id)

    const colaboradores = new Set()
    misPublicaciones.forEach((pub) => {
      if (pub.autores) {
        pub.autores.split(",").forEach((autor) => {
          const autorLimpio = autor.trim()
          if (autorLimpio !== user.name) {
            colaboradores.add(autorLimpio)
          }
        })
      }
    })

    setStats({
      publicaciones: misPublicaciones.length,
      proyectos: misProyectos.length,
      colaboraciones: colaboradores.size,
    })
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"]

      if (!allowedTypes.includes(file.type)) {
        alert("Solo se permiten archivos de imagen (JPG, PNG, GIF)")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen no puede ser mayor a 5MB")
        return
      }

      // Crear URL temporal para mostrar la imagen
      const imageUrl = URL.createObjectURL(file)
      setFormData({ ...formData, fotoPerfil: file, fotoPerfilUrl: imageUrl })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nombres.trim()) {
      newErrors.nombres = "Los nombres son obligatorios"
    } else if (formData.nombres.trim().length < 2) {
      newErrors.nombres = "Los nombres deben tener al menos 2 caracteres"
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombres)) {
      newErrors.nombres = "Los nombres solo pueden contener letras y espacios"
    }

    if (!formData.apellidos.trim()) {
      newErrors.apellidos = "Los apellidos son obligatorios"
    } else if (formData.apellidos.trim().length < 2) {
      newErrors.apellidos = "Los apellidos deben tener al menos 2 caracteres"
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.apellidos)) {
      newErrors.apellidos = "Los apellidos solo pueden contener letras y espacios"
    }

    if (!formData.cedula) {
      newErrors.cedula = "La cédula es obligatoria"
    } else if (!/^\d{10}$/.test(formData.cedula)) {
      newErrors.cedula = "La cédula debe tener exactamente 10 dígitos"
    }

    if (!formData.email) {
      newErrors.email = "El correo electrónico es obligatorio"
    } else if (!/^e\d{10}@live\.uleam\.edu\.ec$/.test(formData.email)) {
      newErrors.email = "Debe usar el formato institucional: e1312345678@live.uleam.edu.ec"
    }

    if (!formData.telefono) {
      newErrors.telefono = "El teléfono es obligatorio"
    } else if (!/^09\d{8}$/.test(formData.telefono)) {
      newErrors.telefono = "El teléfono debe tener formato ecuatoriano (09xxxxxxxx)"
    }

    if (!formData.facultad) {
      newErrors.facultad = "La facultad es obligatoria"
    }

    if (formData.descripcionPersonal && formData.descripcionPersonal.trim().length > 300) {
      newErrors.descripcionPersonal = "La descripción personal no puede exceder 300 caracteres"
    }

    if (formData.biografia && formData.biografia.trim().length > 500) {
      newErrors.biografia = "La biografía no puede exceder 500 caracteres"
    }

    if (formData.orcid && !/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(formData.orcid)) {
      newErrors.orcid = "Formato de ORCID inválido. Use: 0000-0000-0000-0000"
    }

    const urlPattern = /^https?:\/\/.+\..+/
    if (formData.googleScholar && !urlPattern.test(formData.googleScholar)) {
      newErrors.googleScholar = "Ingrese una URL válida para Google Scholar"
    }
    if (formData.researchGate && !urlPattern.test(formData.researchGate)) {
      newErrors.researchGate = "Ingrese una URL válida para ResearchGate"
    }
    if (formData.linkedin && !urlPattern.test(formData.linkedin)) {
      newErrors.linkedin = "Ingrese una URL válida para LinkedIn"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleOpenEditModal = () => {
    setFormData(originalData)
    setErrors({})
    setShowEditModal(true)
  }

  const handleCloseEditModal = () => {
    setFormData(originalData)
    setErrors({})
    setShowEditModal(false)
  }

  const handleSaveClick = () => {
    if (validateForm()) {
      setShowConfirmModal(true)
    }
  }

  const handleConfirmSave = () => {
    const usuarios = JSON.parse(localStorage.getItem("uleam_users") || "[]")
    const userIndex = usuarios.findIndex((u) => u.id === user.id)

    if (userIndex !== -1) {
      // Simular guardado de imagen (en producción se subiría a un servidor)
      const finalData = { ...formData }
      if (formData.fotoPerfil) {
        finalData.fotoPerfilUrl = `uploads/profiles/${user.id}_${Date.now()}.jpg`
      }

      usuarios[userIndex] = {
        ...usuarios[userIndex],
        ...finalData,
        fechaModificacion: new Date().toISOString(),
      }
      localStorage.setItem("uleam_users", JSON.stringify(usuarios))
      setOriginalData(finalData)
      setShowEditModal(false)
      setShowConfirmModal(false)
      alert("✅ Perfil actualizado exitosamente")
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const facultades = [
    { value: "ciencias-vida-tecnologias", label: "Facultad de Ciencias de la Vida y Tecnologías" },
    { value: "ciencias-salud", label: "Facultad de Ciencias de la Salud" },
    { value: "ciencias-sociales-derecho-bienestar", label: "Facultad de Ciencias Sociales Derecho y Bienestar" },
    {
      value: "ciencias-administrativas-contables-comercio",
      label: "Facultad Ciencias Administrativas, Contables y Comercio",
    },
    { value: "educacion-turismo-artes-humanidades", label: "Facultad de Educación Turismo Artes y Humanidades" },
    { value: "ingenieria-industria-arquitectura", label: "Facultad Ingeniería, Industria y Arquitectura" },
  ]

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Mi Perfil</h1>
        <p className="page-subtitle">Gestiona tu información personal y académica</p>
      </div>

      {/* Profile Header with Photo */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <div className="card-content" style={{ display: "flex", alignItems: "center", gap: "20px", padding: "30px" }}>
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                backgroundColor: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                border: "3px solid #1e3c72",
              }}
            >
              {originalData.fotoPerfilUrl ? (
                <img
                  src={originalData.fotoPerfilUrl || "/placeholder.svg"}
                  alt="Foto de perfil"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ fontSize: "48px", color: "#666" }}>
                  {originalData.nombres ? originalData.nombres.charAt(0).toUpperCase() : "?"}
                </div>
              )}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: "0 0 10px 0", color: "#1e3c72" }}>
              {originalData.nombres} {originalData.apellidos}
            </h2>
            <p style={{ margin: "0 0 5px 0", color: "#666", fontSize: "16px" }}>
              <strong>
                {user.role === "estudiante" ? "Estudiante" : user.role === "docente" ? "Docente" : "Investigador"}
              </strong>
            </p>
            <p style={{ margin: "0 0 5px 0", color: "#666" }}>
              {facultades.find((f) => f.value === originalData.facultad)?.label || "Facultad no especificada"}
            </p>
            <p style={{ margin: "0 0 15px 0", color: "#666" }}>{originalData.email}</p>
            {originalData.descripcionPersonal && (
              <p style={{ margin: "0", color: "#555", fontStyle: "italic", fontSize: "14px" }}>
                "{originalData.descripcionPersonal}"
              </p>
            )}
          </div>
          <button className="btn btn-primary" onClick={handleOpenEditModal}>
            Editar Perfil
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.publicaciones}</div>
          <div className="stat-label">Publicaciones</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.proyectos}</div>
          <div className="stat-label">Proyectos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.colaboraciones}</div>
          <div className="stat-label">Colaboraciones</div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Información Personal</h2>
        </div>
        <div className="card-content">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Nombres</label>
              <div className="form-display">{originalData.nombres || "No especificado"}</div>
            </div>
            <div className="form-group">
              <label className="form-label">Apellidos</label>
              <div className="form-display">{originalData.apellidos || "No especificado"}</div>
            </div>
            <div className="form-group">
              <label className="form-label">Cédula</label>
              <div className="form-display">{originalData.cedula || "No especificado"}</div>
            </div>
            <div className="form-group">
              <label className="form-label">Teléfono</label>
              <div className="form-display">{originalData.telefono || "No especificado"}</div>
            </div>
            <div className="form-group form-full">
              <label className="form-label">Email Institucional</label>
              <div className="form-display">{originalData.email || "No especificado"}</div>
            </div>

            {user.role !== "estudiante" && (
              <>
                <div className="form-group">
                  <label className="form-label">Especialidad</label>
                  <div className="form-display">{originalData.especialidad || "No especificado"}</div>
                </div>
                <div className="form-group">
                  <label className="form-label">Grado Académico</label>
                  <div className="form-display">{originalData.gradoAcademico || "No especificado"}</div>
                </div>
              </>
            )}

            <div className="form-group form-full">
              <label className="form-label">Línea de Investigación</label>
              <div className="form-display">{originalData.lineaInvestigacion || "No especificado"}</div>
            </div>

            {originalData.biografia && (
              <div className="form-group form-full">
                <label className="form-label">Biografía</label>
                <div className="form-display">{originalData.biografia}</div>
              </div>
            )}

            {/* Redes Académicas */}
            {(originalData.orcid ||
              originalData.googleScholar ||
              originalData.researchGate ||
              originalData.linkedin) && (
              <div className="form-group form-full">
                <label className="form-label">Redes Académicas</label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {originalData.orcid && (
                    <a
                      href={`https://orcid.org/${originalData.orcid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                    >
                      ORCID
                    </a>
                  )}
                  {originalData.googleScholar && (
                    <a
                      href={originalData.googleScholar}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                    >
                      Google Scholar
                    </a>
                  )}
                  {originalData.researchGate && (
                    <a
                      href={originalData.researchGate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                    >
                      ResearchGate
                    </a>
                  )}
                  {originalData.linkedin && (
                    <a
                      href={originalData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: "800px", width: "95%" }}>
            <div className="modal-header">
              <h2 className="modal-title">Editar Perfil</h2>
              <button className="modal-close" onClick={handleCloseEditModal}>
                ×
              </button>
            </div>

            <div className="modal-content" style={{ maxHeight: "70vh", overflowY: "auto" }}>
              <div className="form-grid">
                {/* Foto de Perfil */}
                <div className="form-group form-full" style={{ textAlign: "center", marginBottom: "20px" }}>
                  <label className="form-label">Foto de Perfil</label>
                  <div style={{ marginBottom: "10px" }}>
                    <div
                      style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        backgroundColor: "#f0f0f0",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        border: "2px solid #ddd",
                      }}
                    >
                      {formData.fotoPerfilUrl ? (
                        <img
                          src={formData.fotoPerfilUrl || "/placeholder.svg"}
                          alt="Foto de perfil"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <div style={{ fontSize: "36px", color: "#666" }}>
                          {formData.nombres ? formData.nombres.charAt(0).toUpperCase() : "?"}
                        </div>
                      )}
                    </div>
                  </div>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ marginBottom: "5px" }} />
                  <small style={{ color: "#666", fontSize: "12px", display: "block" }}>JPG, PNG, GIF. Máximo 5MB</small>
                </div>

                {/* Descripción Personal */}
                <div className="form-group form-full">
                  <label className="form-label">Descripción Personal</label>
                  <textarea
                    className={`form-textarea ${errors.descripcionPersonal ? "error" : ""}`}
                    rows={2}
                    placeholder="Una breve descripción personal..."
                    value={formData.descripcionPersonal}
                    onChange={(e) => handleInputChange("descripcionPersonal", e.target.value)}
                  />
                  {errors.descripcionPersonal && <div className="error-message">{errors.descripcionPersonal}</div>}
                  <small style={{ color: "#666", fontSize: "12px" }}>
                    {formData.descripcionPersonal.length}/300 caracteres
                  </small>
                </div>

                {/* Información Básica */}
                <div className="form-group">
                  <label className="form-label">Nombres *</label>
                  <input
                    type="text"
                    className={`form-input ${errors.nombres ? "error" : ""}`}
                    value={formData.nombres}
                    onChange={(e) => handleInputChange("nombres", e.target.value)}
                  />
                  {errors.nombres && <div className="error-message">{errors.nombres}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Apellidos *</label>
                  <input
                    type="text"
                    className={`form-input ${errors.apellidos ? "error" : ""}`}
                    value={formData.apellidos}
                    onChange={(e) => handleInputChange("apellidos", e.target.value)}
                  />
                  {errors.apellidos && <div className="error-message">{errors.apellidos}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Cédula *</label>
                  <input
                    type="text"
                    className={`form-input ${errors.cedula ? "error" : ""}`}
                    value={formData.cedula}
                    onChange={(e) => handleInputChange("cedula", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  />
                  {errors.cedula && <div className="error-message">{errors.cedula}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Teléfono *</label>
                  <input
                    type="text"
                    className={`form-input ${errors.telefono ? "error" : ""}`}
                    value={formData.telefono}
                    onChange={(e) => handleInputChange("telefono", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  />
                  {errors.telefono && <div className="error-message">{errors.telefono}</div>}
                </div>

                <div className="form-group form-full">
                  <label className="form-label">Email Institucional *</label>
                  <input
                    type="email"
                    className={`form-input ${errors.email ? "error" : ""}`}
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value.toLowerCase())}
                  />
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Facultad *</label>
                  <select
                    className={`form-select ${errors.facultad ? "error" : ""}`}
                    value={formData.facultad}
                    onChange={(e) => handleInputChange("facultad", e.target.value)}
                  >
                    <option value="">Seleccionar facultad</option>
                    {facultades.map((facultad) => (
                      <option key={facultad.value} value={facultad.value}>
                        {facultad.label}
                      </option>
                    ))}
                  </select>
                  {errors.facultad && <div className="error-message">{errors.facultad}</div>}
                </div>

                {user.role !== "estudiante" && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Especialidad</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.especialidad}
                        onChange={(e) => handleInputChange("especialidad", e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Grado Académico</label>
                      <select
                        className="form-select"
                        value={formData.gradoAcademico}
                        onChange={(e) => handleInputChange("gradoAcademico", e.target.value)}
                      >
                        <option value="">Seleccionar grado</option>
                        <option value="licenciatura">Licenciatura</option>
                        <option value="ingenieria">Ingeniería</option>
                        <option value="maestria">Maestría</option>
                        <option value="doctorado">Doctorado</option>
                        <option value="postdoctorado">Postdoctorado</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="form-group form-full">
                  <label className="form-label">Línea de Investigación</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.lineaInvestigacion}
                    onChange={(e) => handleInputChange("lineaInvestigacion", e.target.value)}
                  />
                </div>

                <div className="form-group form-full">
                  <label className="form-label">Biografía</label>
                  <textarea
                    className={`form-textarea ${errors.biografia ? "error" : ""}`}
                    rows={4}
                    value={formData.biografia}
                    onChange={(e) => handleInputChange("biografia", e.target.value)}
                  />
                  {errors.biografia && <div className="error-message">{errors.biografia}</div>}
                  <small style={{ color: "#666", fontSize: "12px" }}>{formData.biografia.length}/500 caracteres</small>
                </div>

                {/* Redes Académicas */}
                <div className="form-group">
                  <label className="form-label">ORCID</label>
                  <input
                    type="text"
                    className={`form-input ${errors.orcid ? "error" : ""}`}
                    placeholder="0000-0000-0000-0000"
                    value={formData.orcid}
                    onChange={(e) => handleInputChange("orcid", e.target.value)}
                  />
                  {errors.orcid && <div className="error-message">{errors.orcid}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Google Scholar</label>
                  <input
                    type="url"
                    className={`form-input ${errors.googleScholar ? "error" : ""}`}
                    value={formData.googleScholar}
                    onChange={(e) => handleInputChange("googleScholar", e.target.value)}
                  />
                  {errors.googleScholar && <div className="error-message">{errors.googleScholar}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">ResearchGate</label>
                  <input
                    type="url"
                    className={`form-input ${errors.researchGate ? "error" : ""}`}
                    value={formData.researchGate}
                    onChange={(e) => handleInputChange("researchGate", e.target.value)}
                  />
                  {errors.researchGate && <div className="error-message">{errors.researchGate}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">LinkedIn</label>
                  <input
                    type="url"
                    className={`form-input ${errors.linkedin ? "error" : ""}`}
                    value={formData.linkedin}
                    onChange={(e) => handleInputChange("linkedin", e.target.value)}
                  />
                  {errors.linkedin && <div className="error-message">{errors.linkedin}</div>}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handleCloseEditModal}>
                Cancelar
              </button>
              <button className="btn btn-success" onClick={handleSaveClick}>
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Confirmar Cambios</h2>
              <button className="modal-close" onClick={() => setShowConfirmModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-content">
              <p>¿Está seguro que desea guardar los cambios realizados en su perfil?</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>
                Cancelar
              </button>
              <button className="btn btn-success" onClick={handleConfirmSave}>
                Confirmar y Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Perfil
