import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { checkAuth } from './redux/features/auth/authSlice'
import './App.css'
import './styles/responsiveStyles.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BottomNav from './components/BottomNav'
import ScrollToTopButton from './components/ScrollToTopButton'
import { Toaster } from 'react-hot-toast'

function App() {
  const dispatch = useDispatch();

  // Check authentication status on app load
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="min-h-[60vh]">
        <Outlet />
      </main>
      <Footer />
      <BottomNav className="md:hidden" /> {/* Only show on mobile */}
      <ScrollToTopButton />
      <Toaster position="top-center" />
    </div>
  )
}

export default App
