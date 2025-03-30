import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './router/router.jsx'
import 'remixicon/fonts/remixicon.css'
import {Provider} from 'react-redux'
import {store} from './redux/store.js'
import { ThemeProvider } from './context/ThemeContext'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </Provider>,
)
