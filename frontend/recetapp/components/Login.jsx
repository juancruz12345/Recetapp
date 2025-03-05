"use client"

import { useState } from "react"
import { Button, Form, Spinner, Container, Card, Alert } from "react-bootstrap"
import { Link } from "react-router-dom"
import { User, Lock, LoginIcon } from "./Icons.jsx"
import "./AuthForms.css"

export function Login() {
  const [hidden, setHidden] = useState(true)
  const [spanTxt, setSpanTxt] = useState("")
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const username = e.currentTarget.username.value
    const password = e.currentTarget.password.value
    const form = e.currentTarget

    if (form.checkValidity() === false) {
      e.stopPropagation()
      setLoading(false)
      setValidated(true)
      return
    }

    setValidated(true)

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()
      setHidden(false)

      if (response.ok) {
        setSuccess(true)
        setSpanTxt("Login exitoso, redirigiendo...")
        setTimeout(() => {
          setHidden(true)
          window.location.href = "/"
        }, 2000)
      } else {
        setSuccess(false)
        setSpanTxt(data.error || "Ocurrió un error.")
        setTimeout(() => {
          setHidden(true)
        }, 2000)
      }
    } catch (error) {
      setSpanTxt("Hubo un error. Intenta nuevamente")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="auth-container">
      <Card className="auth-card">
        <Card.Body>
          <h2 className="text-center mb-4">Iniciar Sesión</h2>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de usuario</Form.Label>
              <div className="input-icon-wrapper">
                <User className="input-icon" />
                <Form.Control
                  type="text"
                  name="username"
                  required
                  minLength={4}
                  placeholder="Ingresa tu nombre de usuario"
                />
              </div>
              <Form.Control.Feedback type="invalid">
                El nombre de usuario debe tener al menos 4 caracteres.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <div className="input-icon-wrapper">
                <Lock className="input-icon" />
                <Form.Control
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  placeholder="Ingresa tu contraseña"
                />
              </div>
              <Form.Control.Feedback type="invalid">
                La contraseña debe tener al menos 6 caracteres.
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-3" disabled={loading}>
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <>
                  <LoginIcon className="me-2" />
                  Iniciar sesión
                </>
              )}
            </Button>
          </Form>
          {!hidden && (
            <Alert variant={success ? "success" : "danger"} className="mt-3">
              {spanTxt}
            </Alert>
          )}
          <div className="text-center mt-3">
            <p>
              ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

