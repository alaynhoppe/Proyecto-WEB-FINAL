"use client"

import { useState, useEffect } from "react"

const Reportes = ({ user }) => {
  const [stats, setStats] = useState({
    totalPublicaciones: 0,
    totalProyectos: 0,
    totalUsuarios: 0,
    publicacionesValidadas: 0,
    proyectosValidados: 0,
    publicacionesPendientes: 0,
    proyectosPendientes: 0,
    publicacionesPorTipo: {},
    usuariosPorTipo: {},
    autoresMasActivos: [],
  })

  useEffect(() => {
    generateReports()
  }, [])

  const generateReports = () => {
    const publicaciones = JSON.parse(localStorage.getItem("uleam_publicaciones") || "[]")
    const proyectos = JSON.parse(localStorage.getItem("uleam_proyectos") || "[]")
    const usuarios = JSON.parse(localStorage.getItem("uleam_users") || "[]")

    // Estadísticas básicas
    const totalPublicaciones = publicaciones.length
    const totalProyectos = proyectos.length
    const totalUsuarios = usuarios.length
    const publicacionesValidadas = publicaciones.filter((p) => p.validado === true).length
    const proyectosValidados = proyectos.filter((p) => p.validado === true).length
    const publicacionesPendientes = publicaciones.filter((p) => p.validado === undefined || p.validado === null).length
    const proyectosPendientes = proyectos.filter((p) => p.validado === undefined || p.validado === null).length

    // Publicaciones por tipo
    const publicacionesPorTipo = {}
    publicaciones.forEach((pub) => {
      publicacionesPorTipo[pub.tipo] = (publicacionesPorTipo[pub.tipo] || 0) + 1
    })

    // Usuarios por tipo
    const usuariosPorTipo = {}
    usuarios.forEach((usuario) => {
      usuariosPorTipo[usuario.userType] = (usuariosPorTipo[usuario.userType] || 0) + 1
    })

    // Autores más activos
    const autoresCount = {}
    publicaciones.forEach((pub) => {
      if (pub.autorNombre) {
        autoresCount[pub.autorNombre] = (autoresCount[pub.autorNombre] || 0) + 1
      }
    })
    const autoresMasActivos = Object.entries(autoresCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([nombre, count]) => ({ nombre, publicaciones: count }))

    setStats({
      totalPublicaciones,
      totalProyectos,
      totalUsuarios,
      publicacionesValidadas,
      proyectosValidados,
      publicacionesPendientes,
      proyectosPendientes,
      publicacionesPorTipo,
      usuariosPorTipo,
      autoresMasActivos,
    })
  }

  const exportReport = () => {
    const reportData = {
      fecha: new Date().toISOString(),
      generadoPor: user.nombres + " " + user.apellidos,
      estadisticas: stats,
    }

    const dataStr = JSON.stringify(reportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `reporte_uleam.json`
    link.click()
    alert("Reporte exportado")
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Reportes del Sistema</h1>
        <p className="page-subtitle">Estadísticas de la producción científica</p>
      </div>

      {/* Export Button */}
      <div style={{ marginBottom: "30px" }}>
        <button className="btn btn-success" onClick={exportReport}>
          Exportar Reporte
        </button>
      </div>

      {/* Main Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.totalPublicaciones}</div>
          <div className="stat-label">Total Publicaciones</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalProyectos}</div>
          <div className="stat-label">Total Proyectos</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalUsuarios}</div>
          <div className="stat-label">Total Usuarios</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {stats.totalPublicaciones + stats.totalProyectos > 0
              ? Math.round(
                  ((stats.publicacionesValidadas + stats.proyectosValidados) /
                    (stats.totalPublicaciones + stats.totalProyectos)) *
                    100,
                )
              : 0}
            %
          </div>
          <div className="stat-label">Tasa de Validación</div>
        </div>
      </div>

      {/* Validation Status */}
      <div className="card" style={{ marginBottom: "30px" }}>
        <div className="card-header">
          <h2 className="card-title">Estado de Validaciones</h2>
        </div>
        <div className="card-content">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.publicacionesValidadas + stats.proyectosValidados}</div>
              <div className="stat-label">Validados</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.publicacionesPendientes + stats.proyectosPendientes}</div>
              <div className="stat-label">Pendientes</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.totalPublicaciones + stats.totalProyectos}</div>
              <div className="stat-label">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Reports */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {/* Publications by Type */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Publicaciones por Tipo</h3>
          </div>
          <div className="card-content">
            {Object.keys(stats.publicacionesPorTipo).length === 0 ? (
              <p>No hay datos disponibles</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Tipo</th>
                    <th style={{ padding: "8px", textAlign: "center", borderBottom: "1px solid #ddd" }}>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats.publicacionesPorTipo).map(([tipo, cantidad]) => (
                    <tr key={tipo}>
                      <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>{tipo}</td>
                      <td style={{ padding: "8px", textAlign: "center", borderBottom: "1px solid #ddd" }}>
                        {cantidad}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Users by Type */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Usuarios por Tipo</h3>
          </div>
          <div className="card-content">
            {Object.keys(stats.usuariosPorTipo).length === 0 ? (
              <p>No hay datos disponibles</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Tipo</th>
                    <th style={{ padding: "8px", textAlign: "center", borderBottom: "1px solid #ddd" }}>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stats.usuariosPorTipo).map(([tipo, cantidad]) => (
                    <tr key={tipo}>
                      <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                        {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                      </td>
                      <td style={{ padding: "8px", textAlign: "center", borderBottom: "1px solid #ddd" }}>
                        {cantidad}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Most Active Authors */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Autores Más Activos</h3>
          </div>
          <div className="card-content">
            {stats.autoresMasActivos.length === 0 ? (
              <p>No hay datos disponibles</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ padding: "8px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Autor</th>
                    <th style={{ padding: "8px", textAlign: "center", borderBottom: "1px solid #ddd" }}>
                      Publicaciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.autoresMasActivos.map((autor, index) => (
                    <tr key={index}>
                      <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>{autor.nombre}</td>
                      <td style={{ padding: "8px", textAlign: "center", borderBottom: "1px solid #ddd" }}>
                        <span className="badge badge-success">{autor.publicaciones}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="card" style={{ marginTop: "30px" }}>
        <div className="card-header">
          <h2 className="card-title">Resumen</h2>
        </div>
        <div className="card-content">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
            <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#007bff", marginBottom: "8px" }}>
                {stats.totalPublicaciones + stats.totalProyectos}
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>Total de Contenido</div>
            </div>
            <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#28a745", marginBottom: "8px" }}>
                {stats.totalPublicaciones + stats.totalProyectos > 0
                  ? Math.round(
                      ((stats.publicacionesValidadas + stats.proyectosValidados) /
                        (stats.totalPublicaciones + stats.totalProyectos)) *
                        100,
                    )
                  : 0}
                %
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>Tasa de Aprobación</div>
            </div>
            <div style={{ textAlign: "center", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "#17a2b8", marginBottom: "8px" }}>
                {stats.totalUsuarios}
              </div>
              <div style={{ fontSize: "14px", color: "#666" }}>Usuarios Registrados</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reportes
