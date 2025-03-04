import { Navbar, Nav, Container, Dropdown, SplitButton } from "react-bootstrap"
import { Link, useLocation } from "react-router-dom"
import { useToken } from "../services/useToken"
import { Cheff } from "./Icons"
import { useUserContext } from "../context/UserContext"

export function Header(){

    const {logout} = useToken()
    const location = useLocation()
    const {user} = useUserContext()

    return(
        <header>
      <Navbar className="home-header">
      <Container>
      

        <Navbar.Brand className="nav-brand"><Cheff /> Recetapp</Navbar.Brand>
        <Navbar.Toggle className="collapse"/>
       
       <Navbar.Collapse className="justify-content-end">
        
           <Nav.Link as={Link} className="nav-text" to="/">Inicio</Nav.Link>
           <Nav.Link as={Link} className="nav-text" to="/recetas">Recetas guardadas</Nav.Link>
          
        
        <Dropdown>
      <Dropdown.Toggle variant="asda" style={{color:'white', border:'none'}} id="dropdown-basic">
        {user.username}
      </Dropdown.Toggle>
      
      <Dropdown.Menu>
    
        <Dropdown.Item>  <Nav.Link onClick={logout}>
          Cerrar sesion
          </Nav.Link></Dropdown.Item>
        
      </Dropdown.Menu>
    </Dropdown>
 
         
        </Navbar.Collapse>
       
      </Container>
    </Navbar>
      </header>
    )
}