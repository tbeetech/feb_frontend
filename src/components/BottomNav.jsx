import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import avatarImg from "../assets/avatar.png";

const BottomNav = () => {
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    const isActive = (path) => {
        return location.pathname === path ? 'text-primary' : 'text-gray-500';
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 z-50">
            <div className="flex justify-around items-center">
                <Link to="/" className="flex flex-col items-center">
                    <i className={`ri-home-line text-xl ${isActive('/')}`}></i>
                    <span className={`text-xs mt-1 ${isActive('/')}`}>Home</span>
                </Link>
                <Link to="/shop" className="flex flex-col items-center">
                    <i className={`ri-shopping-bag-line text-xl ${isActive('/shop')}`}></i>
                    <span className={`text-xs mt-1 ${isActive('/shop')}`}>Shop</span>
                </Link>
                <Link to="/search" className="flex flex-col items-center">
                    <i className={`ri-search-line text-xl ${isActive('/search')}`}></i>
                    <span className={`text-xs mt-1 ${isActive('/search')}`}>Search</span>
                </Link>
                <Link to={user ? "/dashboard" : "/login"} className="flex flex-col items-center">
                    {user ? (
                        <img src={user?.profileImage || avatarImg} alt="" className="w-6 h-6 rounded-full" />
                    ) : (
                        <i className={`ri-user-line text-xl ${isActive('/login')}`}></i>
                    )}
                    <span className={`text-xs mt-1 ${isActive(user ? '/dashboard' : '/login')}`}>
                        {user ? 'Profile' : 'Login'}
                    </span>
                </Link>
            </div>
        </div>
    );
};

export default BottomNav;
