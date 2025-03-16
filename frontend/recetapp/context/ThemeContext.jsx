import { createContext, useContext, useState, useEffect } from "react";


const ThemeContext = createContext();

export function ThemeProvider({children}){

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')


  useEffect(() => {
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
    
  };

    return(
        <ThemeContext.Provider value={{theme,toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useThemeContext(){
    return useContext(ThemeContext)
}