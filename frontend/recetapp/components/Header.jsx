

import { useState } from "react"
import { Navbar, Nav, Container, Dropdown, Image, Button } from "react-bootstrap"
import { Link, useLocation } from "react-router-dom"
import { useToken } from "../services/useToken"
import { useUserContext } from "../context/UserContext"
import { Bookmark, Logout, User } from './Icons.jsx'
import "./Header.css"
import { useThemeContext } from "../context/ThemeContext.jsx"
import { MoonIcon,SunIcon } from "./Icons.jsx"


export function Header() {
  const { logout } = useToken()
  const location = useLocation()
  const { user, profile } = useUserContext()
  const {theme,toggleTheme} = useThemeContext()
  const [expanded, setExpanded] = useState(false)
 

  const handleNavCollapse = () => setExpanded(false)
  
  return (
    <header className="app-header">
      <Navbar expanded={expanded} expand="lg" className="navbar-custom" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/" className="brand">
            <Image src="/Diseño sin título(1)(1).png" roundedCircle></Image>
            
           
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
            {
                    theme==='dark'
                    ? <div onClick={toggleTheme} className="theme-icon" ><SunIcon></SunIcon></div>
                    : <div onClick={toggleTheme} className="theme-icon" ><MoonIcon></MoonIcon></div>
                   }
              <Dropdown align="end">
                <Dropdown.Toggle id="dropdown-user" className="user-dropdown">
                <User size={20} /> 
                  <span>{profile?.username}</span>
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

