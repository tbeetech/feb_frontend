import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BottomNav from './components/BottomNav'
import ScrollToTop from './components/ScrollToTop'
 
function App() {
  return (
    <>
      <Navbar/>
      <div className="mb-16 pt-16"> {/* Added pt-16 for navbar spacing */}
        <Outlet/>
      </div>
      <ScrollToTop />
      <BottomNav/>
      <Footer/>
    </>
  )
}
export default App
