"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, FileText, Users, Settings, Plus, LogOut } from "lucide-react"
import RegistroProduccion from "../registro/page"
import ListaProduccion from "../lista/page"
import PanelAdmin from "../admin/page"

interface DashboardProps {
  userType: string
}

export default function Dashboard({ userType }: DashboardProps) {
  const [currentView, setCurrentView] = useState("dashboard")

  const getUserTypeLabel = (type: string) => {
    const labels = {
      estudiante: "Estudiante",
      docente: "Docente",
      investigador: "Investigador",
      administrador: "Administrador",
    }
    return labels[type as keyof typeof labels] || type
  }

  const getUserTypeColor = (type: string) => {
    const colors = {
      estudiante: "bg-green-100 text-green-800",
      docente: "bg-blue-100 text-blue-800",
      investigador: "bg-purple-100 text-purple-800",
      administrador: "bg-red-100 text-red-800",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const handleLogout = () => {
    localStorage.removeItem("uleam_user")
    window.location.reload()
  }

  if (currentView === "registro") {
    return <RegistroProduccion userType={userType} onBack={() => setCurrentView("dashboard")} />
  }

  if (currentView === "lista") {
    return <ListaProduccion userType={userType} onBack={() => setCurrentView("dashboard")} />
  }

  if (currentView === "admin" && userType === "administrador") {
    return <PanelAdmin onBack={() => setCurrentView("dashboard")} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <img src="https://www.uleam.edu.ec/wp-content/uploads/2012/09/LOGO-ULEAM.png" alt="Logo ULEAM" className="h-10" />
              <h1 className="text-xl font-semibold text-gray-900">Control de Producción Científica</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={getUserTypeColor(userType)}>{getUserTypeLabel(userType)}</Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido, {getUserTypeLabel(userType)}</h2>
          <p className="text-gray-600">Gestiona tu producción científica de manera sencilla</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mis Publicaciones</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Proyectos Activos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">En desarrollo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Colaboraciones</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Investigadores</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setCurrentView("registro")}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2 text-blue-600" />
                Registrar Producción
              </CardTitle>
              <CardDescription>Añade una nueva publicación, proyecto o investigación</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setCurrentView("lista")}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-green-600" />
                Ver Mis Producciones
              </CardTitle>
              <CardDescription>Consulta y gestiona tus trabajos registrados</CardDescription>
            </CardHeader>
          </Card>

          {userType === "administrador" && (
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setCurrentView("admin")}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-red-600" />
                  Panel Administrativo
                </CardTitle>
                <CardDescription>Gestionar usuarios y configuraciones del sistema</CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
