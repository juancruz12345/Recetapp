import { ToastContainer } from 'react-bootstrap';
import Toast from 'react-bootstrap/Toast';
import { Check, XCircle } from './Icons';

function ToastComponent({show, setShow, errMsg}) {
  return (
    <ToastContainer className="p-3" position='bottom-center' style={{ zIndex: 1, position:'sticky' }}>
      <Toast show={show} onClose={()=>{setShow(false)}} delay={5000} autohide>
     {
        errMsg!==''
        ?
      <div>
          <Toast.Header>
            <XCircle></XCircle>
          <strong className="me-auto" style={{marginLeft:'2px'}}>Error</strong>
       </Toast.Header>
       <Toast.Body>{errMsg}</Toast.Body>
      </div>
       :
      <div>
         <Toast.Header>
          <Check></Check> 
         <strong className="me-auto" style={{marginLeft:'2px'}}>Receta guardada</strong>
      </Toast.Header>
      <Toast.Body>Puedes verla en la pestaña de Resetas guardadas</Toast.Body>
      </div>
     }
    </Toast>
    </ToastContainer>
  );
}

export default ToastComponent;