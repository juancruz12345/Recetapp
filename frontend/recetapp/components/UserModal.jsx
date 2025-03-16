import { Button,Modal } from "react-bootstrap";


export function UserModal({show, setShow}){

    return(
        <div>
            <Modal show={show}>
                <Modal.Header closeButton onHide={()=>{setShow(false)}}>Opciones de usuario</Modal.Header>
                <Modal.Body>
                <div>
                <p>Dark mode</p>
                </div>
                <div>
                <p>Eliminar usuario</p> <Button>Eliminar</Button>
                </div>
                </Modal.Body>
            </Modal>
        </div>
    )


}