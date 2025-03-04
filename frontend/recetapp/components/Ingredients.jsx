import { Badge } from "react-bootstrap"
import "./Ingredients.css"

export function Ingredient({ name, type, ingredient, addIngredient }) {
  const getVariant = () => {
    switch (type) {
      case "Vegetal":
        return "success"
      case "Carne bovina":
        return "danger"
      case "Carne porcina":
        return "warning"
      default:
        return "secondary"
    }
  }

  const handleClick = () => {
    if (addIngredient) {
      addIngredient(ingredient)
    }
  }

  return (
    <Badge onClick={handleClick} className={`ingredient-badge ${addIngredient ? "clickable" : ""}`} bg={getVariant()}>
      {name}
    </Badge>
  )
}

