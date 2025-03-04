import { Button, Form, Spinner } from "react-bootstrap";
import {Link, useNavigate} from 'react-router-dom'
import { useState } from "react";

export function Login(){

    const [hidden, setHidden] = useState(true);
    const [spanTxt, setSpanTxt] = useState("");
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [succes, setSucces] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
    
       
        const username = e.currentTarget[0].value
        const password = e.currentTarget[1].value
        const form = e.currentTarget
    
        if (form.checkValidity() === false) {
            e.stopPropagation()
            setLoading(false)
            return
        }
    
        setValidated(true)
    
        
    
       
        fetch("http://localhost:3000/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        })
        .then(async (res) => {
            const data = await res.json()
            setHidden(false)
            if (res.ok) {
                setSucces(true)
                setSpanTxt("Login exitoso, redirigiendo...")
                 setTimeout(() => {

                  setHidden(true);
                  window.location.href = '/'
                }, 2000);
               
            } else {
                setSucces(false)
                setSpanTxt(data.error || "Ocurrió un error.")
                setTimeout(() => {
                  setHidden(true);
                }, 2000);
            }
        })
        .catch(() => setSpanTxt("Hubo un error. Intenta nuevamente"))
        .finally(() => setLoading(false))
    };

    return(
        <div className="div-form">
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Nombre de usuario</Form.Label>
                    <Form.Control autoComplete="off" required minLength={4}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control type="password" autoComplete="off" required minLength={6}/>
                </Form.Group>
                <Button type="submit" disabled={loading}>
                {loading ?  <Spinner className="animate-spin" /> : "Iniciar sesion"}
                </Button>
                <div className="mt-2 text-center text-sm">

{
  succes
  ? <span >{spanTxt}</span>
  : <span >{spanTxt}</span>
}
</div>
            </Form>
            <p>¿No tienes una cuenta? <Link to={'/registro'}>Ir a registro</Link></p>
        </div>
    )
}