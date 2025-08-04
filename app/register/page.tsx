"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, UserPlus } from "lucide-react"

interface RegisterPageProps {
  onBack: () => void
  onRegisterSuccess: () => void
}

export default function RegisterPage({ onBack, onRegisterSuccess }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    cedula: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    userType: "",
    facultad: "",
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    // Validar nombres
    if (!formData.nombres.trim()) {
      newErrors.nombres = "Los nombres son obligatorios"
    } else if (formData.nombres.trim().length < 2) {
      newErrors.nombres = "Los nombres deben tener al menos 2 caracteres"
    }

    // Validar apellidos
    if (!formData.apellidos.trim()) {
      newErrors.apellidos = "Los apellidos son obligatorios"
    } else if (formData.apellidos.trim().length < 2) {
      newErrors.apellidos = "Los apellidos deben tener al menos 2 caracteres"
    }

    // Validar cédula (Ecuador - 10 dígitos)
    if (!formData.cedula) {
      newErrors.cedula = "La cédula es obligatoria"
    } else if (!/^\d{10}$/.test(formData.cedula)) {
      newErrors.cedula = "La cédula debe tener exactamente 10 dígitos"
    }

    // Validar email
    if (!formData.email) {
      newErrors.email = "El correo electrónico es obligatorio"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido"
    } else if (!formData.email.includes("uleam.edu.ec") && !formData.email.includes("est.uleam.edu.ec")) {
      newErrors.email = "Debe usar un correo institucional de ULEAM (@uleam.edu.ec o @est.uleam.edu.ec)"
    }

    // Validar teléfono
    if (!formData.telefono) {
      newErrors.telefono = "El teléfono es obligatorio"
    } else if (!/^09\d{8}$/.test(formData.telefono)) {
      newErrors.telefono = "El teléfono debe tener formato ecuatoriano (09xxxxxxxx)"
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria"
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres"
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Debe confirmar la contraseña"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    // Validar tipo de usuario
    if (!formData.userType) {
      newErrors.userType = "Debe seleccionar un tipo de usuario"
    }

    // Validar facultad
    if (!formData.facultad) {
      newErrors.facultad = "Debe seleccionar una facultad"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Guardar usuario en localStorage
      const existingUsers = JSON.parse(localStorage.getItem("uleam_users") || "[]")
      const newUser = {
        id: Date.now(),
        ...formData,
        fechaRegistro: new Date().toISOString(),
      }
      existingUsers.push(newUser)
      localStorage.setItem("uleam_users", JSON.stringify(existingUsers))

      onRegisterSuccess()
    } catch (error) {
      alert("Error al registrar usuario. Intente nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center mb-4">
            <Button variant="ghost" onClick={onBack} className="mr-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <img src="/uleam-logo.png" alt="Logo ULEAM" className="h-16 mx-auto" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-800">Registro de Usuario</CardTitle>
          <CardDescription>Universidad Laica Eloy Alfaro de Manabí</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombres */}
              <div className="space-y-2">
                <Label htmlFor="nombres">Nombres *</Label>
                <Input
                  id="nombres"
                  placeholder="Ingrese sus nombres"
                  value={formData.nombres}
                  onChange={(e) => handleInputChange("nombres", e.target.value)}
                  className={errors.nombres ? "border-red-500" : ""}
                />
                {errors.nombres && <p className="text-red-500 text-sm">{errors.nombres}</p>}
              </div>

              {/* Apellidos */}
              <div className="space-y-2">
                <Label htmlFor="apellidos">Apellidos *</Label>
                <Input
                  id="apellidos"
                  placeholder="Ingrese sus apellidos"
                  value={formData.apellidos}
                  onChange={(e) => handleInputChange("apellidos", e.target.value)}
                  className={errors.apellidos ? "border-red-500" : ""}
                />
                {errors.apellidos && <p className="text-red-500 text-sm">{errors.apellidos}</p>}
              </div>

              {/* Cédula */}
              <div className="space-y-2">
                <Label htmlFor="cedula">Cédula *</Label>
                <Input
                  id="cedula"
                  placeholder="1234567890"
                  value={formData.cedula}
                  onChange={(e) => handleInputChange("cedula", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className={errors.cedula ? "border-red-500" : ""}
                />
                {errors.cedula && <p className="text-red-500 text-sm">{errors.cedula}</p>}
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  placeholder="0987654321"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className={errors.telefono ? "border-red-500" : ""}
                />
                {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Correo Institucional *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nombre.apellido@uleam.edu.ec"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value.toLowerCase())}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              {/* Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>

              {/* Confirmar Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
              </div>

              {/* Tipo de Usuario */}
              <div className="space-y-2">
                <Label htmlFor="userType">Tipo de Usuario *</Label>
                <Select value={formData.userType} onValueChange={(value) => handleInputChange("userType", value)}>
                  <SelectTrigger className={errors.userType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecciona tu rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="estudiante">Estudiante</SelectItem>
                    <SelectItem value="docente">Docente</SelectItem>
                    <SelectItem value="investigador">Investigador</SelectItem>
                  </SelectContent>
                </Select>
                {errors.userType && <p className="text-red-500 text-sm">{errors.userType}</p>}
              </div>

              {/* Facultad */}
              <div className="space-y-2">
                <Label htmlFor="facultad">Facultad *</Label>
                <Select value={formData.facultad} onValueChange={(value) => handleInputChange("facultad", value)}>
                  <SelectTrigger className={errors.facultad ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecciona tu facultad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ciencias-vida-tecnologias">
                      Facultad de Ciencias de la Vida y Tecnologías
                    </SelectItem>
                    <SelectItem value="ciencias-salud">Facultad de Ciencias de la Salud</SelectItem>
                    <SelectItem value="ciencias-sociales-derecho-bienestar">
                      Facultad de Ciencias Sociales Derecho y Bienestar
                    </SelectItem>
                    <SelectItem value="ciencias-administrativas-contables-comercio">
                      Facultad Ciencias Administrativas, Contables y Comercio
                    </SelectItem>
                    <SelectItem value="educacion-turismo-artes-humanidades">
                      Facultad de Educación Turismo Artes y Humanidades
                    </SelectItem>
                    <SelectItem value="ingenieria-industria-arquitectura">
                      Facultad Ingeniería, Industria y Arquitectura
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.facultad && <p className="text-red-500 text-sm">{errors.facultad}</p>}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={onBack}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Registrando...</>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Registrar Usuario
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
