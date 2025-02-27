import { Outlet } from 'react-router-dom'
import './App.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BottomNav from './components/BottomNav'
import ScrollToTopButton from './components/ScrollToTopButton'
 
function App() {
  return (
    <>
      <Navbar/>
      <div className="mb-16">
        <Outlet/>
      </div>
      <ScrollToTopButton />
      <BottomNav/>
      <Footer/>
    </>
  )
}
export default App
