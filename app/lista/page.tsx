"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Edit, Trash2, Eye } from "lucide-react"
import { useState, useEffect } from "react"

interface ListaProduccionProps {
  userType: string
  onBack: () => void
}

export default function ListaProduccion({ userType, onBack }: ListaProduccionProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [producciones, setProducciones] = useState([])

  useEffect(() => {
    const savedProductions = JSON.parse(localStorage.getItem("uleam_productions") || "[]")
    setProducciones(savedProductions)
  }, [])

  const filteredProducciones = producciones.filter(
    (prod) =>
      prod.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.autores.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getEstadoColor = (estado: string) => {
    return estado === "Publicado" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
  }

  const getTipoColor = (tipo: string) => {
    const colors = {
      "Artículo Científico": "bg-blue-100 text-blue-800",
      Libro: "bg-purple-100 text-purple-800",
      "Proyecto de Investigación": "bg-orange-100 text-orange-800",
      Tesis: "bg-red-100 text-red-800",
      Ponencia: "bg-indigo-100 text-indigo-800",
    }
    return colors[tipo as keyof typeof colors] || "bg-gray-100 text-gray-800"
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
            <h1 className="text-xl font-semibold text-gray-900">Mis Producciones Científicas</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por título o autor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {filteredProducciones.map((produccion) => (
            <Card key={produccion.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{produccion.titulo}</CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      <strong>Autores:</strong> {produccion.autores}
                    </CardDescription>
                    <CardDescription className="text-sm text-gray-600 mt-1">
                      <strong>Publicado en:</strong> {produccion.revista}
                    </CardDescription>
                    <CardDescription className="text-sm text-gray-600 mt-1">
                      <strong>Fecha:</strong> {new Date(produccion.fecha).toLocaleDateString("es-ES")}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getTipoColor(produccion.tipo)}>{produccion.tipo}</Badge>
                    <Badge className={getEstadoColor(produccion.estado)}>{produccion.estado}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducciones.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No se encontraron producciones científicas que coincidan con tu búsqueda.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
