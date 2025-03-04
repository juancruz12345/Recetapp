"use client"

import { useEffect, useState } from "react"
import { useUserContext } from "../context/UserContext"
import { useNavigate } from "react-router-dom"
import { Card, Container, Row, Col, Button, Form, InputGroup, Badge, Spinner, Alert } from "react-bootstrap"
import {
  Bookmark,
  Clock,
  Search,
  Cheff,
  Star,
  ArrowRight,
  MoodSad,
} from "./Icons.jsx"
import "./Recipes.css"
import { Header } from "./Header.jsx"

export default function Recipes() {
  const [errMsg, setErrMsg] = useState("")
  const [loading, setLoading] = useState(false)
  const [recetas, setRecetas] = useState([])
  const [filteredRecetas, setFilteredRecetas] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const { user } = useUserContext()
  const navigate = useNavigate()

  const goToRecipeDetail = (id) => {
    navigate(`/recetas/${id}`, { state: { recetas } })
  }

  const fetchRecipes = async () => {
    if (!user?.id) {
      setErrMsg("Usuario no identificado")
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`http://localhost:3000/recetas/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.statusText}`)
      }

      const data = await response.json()
      setRecetas(data)
      setFilteredRecetas(data)
      
    } catch (e) {
      setErrMsg(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecipes()
  }, [user])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredRecetas(recetas)
    } else {
      const filtered = recetas.filter((recipe) => recipe.recipe_name.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredRecetas(filtered)
    }
  }, [searchTerm, recetas])

  // Function to generate a random cooking time between 15-60 minutes
  const getRandomTime = () => {
    return Math.floor(Math.random() * 46) + 15
  }

 
  const mapedRecipes = recetas?.map((e)=>{
    return (e = {id:e.id,name:e.recipe_name.replaceAll('*',''),recipe:e.recipe,
      dificulty:e.recipe.split('\n')?.filter(e=>e.includes('Nivel de dificultad') || e.includes('Dificultad')).toString().replaceAll('*','').replace('Nivel de ',''),
      coockingTime:e.recipe.split('\n')?.filter(e=>e.includes('Cocción') || e.includes('Tiempo de cocción')|| e.includes('Tiempo de coccion')||e.includes('Coccion')).toString().match(/\d+/)[0],



    })
  })


  const recipeStrArray = recetas[0]?.recipe.split('\n')
  const recipeDificulty = recipeStrArray?.filter(e=>e.includes('Nivel de dificultad') || e.includes('Dificultad')).toString().replaceAll('*','').replace('Nivel de dificultad: ','')
 /// recipeDificulty
  const coocking = recipeStrArray?.filter(e=>e.includes('Cocción') || e.includes('Tiempo de cocción')|| e.includes('Tiempo de coccion')||e.includes('Coccion')).toString().match(/\d+/)[0];
  console.log(mapedRecipes)
 // const recipeDificulty = 

  return (
    <div>
      <Header></Header>
      <Container className="recipes-container">
      
      <div className="recipes-header">
        <div className="recipes-title">
          <Bookmark size={28} />
          <h1>Mis Recetas Guardadas</h1>
        </div>
        <p className="recipes-subtitle">Explora todas tus recetas personalizadas guardadas</p>
      </div>

      {errMsg && (
        <Alert variant="danger" onClose={() => setErrMsg("")} dismissible>
          <Alert.Heading>¡Ha ocurrido un error!</Alert.Heading>
          <p>{errMsg}</p>
        </Alert>
      )}

      <div className="search-container">
        <InputGroup>
          <InputGroup.Text>
            <Search size={20} />
          </InputGroup.Text>
          <Form.Control
            placeholder="Buscar recetas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button variant="outline-secondary" onClick={() => setSearchTerm("")}>
              Limpiar
            </Button>
          )}
        </InputGroup>
      </div>

      {loading ? (
        <div className="loading-container">
          <Spinner animation="border" variant="primary" />
          <p>Cargando tus recetas...</p>
        </div>
      ) : filteredRecetas.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4 recipes-grid">
          {filteredRecetas.map((recipe, index) => {
            const cookingTime = getRandomTime()
            

            return (
              <Col key={recipe.id}>
                <Card className="recipe-card" onClick={() => goToRecipeDetail(recipe.id)}>
                <Badge className={`difficulty-badge ${recipeDificulty.toLowerCase()}`}>{recipeDificulty}</Badge>
                  <Card.Body>
                    <Card.Title className="recipe-title">{recipe.recipe_name}</Card.Title>
                    <div className="recipe-meta">
                      <div className="meta-item">
                        <Clock size={18} />
                        <span>{cookingTime} min</span>
                      </div>
                      <div className="meta-item">
                        <Cheff size={18} />
                        <span>{Math.floor(Math.random() * 3) + 2} pasos</span>
                      </div>
                      <div className="meta-item">
                        <Star size={18} />
                        <span>{(Math.random() * 2 + 3).toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="recipe-preview">{recipe.recipe.substring(0, 100)}...</div>
                    
                  </Card.Body>
                </Card>
              </Col>
            )
          })}
        </Row>
      ) : (
        <div className="empty-recipes">
          <MoodSad size={64} />
          <h3>No hay recetas disponibles</h3>
          <p>Parece que aún no has guardado ninguna receta. ¡Crea tu primera receta ahora!</p>
          <Button variant="primary" onClick={() => navigate("/")}>
            Crear Nueva Receta
          </Button>
        </div>
      )}
    </Container>
    </div>
  )
}

