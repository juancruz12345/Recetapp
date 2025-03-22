"use client";
import { createContext, useContext } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

const UserContext = createContext();

export function UserProvider({ children }) {
  

  // ✅ Obtener usuario desde la API con cache
  const { data: user, error, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await fetch("https://recetapp-8vna.onrender.com", { credentials: "include" });
      if (!response.ok) throw new Error("Error al obtener el usuario");
      console.log('fetch cookies')
      return response.json();
    },
    staleTime: 1000 * 60 * 40, 
    cacheTime: 1000 * 60 * 60,
  });

  const updateUser = useMutation({
    mutationFn: async ( username ) => { // Un solo argumento como objeto
      
      const response = await fetch(`https://recetapp-8vna.onrender.com/usuario/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(username), 
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Error al actualizar el usuario");
      }
      console.log("usuario actualizado");
      return response.json();
    },
   
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const response = await fetch(`https://recetapp-8vna.onrender.com/usuario/${user?.id}`, { credentials: "include" });
      if (!response.ok) throw new Error("Error al obtener el perfil");
      console.log('fetch usuario')
      
      const data = await response.json();
      
      return data[0];
    },
    staleTime: 1000 * 60 * 40, 
    cacheTime: 1000 * 60 * 60,
    enabled: !!user, // Solo ejecuta la consulta si hay un usuario
  });

 

  return (
    <UserContext.Provider value={{ user, isLoading, updateUser,profile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}