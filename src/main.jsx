import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './router/router.jsx'
import 'remixicon/fonts/remixicon.css'
import {Provider} from 'react-redux'
import {store} from './redux/store.js'
import { ThemeProvider } from './context/ThemeContext'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid #4CAF50',
            },
            iconTheme: {
              primary: '#4CAF50',
              secondary: '#ffffff',
            },
          },
          error: {
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid #f44336',
            },
            iconTheme: {
              primary: '#f44336',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </ThemeProvider>
  </Provider>,
)
