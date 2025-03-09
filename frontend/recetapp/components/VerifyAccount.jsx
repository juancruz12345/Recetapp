import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import './VerifyAccount.css'

export function VerifyAccount(){

    const {email} = useParams()
    const [mensaje, setMensaje] = useState("Verificando...");
    const [verificado, setVerificado] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (!email) return;

        const verificarUsuario = async () => {
            try {
                const response = await fetch(`https://recetapp-8vna.onrender.com/verify/${email}`);
                const data = await response.json();

                if (data.success) {
                    setVerificado(true)
                    setMensaje("¡Verified account!");
                } else {
                   setVerificado(false)
                    setMensaje("Error to verified account.");
                }
            } catch (error) {
                setMensaje("Error to server connection.");
                console.error(error);
            }
        };

        verificarUsuario();
    }, [email]);

    return(
       <div className="div-verify">
         <div className="div-verify-card">
            <Card>
          <Card.Header>
          
            <Card.Title >{mensaje}</Card.Title>
          </Card.Header>
          <Card.Body>
            <Button
            onClick={()=>{navigate('/login')}}
            >
              Loguearse
            </Button>
          </Card.Body>
        </Card>
        </div>
       </div>
    )
}