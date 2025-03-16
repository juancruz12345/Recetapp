

import { useState } from "react"
import { Navbar, Nav, Container, Dropdown, Image } from "react-bootstrap"
import { Link, useLocation } from "react-router-dom"
import { useToken } from "../services/useToken"
import { useUserContext } from "../context/UserContext"
import { Bookmark, Logout, User } from './Icons.jsx'
import "./Header.css"


export function Header() {
  const { logout } = useToken()
  const location = useLocation()
  const { user } = useUserContext()
  
  const [expanded, setExpanded] = useState(false)
 

  const handleNavCollapse = () => setExpanded(false)
  
  return (
    <header className="app-header">
      <Navbar expanded={expanded} expand="lg" className="navbar-custom" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/" className="brand">
            <Image src="/Diseño sin título(2)-Photoroom(1).png" roundedCircle></Image>
            
           
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={() => setExpanded(!expanded)} />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                to="/"
                className={location.pathname === "/" ? "active" : ""}
                onClick={handleNavCollapse}
              >
                Inicio
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/recetas"
                className={location.pathname === "/recetas" ? "active" : ""}
                onClick={handleNavCollapse}
              >
               <Bookmark size={20} /> 
                Recetas guardadas
              </Nav.Link>
            </Nav>
            <Nav>
              <Dropdown align="end">
                <Dropdown.Toggle id="dropdown-user" className="user-dropdown">
                <User size={20} /> 
                  <span>{user?.username}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to={`/usuario/${user?.id}`}>
                  <User size={18} /> 
                    Perfil
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={() => {
                      logout()
                      handleNavCollapse()
                    }}
                  >
                  <Logout size={18} />
                    Cerrar sesión
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

