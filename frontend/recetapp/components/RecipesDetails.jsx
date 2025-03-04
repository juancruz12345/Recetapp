"use client"

import { useEffect, useState } from "react"
import { Card, Container, Row, Col, Button, Badge, Breadcrumb } from "react-bootstrap"
import { useLocation, useParams, useNavigate } from "react-router-dom"
import {
  Cheff,
  Clock,
  Flame,
  ArrowLeft,
  Star,
  Users,
  Bookmark,
  Share,
  Printer,
  ListCheck,
  ToolsKitchen,
  AlertCircle,
} from "./Icons.jsx"
import "./RecipesDetails.css"

export function RecipesDetails() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { recetas } = location.state || {}
  const [receta, setReceta] = useState(null)
  const [ingredients, setIngredients] = useState([])
  const [instructions, setInstructions] = useState([])

  useEffect(() => {
    if (recetas) {
      const foundRecipe = recetas.find((p) => p.id === Number.parseInt(id))
      setReceta(foundRecipe)

      if (foundRecipe) {
        // Extract ingredients and instructions from recipe text
        // This is a simple parsing logic - in a real app, you'd have structured data
        const recipeText = foundRecipe.recipe

        // Extract ingredients (assuming they're listed with bullets or in a section)
        const ingredientsMatch = recipeText.match(/Ingredientes:(.*?)(?=Instrucciones:|Preparación:|$)/s)
        if (ingredientsMatch && ingredientsMatch[1]) {
          // Split by lines or bullets and clean up
          const ingredientsList = ingredientsMatch[1]
            .split(/\n|•|-/)
            .map((item) => item.trim())
            .filter((item) => item.length > 0)
          setIngredients(ingredientsList)
        } else {
          // Fallback: just create some random ingredients
          setIngredients([
            "2 cucharadas de aceite de oliva",
            "1 cebolla picada",
            "2 dientes de ajo picados",
            "500g de carne molida",
            "1 lata de tomates triturados",
            "Sal y pimienta al gusto",
            "Hierbas aromáticas",
          ])
        }

        // Extract instructions
        const instructionsMatch = recipeText.match(/(?:Instrucciones|Preparación|Pasos):(.*)/s)
        if (instructionsMatch && instructionsMatch[1]) {
          // Split by numbered steps or lines
          const instructionsList = instructionsMatch[1]
            .split(/\n|(?:\d+\.\s)/)
            .map((item) => item.trim())
            .filter((item) => item.length > 0)
          setInstructions(instructionsList)
        } else {
          // Fallback: split the text into paragraphs
          const paragraphs = recipeText
            .split(/\n\n|\n/)
            .map((item) => item.trim())
            .filter((item) => item.length > 0)
          setInstructions(paragraphs)
        }
      }
    }
  }, [recetas, id])

  // Generate random recipe metadata
  const cookingTime = Math.floor(Math.random() * 46) + 15 // 15-60 minutes
  const difficulty = ["Fácil", "Media", "Difícil"][Math.floor(Math.random() * 3)]
  const servings = Math.floor(Math.random() * 4) + 2 // 2-5 servings
  const calories = Math.floor(Math.random() * 400) + 200 // 200-600 calories
  const rating = (Math.random() * 2 + 3).toFixed(1) // 3.0-5.0 rating

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
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
             
            </div>
          </div>

          <Card className="recipe-detail-card">
            <div className="recipe-hero">
              <div
                className="recipe-image"
                style={{
                  backgroundImage: `url(https://source.unsplash.com/random/1200x800/?food,${receta.recipe_name})`,
                }}
              ></div>
              <div className="recipe-title-container">
                <h1 className="recipe-title">{receta.recipe_name}</h1>
                <div className="recipe-meta-badges">
                  <Badge className={`difficulty-badge ${difficulty.toLowerCase()}`}>
                    <Flame size={16} /> {difficulty}
                  </Badge>
                  <Badge className="time-badge">
                    <Clock size={16} /> {cookingTime} min
                  </Badge>
                  <Badge className="servings-badge">
                    <Users size={16} /> {servings} porciones
                  </Badge>
                  <Badge className="calories-badge">
                    <Flame size={16} /> {calories} cal
                  </Badge>
                  <Badge className="rating-badge">
                    <Star size={16} /> {rating}
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
                      {ingredients.map((ingredient, index) => (
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
                      {instructions.map((instruction, index) => (
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
  )
}

