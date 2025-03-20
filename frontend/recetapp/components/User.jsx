import { Alert, Button, Card, Form } from "react-bootstrap";
import { Header } from "./Header";
import { useUserContext } from "../context/UserContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Xicon } from "./Icons";


export default function User(){

    const {user} = useUserContext()
    const [alert, setAlert] = useState(false)
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const handleSubmit= async(e)=>{

      e.preventDefault()
      const response = await fetch(`https://recetapp-8vna.onrender.com/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }), // No es necesario email: email
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al actualizar el usuario");
      }
      console.log("usuario actualizado");
      return response.json();

    }
    const handleUpdate = (e) =>{

      setUsername(e.currentTarget.value)
    }
    

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
                <Card.Body style={{display:'flex', flexDirection:'column',gap:'12px'}}>
                  <Form onSubmit={handleSubmit}>
                    <Form.Control onChange={handleUpdate} >
                    </Form.Control>
                    <Button type="submit">Cambiar nombre de usuario</Button>
                  </Form>
                    <Button variant="danger" onClick={deleteUser} style={{width:'30%'}}>Eliminar usuario <Xicon></Xicon></Button>
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