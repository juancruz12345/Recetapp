import { Alert, Button, Card, Form, ToastContainer, Toast } from "react-bootstrap";
import { Header } from "./Header";
import { useUserContext } from "../context/UserContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Xicon, XCircle, Check } from "./Icons";


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
          },
          onError: (error) => {
            setShow(true)
            setErrMsg(error || "Error al actualizar el usuario")
          }
        }
      )
      /*const response = await fetch(`https://recetapp-8vna.onrender.com/usuario/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }), // No es necesario email: email
      });
      if (!response.ok) {
        const data = await response.json();
        console.log(data.error)
        setShow(true)
        setErrMsg(data.error || "Error al actualizar el usuario")
        throw new Error(data.message || "Error al actualizar el usuario");
      }
      console.log("usuario actualizado");
      setShow(true)
      setErrMsg('')
      return response.json();
*/
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
           <Card style={{padding:'1rem',marginTop:'40px',width:'50vw', justifyContent:'center',boxShadow:'0 4px 12px rgba(0, 0, 0, 0.08)'}}>
                <Card.Title style={{textAlign:'center', fontWeight:'bolder',fontSize:'1.5rem'}}>Opciones de usuario</Card.Title>
                <Card.Body style={{display:'flex', flexDirection:'column',gap:'12px'}}>
                  
                  <Form onSubmit={handleSubmit}>
                  <p>{profile?.username}</p>
                    <Form.Control style={{marginBottom:'5px', width:'50%'}} onChange={handleUpdate} >
                    </Form.Control>
                    <Button type="submit">Cambiar nombre de usuario</Button>
                  </Form>
                    <Button variant="danger" onClick={deleteUser} style={{width:'30%', marginTop:'40px'}}>Eliminar usuario <Xicon></Xicon></Button>
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
                    <Toast show={show} onClose={()=>{setShow(false)}} delay={5000} autohide>
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