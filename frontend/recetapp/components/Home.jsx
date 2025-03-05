import { useState } from "react"
import "bootstrap/dist/css/bootstrap.min.css"
import { Button, Card, Form, Row, Col, Container, Spinner, Alert, Image } from "react-bootstrap"
import { Carrot, Meat, Cheese, Cheff, Xicon, Fridge, Cooker, Plus } from "./Icons.jsx"
import { Ingredients } from "../services/ingredientes"
import { Ingredient } from "./Ingredients.jsx"
import "./Home.css"
import { Link } from "react-router-dom"
import ToastComponent from "./ToastComponent.jsx"
import { useUserContext } from "../context/UserContext.jsx"
import { Header } from "./Header.jsx"
import { NoUser } from "./NoUser.jsx"

export function Home(){

  const {user,isLoading} = useUserContext()
  


  const [selectedCategory, setSelectedCategory] = useState("vegetales")
  const { vegetales, carnesBovinas, carnesPorcinas } = Ingredients()
  const [ingredients, setIngredients] = useState([])
  const [receta, setReceta] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingSave, setLoadingSave] = useState(false)
  const [errMsg, setErroMsg] = useState("")
  const [show, setShow] = useState(false)
  const [alert, setAlert] = useState('')

  const mapedVegetales = vegetales.map((e) => {
    return (e = { id: e, name: e, type: "Vegetal" })
  })
  const mapedCarnesBovinas = carnesBovinas.map((e) => {
    return (e = { id: e, name: e, type: "Carne bovina" })
  })
  const mapedCarnesPorcinas = carnesPorcinas.map((e) => {
    return (e = { id: e, name: e, type: "Carne porcina" })
  })


  const FetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch("https://recetapp-8vna.onrender.com/receta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          ingredientes: ingredients.map((ing) => 
            (ing.type === "Carne bovina" || ing.type === "Carne porcina") 
              ? `${ing.name} (${ing.type})` 
              : ing.name
          ) 
        })
        ,
      })
     
      const data = await response.json()
      setReceta(data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setErroMsg(`Hubo un error al generar la receta: ${error.message}`)
    }
  }

  const addIngredient = (e) => {
    const ingredient = e
    const existingIngredient = ingredients.find((item) => item.id === ingredient.id)
    if (existingIngredient) return
    setIngredients((prevIngredients) => {
      return [...prevIngredients, ingredient]
    })
  }

  const deleteIngredient = (ingredient) => {
    setIngredients((prevIngredients) => {
      return prevIngredients.filter((e) => e.id !== ingredient.id)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (ingredients.length === 0) {
      setErroMsg("Por favor, selecciona al menos un ingrediente")
      return
    }
    setErroMsg("")
    FetchData()
  }

  const saveRecipe = async()=>{

    const user_id = user.id
    let nuevaReceta = receta.receta
    setLoadingSave(true)
   try{
    const response = await fetch("http://localhost:3000/guardar-receta",{
      method:'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({user_id,nuevaReceta })
    })
    const data = await response.json()
    if(data.error){
      setErroMsg('Ya tienes la receta guardada')
    }
    setLoadingSave(false)
    setShow(true)
   }
   catch(error){
    
    setAlert(`Hubo un error al guardar la receta: ${error.message}`)
    setLoadingSave(false)

   }
  }

  return (
   <div>

    {
      isLoading ?
      <Spinner style={{display:'flex',margin:'0 auto'}}></Spinner>
      :
      <div>
        
    {
      user !== null
      ?
      <div className="recipe-app">
      
      <Header></Header>

      <Container fluid className="main-content">
        <Row className="g-4">
          <Col lg={4} md={5} sm={12}>
            <Card className="ingredients-selector">
              <Card.Header className="category-header">
                <h2>Selecciona tus ingredientes</h2>
              </Card.Header>
              <div className="category-tabs">
                <div
                  className={`category-tab ${selectedCategory === "vegetales" ? "active" : ""}`}
                  onClick={() => setSelectedCategory("vegetales")}
                >
                  <Carrot /> <span>Vegetales</span>
                </div>
                <div
                  className={`category-tab ${selectedCategory === "carnes" ? "active" : ""}`}
                  onClick={() => setSelectedCategory("carnes")}
                >
                  <Meat /> <span>Carnes</span>
                </div>
                <div
                  className={`category-tab ${selectedCategory === "otros" ? "active" : ""}`}
                  onClick={() => setSelectedCategory("otros")}
                >
                  <Cheese /> <span>Otros</span>
                </div>
              </div>
              <Card.Body className="ingredients-container">
                {selectedCategory === "vegetales" && (
                  <div className="ingredients-grid">
                   <div className="vegetals-grid">
                   {mapedVegetales.map((e) => (
                      <Ingredient key={e.id} name={e.name} type={e.type} ingredient={e} addIngredient={addIngredient} />
                    ))}
                   </div>
                  </div>
                )}

                {selectedCategory === "carnes" && (
                  <div className="ingredients-grid">
                    <div className="meat-section">
                      <h3>Carnes Bovinas</h3>
                      <div className="meat-grid">
                        {mapedCarnesBovinas.map((e) => (
                          <Ingredient
                            key={e.id}
                            name={e.name}
                            type={e.type}
                            ingredient={e}
                            addIngredient={addIngredient}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="meat-section">
                      <h3>Carnes Porcinas</h3>
                      <div className="meat-grid">
                        {mapedCarnesPorcinas.map((e) => (
                          <Ingredient
                            key={e.id}
                            name={e.name}
                            type={e.type}
                            ingredient={e}
                            addIngredient={addIngredient}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedCategory === "otros" && (
                  <div className="coming-soon">
                    <h3>Próximamente</h3>
                    <p>Estamos trabajando para agregar más categorías de ingredientes.</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={5} md={7} sm={12}>
            <Card className="recipe-card-home">
              <Card.Header className="recipe-header-home">
                <Cheff /> <h2>Tu Receta Personalizada</h2>
              </Card.Header>
              <Card.Body className="recipe-content">
                {alert && (
                  <Alert variant="danger" onClose={() => setAlert("")} dismissible>
                    {alert}
                  </Alert>
                )}

                {loading ? (
                  <div className="loading-container">
                    <Spinner animation="border" role="status" variant="primary" />
                    <p>Creando tu receta personalizada...</p>
                  </div>
                ) : receta ? (
                  <div className="recipe-result">
                    <div className="div-guardar-btn">
                    <Button  onClick={saveRecipe} variant="success" disabled={loadingSave}><Plus></Plus>  {loadingSave ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        <span className="ms-2">Guardando...</span>
                      </>
                    ) : (
                      "Guardar Receta"
                    )}</Button>
                    </div>
                    <h3>Receta con tus ingredientes</h3>
                    <div className="recipe-text">{receta.receta}</div>
                  </div>
                ) : (
                  <div className="empty-recipe">
                    <div className="cooker-icon">
                      <Cooker />
                    </div>
                    <p>Selecciona ingredientes y genera una receta deliciosa</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={12} sm={12}>
            <Form className="selected-ingredients-form" onSubmit={handleSubmit}>
              <Card className="selected-ingredients">
                <Card.Header className="selected-header">
                  <Fridge /> <h2>Ingredientes Seleccionados</h2>
                </Card.Header>
                <Card.Body className="selected-body">
                  {ingredients.length > 0 ? (
                    <div className="selected-list">
                      {ingredients.map((e, i) => (
                        <div key={i} className="selected-item">
                          <span className="item-name">{e.name}</span>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="delete-btn"
                            onClick={() => deleteIngredient(e)}
                          >
                            <Xicon />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-ingredients">
                      <p>No has seleccionado ingredientes</p>
                      <p className="hint">Haz clic en los ingredientes para agregarlos</p>
                    </div>
                  )}
                </Card.Body>
                <Card.Footer className="selected-footer">
                  <Button
                    type="submit"
                    variant="primary"
                    className="generate-btn"
                    disabled={ingredients.length === 0 || loading}
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        <span className="ms-2">Generando...</span>
                      </>
                    ) : (
                      "Generar Receta"
                    )}
                  </Button>
                </Card.Footer>
              </Card>
            </Form>
          </Col>
        </Row>
        <ToastComponent show={show} setShow={setShow} errMsg={errMsg}></ToastComponent>
      </Container>

      
    </div>

    : <NoUser></NoUser>
    }
      </div>
    }


   </div>
    
)
}