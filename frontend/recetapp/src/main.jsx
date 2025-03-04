
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { UserProvider } from '../context/UserContext.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  
 <QueryClientProvider client={queryClient}>
  <UserProvider>
   <BrowserRouter>
    <App />
    </BrowserRouter>
 </UserProvider>
 </QueryClientProvider>
 
)
