import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BottomNav from './components/BottomNav'
 
function App() {
  return (
    <>
      <Navbar/>
      <div className="mb-16"> {/* Add margin bottom to prevent content from being hidden behind bottom nav */}
        <Outlet/>
      </div>
      <BottomNav/>
      <Footer/>
    </>
  )
}
export default App
