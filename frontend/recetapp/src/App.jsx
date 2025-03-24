
import { Home } from "../components/Home"
import {Routes, Route} from 'react-router-dom'
import { Login } from "../components/Login"
import { SignUp } from "../components/SignUp"
import Recipes from "../components/Recipes"
import { RecipesDetails } from "../components/RecipesDetails"
import { VerifyAccount } from "../components/VerifyAccount"
import  User  from "../components/User"
import { useThemeContext } from "../context/ThemeContext"
import './App.css'

function App() {

  const {theme} = useThemeContext()
  const html = document.querySelector('html')
  html.setAttribute('data-bs-theme', theme)

 return(
    <div>
     <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/registro" element={<SignUp/>}></Route>
      <Route path="/recetas" element={<Recipes/>}></Route>
      <Route path="/recetas/:id" element={<RecipesDetails/>}></Route>
      <Route path="/verificar-cuenta/:email" element={<VerifyAccount/>}></Route>
      <Route path="/usuario/:id" element={<User/>}></Route>
     </Routes>
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Recetapp - Todas las recetas son generadas con IA</p>
      </footer>
    </div>
   
  )
}

export default App

