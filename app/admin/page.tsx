"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Users, FileText, Settings, Search, UserCheck, UserX } from "lucide-react"
import { useState, useEffect } from "react"

interface PanelAdminProps {
  onBack: () => void
}

export default function PanelAdmin({ onBack }: PanelAdminProps) {
  const [usuarios, setUsuarios] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("usuarios")

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("uleam_users") || "[]")
    setUsuarios(savedUsers)
  }, [])

  const filteredUsuarios = usuarios.filter(
    (user) =>
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getUserTypeColor = (tipo: string) => {
    const colors = {
      estudiante: "bg-green-100 text-green-800",
      docente: "bg-blue-100 text-blue-800",
      investigador: "bg-purple-100 text-purple-800",
      administrador: "bg-red-100 text-red-800",
    }
    return colors[tipo as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getEstadoColor = (estado: string) => {
    return estado === "activo" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">Panel de Administración</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+12 este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Producciones Totales</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+89 este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142</div>
              <p className="text-xs text-muted-foreground">91% del total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes Revisión</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">Requieren atención</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <Button variant={activeTab === "usuarios" ? "default" : "outline"} onClick={() => setActiveTab("usuarios")}>
              Gestión de Usuarios
            </Button>
            <Button variant={activeTab === "reportes" ? "default" : "outline"} onClick={() => setActiveTab("reportes")}>
              Reportes
            </Button>
          </div>
        </div>

        {activeTab === "usuarios" && (
          <>
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar usuarios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Users List */}
            <div className="space-y-4">
              {filteredUsuarios.map((usuario) => (
                <Card key={usuario.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{usuario.nombre}</CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                          <strong>Email:</strong> {usuario.email}
                        </CardDescription>
                        <CardDescription className="text-sm text-gray-600 mt-1">
                          <strong>Producciones:</strong> {usuario.producciones}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={getUserTypeColor(usuario.tipo)}>
                          {usuario.tipo.charAt(0).toUpperCase() + usuario.tipo.slice(1)}
                        </Badge>
                        <Badge className={getEstadoColor(usuario.estado)}>
                          {usuario.estado.charAt(0).toUpperCase() + usuario.estado.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        Ver Perfil
                      </Button>
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      {usuario.estado === "activo" ? (
                        <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                          <UserX className="w-4 h-4 mr-2" />
                          Desactivar
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="text-green-600 bg-transparent">
                          <UserCheck className="w-4 h-4 mr-2" />
                          Activar
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {activeTab === "reportes" && (
          <Card>
            <CardHeader>
              <CardTitle>Reportes del Sistema</CardTitle>
              <CardDescription>Estadísticas y reportes de la producción científica</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col bg-transparent">
                  <FileText className="w-6 h-6 mb-2" />
                  Reporte de Producciones
                </Button>
                <Button variant="outline" className="h-20 flex flex-col bg-transparent">
                  <Users className="w-6 h-6 mb-2" />
                  Reporte de Usuarios
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
