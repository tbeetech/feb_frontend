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
        {label: "New", path: "/categories/new", icon: "ri-new-line"},
        {label: "Clothing", path: "/categories/clothes", icon: "ri-t-shirt-line"},
        {label: "Corporate Wears", path: "/categories/corporate", icon: "ri-suit-line"},
        {label: "Dresses", path: "/categories/dress", icon: "ri-dress-line"},
        {label: "Shoes", path: "/categories/shoes", icon: "ri-shoe-line"},
        {label: "Bags", path: "/categories/bags", icon: "ri-handbag-line"},
        
    ];

    const accessoriesCategories = [
        {label: "Sunglasses", path: "/categories/accessories/sunglasses", icon: "ri-sunglasses-line"},
        {label: "Wrist Watches", path: "/categories/accessories/wrist-watches", icon: "ri-watch-line"},
        {label: "Belts", path: "/categories/accessories/belts", icon: "ri-belt-line"},
        {label: "Bangles & Bracelet", path: "/categories/accessories/bangles-bracelet", icon: "ri-bracelet-line"},
        {label: "Earrings", path: "/categories/accessories/earrings", icon: "ri-earrings-line"},
        {label: "Necklace", path: "/categories/accessories/necklace", icon: "ri-necklace-line"},
        {label: "Pearls", path: "/categories/accessories/pearls", icon: "ri-pearl-line"},
    ];

    const fragranceCategories = [
        {label: "Designer Perfumes & Niche", path: "/categories/fragrance/designer-niche", icon: "ri-perfume-line"},
        {label: "Unboxed Perfume", path: "/categories/fragrance/unboxed", icon: "ri-open-box-line"},
        {label: "Testers", path: "/categories/fragrance/testers", icon: "ri-test-tube-line"},
        {label: "Arabian Perfume", path: "/categories/fragrance/arabian", icon: "ri-arabic-line"},
        {label: "Diffuser", path: "/categories/fragrance/diffuser", icon: "ri-diffuser-line"},
        {label: "Mist", path: "/categories/fragrance/mist", icon: "ri-mist-line"},
    ];

    const [isAccessoriesOpen, setIsAccessoriesOpen] = useState(false);
    const [isFragranceOpen, setIsFragranceOpen] = useState(false);

    const handleAccessoriesToggle = () => {
        setIsAccessoriesOpen(!isAccessoriesOpen);
    };

    const handleFragranceToggle = () => {
        setIsFragranceOpen(!isFragranceOpen);
    };

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
                            <li className='flex items-center'>
                                <i className="ri-store-2-line mr-2"></i>
                                <Link onClick={handleMobileMenuToggle} to="/shop">Shop</Link>
                            </li>
                            <hr className='my-2 border-gray-200'/>
                            {mobileCategories.map((category, index) => (
                                <React.Fragment key={index}>
                                    <li className='flex items-center'>
                                        <i className={`${category.icon} mr-2`}></i>
                                        <Link onClick={handleMobileMenuToggle} to={category.path}>{category.label}</Link>
                                    </li>
                                    <hr className='my-2 border-gray-200'/>
                                </React.Fragment>
                            ))}
                            <li>
                                <button onClick={handleAccessoriesToggle} className='flex items-center w-full'>
                                    <i className="ri-handbag-line mr-2"></i>
                                    Accessories
                                    <i className={`ml-2 ${isAccessoriesOpen ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`}></i>
                                </button>
                                {isAccessoriesOpen && (
                                    <ul className='ml-4 mt-2 space-y-2'>
                                        {accessoriesCategories.map((category, index) => (
                                            <React.Fragment key={index}>
                                                <li className='flex items-center'>
                                                    <i className={`${category.icon} mr-2`}></i>
                                                    <Link onClick={handleMobileMenuToggle} to={category.path}>{category.label}</Link>
                                                </li>
                                                <hr className='my-2 border-gray-200'/>
                                            </React.Fragment>
                                        ))}
                                    </ul>
                                )}
                            </li>
                            <hr className='my-2 border-gray-200'/>
                            <li>
                                <button onClick={handleFragranceToggle} className='flex items-center w-full'>
                                    <i className="ri-perfume-line mr-2"></i>
                                    Fragrance
                                    <i className={`ml-2 ${isFragranceOpen ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}`}></i>
                                </button>
                                {isFragranceOpen && (
                                    <ul className='ml-4 mt-2 space-y-2'>
                                        {fragranceCategories.map((category, index) => (
                                            <React.Fragment key={index}>
                                                <li className='flex items-center'>
                                                    <i className={`${category.icon} mr-2`}></i>
                                                    <Link onClick={handleMobileMenuToggle} to={category.path}>{category.label}</Link>
                                                </li>
                                                <hr className='my-2 border-gray-200'/>
                                            </React.Fragment>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            )
        }
    </header>
  )
}

export default Navbar