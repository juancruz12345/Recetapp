
import { Home } from "../components/Home"
import {Routes, Route} from 'react-router-dom'
import { Login } from "../components/Login"
import { SignUp } from "../components/SignUp"
import Recipes from "../components/Recipes"
import { RecipesDetails } from "../components/RecipesDetails"

function App() {
 return(
    <div>
     <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/registro" element={<SignUp/>}></Route>
      <Route path="/recetas" element={<Recipes/>}></Route>
      <Route path="/recetas/:id" element={<RecipesDetails/>}></Route>
     </Routes>
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Mi Cocinero Virtual - Todas las recetas son generadas con IA</p>
      </footer>
    </div>
   
  )
}

export default App

