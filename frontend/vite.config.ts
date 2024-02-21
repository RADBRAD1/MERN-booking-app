import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'



export default {
  plugins: [react()], server: { port:5179,
  
} 

};


/* default defineconfig for vite app.

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], server: {port:5179,
    
}, 

});


*/