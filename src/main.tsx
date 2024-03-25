import React from 'react'
import ReactDOM from 'react-dom/client'
import {App} from './App.tsx'
import { UserContextProvider } from './contexts/ChatContext.tsx'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
