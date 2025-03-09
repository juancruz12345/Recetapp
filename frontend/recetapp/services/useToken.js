export function useToken(){
    const logout = async() => {
        console.log('logou')
          try {
             await fetch('http://localhost:3000/logout', {
              method: 'POST',
              credentials: 'include', // to send cookies with the request
            });
            window.location.href = '/';
          } catch (error) {
            console.error('Error logging out:', error);
          }
   
   }

   return {logout}
}