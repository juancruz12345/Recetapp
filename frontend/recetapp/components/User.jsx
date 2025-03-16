import { Alert, Button, Card } from "react-bootstrap";
import { Header } from "./Header";
import { useUserContext } from "../context/UserContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContext";


export default function User(){

    const {user} = useUserContext()
    const [alert, setAlert] = useState(false)
    const navigate = useNavigate()
    const {theme,toggleTheme} = useThemeContext()

    const handleGoBack = () => {
        navigate(-1)
      }

    const deleteUser = async()=>{
        try{
          const response = await fetch(`https://recetapp-8vna.onrender.com/usuario/${user.id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            }
            
          })
    
          const data = await response.json();
          console.log(data)
          if (!response.ok) {
            throw new Error(data.message || "Error al eliminar receta");
          }
          setAlert(true)
          setTimeout(() => {
            setAlert(false)
            handleGoBack()
          }, 3000)
    
    
        }catch(e){
          console.error("Error:", e.message);
        }
      }

    return(
        <div style={{marginBottom:'50vh'}}>
          {
            user!== null
            ?
           <div>
             <Header></Header>
           <div style={{display:'flex',alignSelf:'center', justifyContent:'center'}}>
           <Card style={{padding:'1rem',marginTop:'40px',width:'50vw', justifyContent:'center',boxShadow:'0 4px 12px rgba(0, 0, 0, 0.08)'}}>
                <Card.Title style={{textAlign:'center', fontWeight:'bolder',fontSize:'1.5rem'}}>Opciones de usuario</Card.Title>
                <Card.Body style={{display:'flex',gap:'12px',alignContent:'center', alignItems:'center'}}>
                    {/**<Button onClick={toggleTheme}>Cambiar tema</Button> */}
                    <Button variant="danger" onClick={deleteUser}>Eliminar usuario</Button>
                </Card.Body>
                {
                    alert && (
                        <Alert>
                            <Alert.Heading>¡Usuario eliminado!</Alert.Heading>
                        </Alert>
                    )
                }
            </Card>
           </div>
           </div>
            :<></>
          }
        </div>
    )
}