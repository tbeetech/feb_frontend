import { Outlet } from 'react-router-dom'
import './App.css'
import './styles/responsiveStyles.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BottomNav from './components/BottomNav'
import ScrollToTopButton from './components/ScrollToTopButton'
 
function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="min-h-[60vh] pt-2">
        <Outlet />
      </main>
      <Footer />
      <BottomNav className="md:hidden" /> {/* Only show on mobile */}
      <ScrollToTopButton />
    </div>
  )
}

export default App
