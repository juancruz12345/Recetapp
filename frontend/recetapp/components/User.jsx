import { Alert, Button, Card, Form, ToastContainer, Toast } from "react-bootstrap";
import { Header } from "./Header";
import { useUserContext } from "../context/UserContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Xicon, XCircle, Check, EditIcon } from "./Icons";


export default function User(){

    const {user, updateUser, profile} = useUserContext()
    const [alert, setAlert] = useState(false)
    const [errMsg, setErrMsg] = useState('')
    const [show, setShow] = useState(false)
    const navigate = useNavigate()
    const [username, setUsername] = useState('')


    const handleSubmit= async(e)=>{
      e.preventDefault()
      if(username==='')return
      updateUser.mutate({username},
        {
          onSuccess: () => {
            setShow(true)
            setErrMsg('')
            setTimeout(() => {
              window.location.reload()
            }, 5000)
            
          },
          onError: (error) => {
            setShow(true)
            setErrMsg(error || "Error al actualizar el usuario")
          }
        }
      )
     
    }


    const handleUpdate = (e) =>{

      setUsername(e.currentTarget.value)
    }
    

    const handleGoBack = () => {
        navigate(-1)
      }

    const deleteUser = async()=>{
        try{
          const response = await fetch(`https://recetapp-8vna.onrender.com/usuario/${user?.id}`, {
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
           <Card style={{padding:'1rem',marginTop:'40px',width:'50vw', justifyContent:'center',boxShadow:'0 4px 12px rgba(0, 0, 0, 0.08)', border:'none'}}>
                <Card.Title style={{textAlign:'center', fontWeight:'bolder',fontSize:'1.5rem'}}>Opciones de usuario</Card.Title>
                <Card.Body style={{display:'flex', flexDirection:'column',gap:'12px'}}>
                  
                  <Form onSubmit={handleSubmit}>
                  
                  <Form.Label>Cambiar nombre de usuario</Form.Label>
                    <Form.Control style={{marginBottom:'5px',marginTop:'10px', width:'50%'}} onChange={handleUpdate} >
                    </Form.Control>
                    <Button type="submit">Cambiar <EditIcon/></Button>
                  </Form>
                 <div style={{marginTop:'20vh', display:'flex', flexDirection:'column'}}>
                 <Form.Label>Eliminar usuario</Form.Label>
                 <Button variant="danger" onClick={deleteUser} style={{width:'fit-content'}}>Eliminar <Xicon></Xicon></Button>
                 </div>
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
           <ToastContainer className="p-3" position='bottom-center' style={{ zIndex: 1, position:'sticky' }}>
                {
                  errMsg !== ''
                  ?
                  <div>
                    <Toast show={show} onClose={()=>{setShow(false)}} delay={3000} autohide>
                  <Toast.Header>
                   <XCircle></XCircle>
                   <strong className="me-auto" style={{marginLeft:'2px'}}>Error</strong>
                 </Toast.Header>
                  <Toast.Body>{errMsg}</Toast.Body>
                </Toast>
                  </div>

                  :
                  <div>
                    <Toast show={show} onClose={()=>{setShow(false)}} delay={5000} autohide>
                  <Toast.Header>
                   <Check></Check>
                   <strong className="me-auto" style={{marginLeft:'2px'}}>Exito</strong>
                 </Toast.Header>
                  <Toast.Body>Usuario actualizado</Toast.Body>
                </Toast>
                  </div>
                }
           </ToastContainer>
           </div>
            :<></>
          }
        </div>
    )
}