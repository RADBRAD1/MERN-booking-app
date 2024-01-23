import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; //import index.css
import { QueryClient, QueryClientProvider } from "react-query";
import { AppContextProvider } from './contexts/AppContext.tsx';

//define the queryclient options
//allow app to have access to have all the react hook statements created in register 
const queryClient = new QueryClient(
  {defaultOptions: {
    queries: {retry: 0,},
  },
}
)

//put app inside the queryclientprovider
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client = {queryClient}>
      <AppContextProvider>
      <App /> 
      </AppContextProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
