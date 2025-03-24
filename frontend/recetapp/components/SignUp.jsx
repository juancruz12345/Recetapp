"use client"

import { useState } from "react"
import { Button, Form, Spinner, Container, Card, Alert } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import { User, Lock, UserPlus } from "./Icons.jsx"
import "./AuthForms.css"

export function SignUp() {
  const [hidden, setHidden] = useState(true)
  const [spanTxt, setSpanTxt] = useState("")
  const [validated, setValidated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const [emailResponse, setEmailResponse] = useState(null);




  const handleSendEmail = async (email,subject,message) => {
    
    setLoading(true);

    try {
      const res = await fetch("https://recetapp-8vna.onrender.com/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: email, subject, message }),
      });

      const data = await res.json();
      setEmailResponse(data.success ? "Correo enviado con éxito" : "Error al enviar");
    } catch (e) {
      setEmailResponse("Error al enviar el correo");
      setSpanTxt(e.message)
    } finally {
      setLoading(false);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const username = e.currentTarget.username.value
    const password = e.currentTarget.password.value
    const email = e.currentTarget.email.value
    const form = e.currentTarget

    if (form.checkValidity() === false) {
      e.stopPropagation()
      setLoading(false)
      setValidated(true)
      return
    }

    setValidated(true)
    
    try {
      const response = await fetch("https://recetapp-8vna.onrender.com/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      })

      const data = await response.json()
      setHidden(false)

      if (response.ok) {
        setSuccess(true)
        

        handleSendEmail(email, 'Verificar cuenta Recetapp',`Haga click en el siguiente enlace para verificar su cuenta: https://recetapp-8vna.onrender.com/verificar-cuenta/${email}`)
        setSpanTxt("¡Registro exitoso! Verifique su casilla de email.")


      } else {
        setSuccess(false)
        setSpanTxt(data.error || "Ocurrió un error inesperado.")
        setTimeout(() => {
          setHidden(true)
        }, 6000)
      }
    } catch (error) {
      setSpanTxt("La solicitud falló. Por favor, intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }



  return (
    <Container className="auth-container" fluid>
      <Card className="auth-card">
        <Card.Body>
          <h2 className="text-center mb-4">Registro</h2>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <div className="input-icon-wrapper">
                <User className="input-icon" />
                <Form.Control
                  type="email"
                  name="email"
                  required
                  minLength={6}
                  placeholder="Escribe tu email"
                />
              </div>
              <Form.Control.Feedback type="invalid">
                Debes escribir un email válido.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de usuario</Form.Label>
              <div className="input-icon-wrapper">
                <User className="input-icon" />
                <Form.Control
                  type="text"
                  name="username"
                  required
                  minLength={4}
                  placeholder="Elige un nombre de usuario"
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
                  placeholder="Crea una contraseña segura"
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
                  <UserPlus className="me-2" />
                  Registrarse
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
              ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

