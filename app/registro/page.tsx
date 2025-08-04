"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"

interface RegistroProduccionProps {
  userType: string
  onBack: () => void
}

export default function RegistroProduccion({ userType, onBack }: RegistroProduccionProps) {
  const [formData, setFormData] = useState({
    titulo: "",
    tipo: "",
    autores: "",
    fecha: "",
    revista: "",
    descripcion: "",
    palabrasClave: "",
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.titulo.trim()) {
      newErrors.titulo = "El título es obligatorio"
    } else if (formData.titulo.trim().length < 10) {
      newErrors.titulo = "El título debe tener al menos 10 caracteres"
    }

    if (!formData.tipo) {
      newErrors.tipo = "Debe seleccionar un tipo de producción"
    }

    if (!formData.autores.trim()) {
      newErrors.autores = "Los autores son obligatorios"
    }

    if (formData.fecha && new Date(formData.fecha) > new Date()) {
      newErrors.fecha = "La fecha no puede ser futura"
    }

    if (formData.descripcion && formData.descripcion.length > 500) {
      newErrors.descripcion = "La descripción no puede exceder 500 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Guardar producción en localStorage
    const existingProductions = JSON.parse(localStorage.getItem("uleam_productions") || "[]")
    const newProduction = {
      id: Date.now(),
      ...formData,
      fechaCreacion: new Date().toISOString(),
      estado: "En Proceso",
    }
    existingProductions.push(newProduction)
    localStorage.setItem("uleam_productions", JSON.stringify(existingProductions))

    alert("Producción científica registrada exitosamente!")
    onBack()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
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
            <h1 className="text-xl font-semibold text-gray-900">Registrar Nueva Producción Científica</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Información de la Producción</CardTitle>
            <CardDescription>Completa todos los campos para registrar tu trabajo científico</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    placeholder="Título de la investigación"
                    value={formData.titulo}
                    onChange={(e) => handleInputChange("titulo", e.target.value)}
                    required
                    className={errors.titulo ? "border-red-500" : ""}
                  />
                  {errors.titulo && <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Producción *</Label>
                  <Select value={formData.tipo} onValueChange={(value) => handleInputChange("tipo", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="articulo">Artículo Científico</SelectItem>
                      <SelectItem value="libro">Libro</SelectItem>
                      <SelectItem value="capitulo">Capítulo de Libro</SelectItem>
                      <SelectItem value="tesis">Tesis</SelectItem>
                      <SelectItem value="proyecto">Proyecto de Investigación</SelectItem>
                      <SelectItem value="ponencia">Ponencia</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipo && <p className="text-red-500 text-sm mt-1">{errors.tipo}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="autores">Autores *</Label>
                  <Input
                    id="autores"
                    placeholder="Nombres de los autores (separados por comas)"
                    value={formData.autores}
                    onChange={(e) => handleInputChange("autores", e.target.value)}
                    required
                    className={errors.autores ? "border-red-500" : ""}
                  />
                  {errors.autores && <p className="text-red-500 text-sm mt-1">{errors.autores}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha de Publicación</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => handleInputChange("fecha", e.target.value)}
                    className={errors.fecha ? "border-red-500" : ""}
                  />
                  {errors.fecha && <p className="text-red-500 text-sm mt-1">{errors.fecha}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="revista">Revista/Editorial</Label>
                  <Input
                    id="revista"
                    placeholder="Nombre de la revista o editorial"
                    value={formData.revista}
                    onChange={(e) => handleInputChange("revista", e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="descripcion">Descripción/Resumen</Label>
                  <Textarea
                    id="descripcion"
                    placeholder="Breve descripción del trabajo realizado"
                    rows={4}
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange("descripcion", e.target.value)}
                    className={errors.descripcion ? "border-red-500" : ""}
                  />
                  {errors.descripcion && <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="palabrasClave">Palabras Clave</Label>
                  <Input
                    id="palabrasClave"
                    placeholder="Palabras clave separadas por comas"
                    value={formData.palabrasClave}
                    onChange={(e) => handleInputChange("palabrasClave", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={onBack}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Producción
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
