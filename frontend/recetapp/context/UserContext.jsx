"use client";
import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

const UserContext = createContext();

export function UserProvider({ children }) {
  

  // ✅ Obtener usuario desde la API con cache
  const { data: user, error, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000", { credentials: "include" });
      if (!response.ok) throw new Error("Error al obtener el usuario");
      console.log('fetch cookies')
      return response.json();
    },
    staleTime: 1000 * 60 * 40, 
    cacheTime: 1000 * 60 * 60,
  });

 

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}