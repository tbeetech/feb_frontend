import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import CartModal from '../pages/shop/CartModal';
import avatarImg from "../assets/avatar.png"
import { useLogoutUserMutation } from '../redux/features/auth/authApi';
import { logout } from '../redux/features/auth/authSlice';

const Navbar = () => {
    const products = useSelector((state) => state.cart.products);
    const [isCartOpen, setIsCartOpen] = React.useState(false);
    const handleCartToggle = () => {
        setIsCartOpen(!isCartOpen)
    }
    const dispatch = useDispatch();
    const {user} = useSelector((state)=> state.auth);
    const [logoutUser] = useLogoutUserMutation();
    const navigate = useNavigate(); 

    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const handDropDownToggle = () => {
        setIsDropDownOpen(!isDropDownOpen)
    }
    const adminDropDownMenus = [
        {label: "Dashboard", path: "/dashboard/admin"},
        {label: "Manage Items", path: "/dashboard/manage-products"},
        {label: "All Orders", path: "/dashboard/manage-orders"},
        {label: "Add New Post", path: "/dashboard/add-new-post"},
    ]
    const userDropDownMenus = [
        {label: "Dashboard", path: "/dashboard"},
        {label: "Profile", path: "/dashboard/profile"},
        {label: "Payments", path: "/dashboard/payments"},
        {label: "Orders", path: "/dashboard/orders"},
    ]
    const dropdownMenus = user?.role === 'admin' ? [...adminDropDownMenus] : [...userDropDownMenus]
    const  handleLogout = async () => {
        try {
                await logoutUser().unwrap();
                dispatch(logout())
                navigate("/")
        } catch (error) {
                console.error("Failed to log out", error)
        }
    }

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const handleMobileMenuToggle = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

    const mobileCategories = [
        {label: "Shop", path: "/shop", icon: "ri-store-line"},
        {label: "Accessories", path: "/categories/accessories", icon: "ri-handbag-line"},
        {label: "Dress", path: "/categories/dress", icon: "ri-t-shirt-line"},
        {label: "Jewelry", path: "/categories/jewelry", icon: "ri-gem-line"},
        {label: "Perfumes", path: "/categories/perfumes", icon: "ri-bubble-chart-line"},
        {label: "Men Accessories", path: "/categories/men-accessories", icon: "ri-men-line"},
        {label: "Women Accessories", path: "/categories/women-accessories", icon: "ri-women-line"},
    ];

  return (
    <header className='fixed-nav-bar w-nav'>
        <nav className='max-w-screen-2x1 mx-auto px-4 flex justify-between items-center'>
            <span className='md:hidden'>
                <button onClick={handleMobileMenuToggle} className='hover:text-primary'>
                    <i className="ri-menu-line"></i>
                </button>
            </span>
            <ul className='nav__links hidden md:flex'>
                <li className='link'><Link to="/">Home</Link></li>
                <li className='link'><Link to="/shop">Shop</Link></li>
                <li className='link'><Link to="/">Pages</Link></li>
                <li className='link'><Link to="/contact">Contact</Link></li>  
            </ul>
            {/* logo */}
            <div className='nav__logo'>
                <Link>febluxury<span>.</span></Link>
            </div>
            {/* nav icons */}
            <div className='nav__icons relative'>
                <span>
                <Link to="/search">
                <i className="ri-search-line"></i>
                </Link>
                </span>
                <span>
                    <button onClick={handleCartToggle}
                    className='hover:text-primary'>

                        <i className="ri-shopping-bag-line"></i>
                        <sup className='text-sm inline-block px-1.5 text-white rounded-full bg-primary text-center'>
                            {products.length}
                        </sup>
                    </button>
                </span>
                <span>
                   {

                    user && user ? (<>
                   <img
                   onClick={handDropDownToggle}
                   src={user?.profileImage || avatarImg} alt="" 
                   className='size-6 rounded-full cursor-pointer' /> 
                   {
                    isDropDownOpen && (
                        <div className='absolute right-0 mt-3 p-4 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50'>
                            <ul className='font-medium space-y-4 p-2'>
                                {dropdownMenus.map((menu, index)=>(
                                    <li key={index}>
                                        <Link
                                        onClick={()=> setIsDropDownOpen(false)}
                                        className='dropdown-items' to={menu.path}>{menu.label}</Link>
                                    </li>
                                ))}
                                <li><Link onClick={handleLogout} className='dropdown-items'>Logout</Link></li>
                            </ul>
                        </div>
                    )
                   }
                    </>) : (<Link to="login">
                        <i className='ri-user-line'></i></Link>)
                   }
                </span>

            </div>
        </nav>
        {
            isCartOpen && <CartModal products={products} isOpen={isCartOpen} onClose={handleCartToggle}/>
        }
        {
            isMobileMenuOpen && (
                <div className='absolute top-0 left-0 w-full h-full bg-white z-50'>
                    <div className='p-4'>
                        <button onClick={handleMobileMenuToggle} className='hover:text-primary'>
                            <i className="ri-close-line"></i>
                        </button>
                        <ul className='mt-4 space-y-4'>
                            {mobileCategories.map((category, index) => (
                                <li key={index} className='flex items-center'>
                                    <i className={`${category.icon} mr-2`}></i>
                                    <Link onClick={handleMobileMenuToggle} to={category.path}>{category.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )
        }
    </header>
  )
}

export default Navbar