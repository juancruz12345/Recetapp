import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from 'cors'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
import { createClient } from '@libsql/client'
import { UserRepository } from './user-repository.js';



dotenv.config()


if (!process.env.DB_URL || !process.env.DB_TOKEN || !process.env.HF_API_KEY) {
    throw new Error("Missing environment variables");
  }

const app = express()
app.use(cors({credentials: true ,
    origin: true
    
  }));
  
app.use(express.json())
app.use(cookieParser())

const db = createClient({
    url:process.env.DB_URL,
    authToken: process.env.DB_TOKEN
})



app.use((req, res, next) => {
    const accessToken = req.cookies.acces_token;
    const refreshToken = req.cookies.refresh_token;
    const isProduction = process.env.NODE_ENV === 'production';
    req.session = { user: null };
  
    try {
      if (accessToken) {
        // Verificar el access token
        const data = jwt.verify(accessToken, process.env.SECRET_KEY);
        req.session.user = data; 
      } else if (refreshToken) {
        // Intentar refrescar el access token usando el refresh token
        try {
          const refreshData = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
          
          // Generar un nuevo access token
          const newAccessToken = jwt.sign(
            { id: refreshData.id, username: refreshData.username },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
          );
  
          // Establecer la nueva cookie de access token
          res.cookie('acces_token', newAccessToken, {
              httpOnly: true,
              secure: isProduction,  // Solo HTTPS en producción
              sameSite: isProduction ? 'None' : 'Lax', // 'None' si es producción, 'Lax' para desarrollo
              maxAge: 1000 * 60 * 60  // 1 hora
          
          });
  
          req.session.user = { id: refreshData.id, username: refreshData.username };
        } catch (refreshErr) {
          console.error('Error al refrescar el token:', refreshErr);
          return res.status(403).send('Invalid refresh token');
        }
      }
    } catch (err) {
      console.error('Error de autenticación:', err.message);
      return res.status(401).send('Invalid access token');
    }
  
    next();
  });
  
  
  
  app.get('/', (req, res) => {
      const {user} = req.session
      res.json(user)
    })
  


///USER///////////////////
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await UserRepository.login({ username, password });

        const accesToken = jwt.sign(
            { id: user.id, username: user.username },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            { id: user.id, username: user.username },
            process.env.REFRESH_SECRET_KEY,
            { expiresIn: '7d' }
        );

        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('acces_token', accesToken, {
            httpOnly: true,
            secure: isProduction,  // Solo HTTPS en producción
            sameSite: isProduction ? 'None' : 'Lax', // 'None' si es producción, 'Lax' para desarrollo
            maxAge: 1000 * 60 * 60  // 1 hora
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'None' : 'Lax',
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 días
        });

        res.send({ user, accesToken, refreshToken });

    } catch (e) {
      res.status(400).json({ error: e.message }); 
    }
});

app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const result = await UserRepository.create({ username, password, email });
     
    res.send({result})
     
  } catch (e) {
    res.status(400).json({ error: e.message }); 
  }
});







app.post("/receta", async (req, res) => {
    const { ingredientes } = req.body;

    
    console.log("Ingredientes recibidos:", ingredientes)

    try {
        
        const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.HF_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: `Genera una receta con estos ingredientes: ${ingredientes.join(", ")}. La receta debe estar en español y debe comenzar desde el nombre de la receta. La receta debe tener una parte que diga el -Nivel de dificultad de la receta(facil,medio,dificil),-Ingredientes, -Cantidad de pasos de la receta, -Tiempo de coccion en total y -Porciones. Es importante que la receta no tenga errores gramaticales u ortograficos (revisala antes de darmela).`
            })
        })

       
        if (!response.ok) {
            throw new Error(`Error en Hugging Face: ${response.statusText}`)
        }

        const data = await response.json()

        const dataArray=data[0].generated_text.split('\n')
        dataArray.shift()
        const dataString = dataArray.join('\n')
        dataString.replace('*','')
        

        res.json({ receta: dataString})
    } catch (error) {
       
        console.error("Error generando receta:", error)
        res.status(500).json({ error: "Error generando receta." })
    }
})

app.post('/guardar-receta', async(req,res)=>{

  const {user_id, nuevaReceta} = req.body
  
  const recetaArray = nuevaReceta.split('\n')
  const recetaNombreStr = recetaArray.filter((e)=>e.includes('Receta:')|| e.includes('Title:')||e.includes('Receta de '))
  const nombreReceta = recetaNombreStr.length>0 ? recetaNombreStr[0]?.replace('Receta: ', '').replace('Title: ', '').replace('Receta de ','') : recetaArray[2]
  try {

    if (!user_id || !nuevaReceta) {
      return res.status(400).json({ error: 'El ID de usuario y la receta son requeridos' });
    }

  const existingRecipe = await db.execute({
    sql:'SELECT * FROM recipe WHERE recipe_name = :nombreReceta AND user_id = :user_id',
    args: {nombreReceta, user_id}
 })

 if (existingRecipe.rows.length > 0) {
  
  return res.status(409).json({ error: 'La receta ya existe para este usuario' });
}

  
   
 
    await db.execute(
      'INSERT INTO recipe (recipe_name,user_id, recipe) VALUES (?, ?, ?)',
      [nombreReceta,user_id, nuevaReceta]
    )
    
    res.status(201).json({ message: 'Receta agregada exitosamente' });
  }
   catch (e) {
   
    res.status(500).json({ error: 'Error interno del servidor' });
  }

})



app.get('/recetas/:user_id', async(req,res)=>{

  const {user_id} = req.params
  console.log('reqparams:', req.params) 
  if (!user_id) {
    throw new Error('id de usuario es requerido')
  }
   

  try{

    const result = await db.execute(
      {sql:'SELECT * FROM recipe WHERE user_id = :user_id',
        args: {user_id}}
    )
    res.json(result.rows)

  }catch(e){
    res.status(400).json({ error: e.message }); 
  }
})


app.post('/logout', (req,res)=>{
    res.clearCookie('acces_token')
    res.clearCookie('refresh_token')
    .json({message:'logout succesful'})
})

app.listen(3000, () => console.log("Servidor en http://localhost:3000"))
