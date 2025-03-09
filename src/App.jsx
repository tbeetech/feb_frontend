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
    <div className="flex flex-col min-h-screen"> {/* Add flex container */}
      <Navbar/>
      <main className="flex-grow"> {/* Remove pt-0 completely */}
        <Outlet/>
      </main>
      <Footer/>
      <BottomNav/> {/* Place BottomNav after Footer */}
      <ScrollToTopButton />
    </div>
  )
}
export default App
