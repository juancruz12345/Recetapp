import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from 'cors'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser';
import { createClient } from '@libsql/client'
import { UserRepository } from './user-repository.js';
import { GoogleGenerativeAI } from "@google/generative-ai";


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
const PORT = process.env.PORT || 3000;

const db = createClient({
    url:process.env.DB_URL,
    authToken: process.env.DB_TOKEN
})

const apiKeys = [
  { key: process.env.GEMINI_API_KEY, requests: 0 },
  { key: process.env.GEMINI_API_KEY_2, requests: 0 }
];
let currentKeyIndex = 0;


function getApiKey() {
  return apiKeys[currentKeyIndex].key;
}


async function generarTexto(prompt) {
  try {
    const genAI = new GoogleGenerativeAI(getApiKey());
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 400 } // Controla el gasto de tokens
    });

    apiKeys[currentKeyIndex].requests++;
    
    return result.response.text();
  } catch (error) {
    console.error("Error en la solicitud:", error.message);

    if (error.message.includes("429") || error.message.includes("Quota Exceeded")) {
      console.warn("Límite alcanzado. Cambiando de API Key...");

      // Cambiar a la siguiente API Key
      currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
      console.log(`Nueva API Key en uso: ${currentKeyIndex + 1}`);

      // Intentar nuevamente después de un breve tiempo
      await new Promise(res => setTimeout(res, 5000));
      return generarTexto(prompt);
    }

    throw error; // Relanzar error si no es un problema de cuota
  }
}






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

    const prompt = `Receta de cocina con estos ingredientes: ${ingredientes.join(", ")}. Debe tener el siguiente formato:*Nombre,*Ingredientes(cada ingrediente listado con '-'),*Instrucciones,*Dificultad,*Porciones y *Tiempo de coccion. Quiero que la receta que no supere las 300 palabras(haz las instrucciones cortas si es necesario, pero trae toda la receta y los puntos señalados).`;
    
    console.log("Ingredientes recibidos:", ingredientes)

    try {
        
       const response =await generarTexto(prompt)
      const stringArray = response.split('\n')
       if(stringArray[0].startsWith('¡Claro!') || stringArray[0].startsWith('¡Aquí tienes') || stringArray[0].startsWith('¡Absolutamente') || stringArray[0].startsWith('¡Porsupuesto') || stringArray[0].startsWith('¡Muy bien')){
        stringArray.shift()
       }
       const receta = stringArray.join('\n').replaceAll('*','')
      
        res.json({receta})
    } catch (error) {
       
        console.error("Error generando receta:", error)
        res.status(500).json({ error: "Error generando receta." })
    }
})

app.post('/guardar-receta', async(req,res)=>{

  const {user_id, nuevaReceta} = req.body
  console.log(nuevaReceta)
  const recetaArray = nuevaReceta.split('\n')
  console.log(recetaArray[0])
  const nombreReceta = recetaArray[0] !== '' ? recetaArray[0].replace('Nombre: ', '') : recetaArray[1].replace('Nombre: ', '')
  

  
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



app.delete('/recetas/:id', async(req,res)=>{

  const {id} = req?.params
  console.log(id)
  if(!id){
    throw new Error('El id de la receta es requerido')
  }

  try{

    await db.execute("DELETE FROM recipe WHERE id = ?", [id])
    res.json({ success: true, message: "receta eliminada correctamente" })

  }catch(error){
    console.error('Error al eliminar receta:', error)
    res.status(500).json({ message: 'Error interno del servidor.' })
  }
})


app.post('/logout', (req,res)=>{
    res.clearCookie('acces_token')
    res.clearCookie('refresh_token')
    .json({message:'logout succesful'})
})

app.listen(PORT, () => console.log(`Servidor en ${PORT}`))


/**ç
 *  const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.HF_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                inputs: `Genera una receta con estos ingredientes: ${ingredientes.join(", ")}. La receta debe estar en español y debe tener la siguiente estructura: -Nombre de la receta, -Nivel de dificultad de la receta(facil,medio,dificil),-Ingredientes(cada ingrediente debe estar listado con un guion), -Cantidad de pasos de la receta, -Tiempo de coccion en total, -Porciones y -Instrucciones. Las instrucciones deben tener el numero seguido de un punto al comenzar(porjemplo: 1.). No quiero que haya texto de más, limitate a darme la receta y filtra cualquier nombre de autor si la receta es de un post.`
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
        
 */