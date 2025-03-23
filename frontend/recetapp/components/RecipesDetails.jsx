"use client"

import { useEffect, useState } from "react"
import { Card, Container, Row, Col, Button, Badge, Alert } from "react-bootstrap"
import { useLocation, useParams, useNavigate } from "react-router-dom"
import {
  Cheff,
  Clock,
  Flame,
  ArrowLeft,
  Users,
  Share,
  ListCheck,
  ToolsKitchen,
  AlertCircle,
  Xicon,
} from "./Icons.jsx"
import "./RecipesDetails.css"
import { useUserContext } from "../context/UserContext.jsx"
import { NoUser } from "./NoUser.jsx"

export function RecipesDetails() {

  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { recetas } = location.state || {}
  const [receta, setReceta] = useState(null)
  const [alert, setAlert] = useState(false)
  const {user} = useUserContext()

  useEffect(() => {
    if (recetas) {
      const foundRecipe = recetas.find((p) => p.id === Number.parseInt(id))
      setReceta(foundRecipe)

    }

  }, [recetas, id])


  const handleGoBack = () => {
    navigate(-1)
  }

  const deleteRecipe = async()=>{
    try{
      const response = await fetch(`https://recetapp-8vna.onrender.com/recetas/${receta.id}`, {
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
  const actualPath = location.pathname

  const shareOnFacebook = () => {
    const url = encodeURIComponent(actualPath);
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(facebookShareUrl, "_blank");
  };

  return (
   <div>
    {
      user!==null
      ?
      <Container className="recipe-details-container">
    

      {receta ? (
        <>
          <div className="recipe-header">
            <Button variant="outline-primary" className="back-button" onClick={() => navigate("/recetas")}>
              <ArrowLeft size={18} /> Volver
            </Button>
            <div className="recipe-actions">
             
              <Button variant="outline-secondary" className="action-button">
                <Share size={18} /> Compartir
              </Button>
              <button onClick={shareOnFacebook}>Compartir en Facebook</button>
              <Button onClick={deleteRecipe} variant="outline-danger" className="action-button">
                <Xicon size={18} /> Eliminar
              </Button>
             
            </div>
            
          </div>
          {
            alert && (<Alert variant="info">
              <Alert.Heading>¡Receta eliminada!</Alert.Heading>
              <p>Seras redirigido</p>
            </Alert>)
          }

          <Card className="recipe-detail-card">
            <div className="recipe-hero">
              <div
                className="recipe-image"
               
              ></div>
              <div className="recipe-title-container">
                <h1 className="recipe-title">{receta?.name}</h1>
                <div className="recipe-meta-badges">
                  <Badge className={`difficulty-badge ${receta?.dificulty.toLowerCase()}`}>
                    <Flame size={16} /> {receta?.dificulty}
                  </Badge>
                  <Badge className="time-badge">
                    <Clock size={16} /> {receta?.coockingTime}
                  </Badge>
                  <Badge className="servings-badge">
                    <Users size={16} /> {receta?.portions}
                  </Badge>
                 
                </div>
              </div>
            </div>

            <Card.Body>
              <Row>
                <Col md={4}>
                  <div className="ingredients-section">
                    <h3 className="section-title">
                      <ToolsKitchen size={22} /> Ingredientes
                    </h3>
                    <ul className="ingredients-list">
                      {receta?.ingredients?.map((ingredient, index) => (
                        <li key={index} className="ingredient-item">
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Col>
                <Col md={8}>
                  <div className="instructions-section">
                    <h3 className="section-title">
                      <ListCheck size={22} /> Instrucciones
                    </h3>
                    <ol className="instructions-list">
                      {receta?.instructions?.map((instruction, index) => (
                        <li key={index} className="instruction-item">
                          <div className="instruction-number">{index + 1}</div>
                          <div className="instruction-text">{instruction}</div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </Col>
              </Row>

              <div className="recipe-notes">
                <h3 className="section-title">Notas del Chef</h3>
                <div className="notes-content">
                  <Cheff size={20} />
                  <p>
                    Esta receta fue generada especialmente para ti basada en los ingredientes que seleccionaste. Puedes
                    ajustar las cantidades según tu preferencia y experimentar con diferentes hierbas y especias para
                    personalizar el sabor.
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </>
      ) : (
        <Card className="no-recipe-card">
          <Card.Body className="text-center">
            <AlertCircle size={64} className="no-recipe-icon" />
            <h2>No se encontró la receta</h2>
            <p>Lo sentimos, no pudimos encontrar la información de esta receta.</p>
            <Button variant="primary" onClick={handleGoBack}>
              Volver a Mis Recetas
            </Button>
          </Card.Body>
        </Card>
      )}
    </Container>

    : <NoUser></NoUser>
    }
   </div>
  )
}

