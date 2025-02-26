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
        {label: "Fragrance", path: "#", icon: "material-icons", iconName: "local_pharmacy", isDropdown: true},
        {label: "New", path: "/categories/new", icon: "material-icons", iconName: "new_releases"},
        {label: "Clothing", path: "/categories/clothes", icon: "material-icons", iconName: "checkroom"},
        {label: "Corporate Wears", path: "/categories/corporate", icon: "material-icons", iconName: "business_center"},
        {label: "Dresses", path: "/categories/dress", icon: "material-icons", iconName: "dry_cleaning"},
        {label: "Shoes", path: "/categories/shoes", icon: "material-icons", iconName: "settings_accessibility"},
        {label: "Bags", path: "/categories/bags", icon: "material-icons", iconName: "shopping_bag"},
    ];

    const accessoriesCategories = [
        {label: "Sunglasses", path: "/categories/accessories/sunglasses", icon: "material-icons", iconName: "visibility"},
        {label: "Wrist Watches", path: "/categories/accessories/wrist-watches", icon: "material-icons", iconName: "watch"},
        {label: "Belts", path: "/categories/accessories/belts", icon: "material-icons", iconName: "no_encryption_gmailerrorred"},
        {label: "Bangles & Bracelet", path: "/categories/accessories/bangles-bracelet", icon: "material-icons", iconName: "circle"},
        {label: "Earrings", path: "/categories/accessories/earrings", icon: "material-icons", iconName: "stars"},
        {label: "Necklace", path: "/categories/accessories/necklace", icon: "material-icons", iconName: "diamond"},
        {label: "Pearls", path: "/categories/accessories/pearls", icon: "material-icons", iconName: "radio_button_unchecked"},
    ];

    const fragranceCategories = [
        {label: "Designer Perfumes & Niche", path: "/categories/fragrance/designer-niche", icon: "material-icons", iconName: "spa"},
        {label: "Unboxed Perfume", path: "/categories/fragrance/unboxed", icon: "material-icons", iconName: "inventory_2"},
        {label: "Testers", path: "/categories/fragrance/testers", icon: "material-icons", iconName: "science"},
        {label: "Arabian Perfume", path: "/categories/fragrance/arabian", icon: "material-icons", iconName: "mosque"},
        {label: "Diffuser", path: "/categories/fragrance/diffuser", icon: "material-icons", iconName: "air"},
        {label: "Mist", path: "/categories/fragrance/mist", icon: "material-icons", iconName: "water_drop"},
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
                <>
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40" 
                         onClick={handleMobileMenuToggle}>
                    </div>
                    <div className="fixed top-0 left-0 h-full w-[280px] bg-white z-50 mobile-menu-scroll">
                        <div className="sticky top-0 bg-white p-3 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-semibold">Menu</h2>
                                <button onClick={handleMobileMenuToggle} 
                                        className="p-1 hover:text-primary">
                                    <span className="material-icons text-xl">close</span>
                                </button>
                            </div>
                        </div>
                        <div className="p-3 overflow-y-auto">
                            <ul className="space-y-2">
                                {/* Main Categories */}
                                {mobileCategories.filter(cat => !cat.isDropdown).map((category, index) => (
                                    <li key={index}>
                                        <Link to={category.path}
                                              onClick={handleMobileMenuToggle}
                                              className="flex items-center py-2 hover:text-primary">
                                            <span className={`${category.icon} text-xl mr-3`}>
                                                {category.iconName}
                                            </span>
                                            <span className="text-sm">{category.label}</span>
                                        </Link>
                                    </li>
                                ))}

                                {/* Fragrances Section */}
                                <li className="border-t border-gray-100 pt-2">
                                    <button onClick={handleFragranceToggle}
                                            className="flex items-center justify-between w-full py-2">
                                        <div className="flex items-center">
                                            <span className="material-icons text-xl mr-3">local_pharmacy</span>
                                            <span className="text-sm">Fragrances</span>
                                        </div>
                                        <span className="material-icons text-xl">
                                            {isFragranceOpen ? 'expand_less' : 'expand_more'}
                                        </span>
                                    </button>
                                    {isFragranceOpen && (
                                        <ul className="ml-8 mt-1 space-y-1">
                                            {fragranceCategories.map((category, index) => (
                                                <li key={index}>
                                                    <Link to={category.path}
                                                          onClick={handleMobileMenuToggle}
                                                          className="flex items-center py-1.5 text-gray-600 hover:text-primary">
                                                        <span className={`${category.icon} text-xl mr-3`}>
                                                            {category.iconName}
                                                        </span>
                                                        <span className="text-sm">{category.label}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>

                                {/* Accessories Section */}
                                <li className="border-t border-gray-100 pt-2">
                                    <button onClick={handleAccessoriesToggle}
                                            className="flex items-center justify-between w-full py-2">
                                        <div className="flex items-center">
                                            <span className="material-icons text-xl mr-3">diamond</span>
                                            <span className="text-sm">Accessories</span>
                                        </div>
                                        <span className="material-icons text-xl">
                                            {isAccessoriesOpen ? 'expand_less' : 'expand_more'}
                                        </span>
                                    </button>
                                    {isAccessoriesOpen && (
                                        <ul className="ml-8 mt-1 space-y-1">
                                            {accessoriesCategories.map((category, index) => (
                                                <li key={index}>
                                                    <Link to={category.path}
                                                          onClick={handleMobileMenuToggle}
                                                          className="flex items-center py-1.5 text-gray-600 hover:text-primary">
                                                        <span className={`${category.icon} text-xl mr-3`}>
                                                            {category.iconName}
                                                        </span>
                                                        <span className="text-sm">{category.label}</span>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            </ul>
                        </div>
                    </div>
                </>
            )
        }
    </header>
  )
}

export default Navbar