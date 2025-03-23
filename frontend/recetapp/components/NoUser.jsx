import { Button, Image, Card, Container, Row, Col } from "react-bootstrap"
import { Link } from "react-router-dom"
import { LoginIcon, UserPlus, Cheff } from "./Icons.jsx"
import "./NoUser.css"

export function NoUser() {
  return (
    <div className="no-user-page">
      <header className="no-user-header">
        <Container>
          <div className="logo-container">
            <Image roundedCircle src="/Diseño sin título(1)(1).png" alt="Recetapp Logo" className="logo-image" />
          </div>
          
          <p className="tagline">Crea deliciosas recetas con los ingredientes que tienes a mano</p>
        </Container>
      </header>
      <Container className="main-content">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="welcome-card">
              <Card.Body>
                <Card.Title className="text-center mb-4">
                  <Cheff size={40} />
                  <h2>Bienvenido a Recetapp</h2>
                </Card.Title>
                <Card.Text className="text-center mb-4">
                  Descubre nuevas recetas, organiza tus comidas y simplifica tu cocina con Recetapp.
                </Card.Text>
                <Row className="g-4">
                  <Col sm={6}>
                    <Card className="action-card">
                      <Card.Body>
                        <Card.Title>¿Ya tienes una cuenta?</Card.Title>
                        <Button variant="primary" as={Link} to="/login" className="w-100">
                          <LoginIcon className="me-2" />
                          Iniciar sesión
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col sm={6}>
                    <Card className="action-card">
                      <Card.Body>
                        <Card.Title>¿Eres nuevo aquí?</Card.Title>
                        <Button variant="outline-primary" as={Link} to="/registro" className="w-100">
                          <UserPlus className="me-2" />
                          Registrarse
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    
    </div>
  )
}

