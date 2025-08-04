"use client"

import { useState, useEffect } from "react"

const GestionUsuarios = ({ user }) => {
  const [usuarios, setUsuarios] = useState([])
  const [filteredUsuarios, setFilteredUsuarios] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    cedula: "",
    email: "",
    telefono: "",
    userType: "",
    facultad: "",
    password: "",
    activo: true,
  })

  useEffect(() => {
    loadUsuarios()
  }, [])

  useEffect(() => {
    filterUsuarios()
  }, [usuarios, searchTerm])

  const loadUsuarios = () => {
    const allUsuarios = JSON.parse(localStorage.getItem("uleam_users") || "[]")
    setUsuarios(allUsuarios)
  }

  const filterUsuarios = () => {
    let filtered = usuarios

    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          u.nombres?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredUsuarios(filtered)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.nombres || !formData.apellidos || !formData.email) {
      alert("Complete los campos obligatorios")
      return
    }

    const allUsuarios = JSON.parse(localStorage.getItem("uleam_users") || "[]")

    const userData = {
      id: editingUser ? editingUser.id : Date.now(),
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      cedula: formData.cedula,
      email: formData.email,
      telefono: formData.telefono,
      userType: formData.userType,
      facultad: formData.facultad,
      password: formData.password || editingUser?.password || "123456",
      activo: formData.activo,
      fechaRegistro: editingUser ? editingUser.fechaRegistro : new Date().toISOString(),
    }

    if (editingUser) {
      const index = allUsuarios.findIndex((u) => u.id === editingUser.id)
      allUsuarios[index] = userData
    } else {
      allUsuarios.push(userData)
    }

    localStorage.setItem("uleam_users", JSON.stringify(allUsuarios))
    loadUsuarios()
    resetForm()
    setShowModal(false)
    alert(editingUser ? "Usuario actualizado" : "Usuario creado")
  }

  const resetForm = () => {
    setFormData({
      nombres: "",
      apellidos: "",
      cedula: "",
      email: "",
      telefono: "",
      userType: "",
      facultad: "",
      password: "",
      activo: true,
    })
    setEditingUser(null)
  }

  const handleEdit = (usuario) => {
    setFormData({
      nombres: usuario.nombres || "",
      apellidos: usuario.apellidos || "",
      cedula: usuario.cedula || "",
      email: usuario.email || "",
      telefono: usuario.telefono || "",
      userType: usuario.userType || "",
      facultad: usuario.facultad || "",
      password: "",
      activo: usuario.activo !== false,
    })
    setEditingUser(usuario)
    setShowModal(true)
  }

  const handleDelete = (id) => {
    if (confirm("¿Eliminar este usuario?")) {
      const allUsuarios = JSON.parse(localStorage.getItem("uleam_users") || "[]")
      const filtered = allUsuarios.filter((u) => u.id !== id)
      localStorage.setItem("uleam_users", JSON.stringify(filtered))
      loadUsuarios()
      alert("Usuario eliminado")
    }
  }

  const facultades = [
    { value: "ciencias-vida-tecnologias", label: "Ciencias de la Vida y Tecnologías" },
    { value: "ciencias-salud", label: "Ciencias de la Salud" },
    { value: "ciencias-sociales", label: "Ciencias Sociales" },
    { value: "ciencias-administrativas", label: "Ciencias Administrativas" },
    { value: "educacion-artes", label: "Educación y Artes" },
    { value: "ingenieria", label: "Ingeniería" },
  ]

  const userTypes = [
    { value: "estudiante", label: "Estudiante" },
    { value: "docente", label: "Docente" },
    { value: "investigador", label: "Investigador" },
  ]

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Gestión de Usuarios</h1>
        <p className="page-subtitle">Administra los usuarios del sistema</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{filteredUsuarios.length}</div>
          <div className="stat-label">Total Usuarios</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{filteredUsuarios.filter((u) => u.activo !== false).length}</div>
          <div className="stat-label">Activos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{filteredUsuarios.filter((u) => u.userType === "estudiante").length}</div>
          <div className="stat-label">Estudiantes</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{filteredUsuarios.filter((u) => u.userType === "docente").length}</div>
          <div className="stat-label">Docentes</div>
        </div>
      </div>

      {/* Search */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <div className="card-content">
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <input
              type="text"
              className="form-input"
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              className="btn btn-primary"
              onClick={() => {
                resetForm()
                setShowModal(true)
              }}
            >
              Nuevo Usuario
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-content">
          {filteredUsuarios.length === 0 ? (
            <div className="empty-state">
              <p>No se encontraron usuarios.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc" }}>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Nombre</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Email</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Tipo</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Estado</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>
                        {usuario.nombres} {usuario.apellidos}
                      </td>
                      <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>{usuario.email}</td>
                      <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>
                        <span className="badge badge-info">
                          {userTypes.find((t) => t.value === usuario.userType)?.label || usuario.userType}
                        </span>
                      </td>
                      <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>
                        <span className={`badge ${usuario.activo !== false ? "badge-success" : "badge-danger"}`}>
                          {usuario.activo !== false ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td style={{ padding: "12px", borderBottom: "1px solid #e2e8f0" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(usuario)}>
                            Editar
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(usuario.id)}>
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: "600px", width: "95%" }}>
            <div className="modal-header">
              <h2>{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Nombres *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.nombres}
                      onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Apellidos *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.apellidos}
                      onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cédula</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.cedula}
                      onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Teléfono</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    />
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tipo de Usuario</label>
                    <select
                      className="form-input"
                      value={formData.userType}
                      onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                    >
                      <option value="">Seleccionar</option>
                      {userTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Facultad</label>
                    <select
                      className="form-input"
                      value={formData.facultad}
                      onChange={(e) => setFormData({ ...formData, facultad: e.target.value })}
                    >
                      <option value="">Seleccionar</option>
                      {facultades.map((facultad) => (
                        <option key={facultad.value} value={facultad.value}>
                          {facultad.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label">{editingUser ? "Nueva Contraseña (opcional)" : "Contraseña"}</label>
                    <input
                      type="password"
                      className="form-input"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>

                  <div className="form-group form-full">
                    <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="checkbox"
                        checked={formData.activo}
                        onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                      />
                      Usuario activo
                    </label>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingUser ? "Actualizar" : "Crear"}
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

export default GestionUsuarios
