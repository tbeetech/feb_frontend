import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import Home from "../pages/home/Home";
import CategoryPage from "../pages/category/CategoryPage";
import Search from "../pages/search/Search";
import ShopPage from "../pages/shop/ShopPage";
import SingleProduct from "../pages/shop/productDetails/SingleProduct";
import Login from "../components/Login";
import Register from "../components/Register";
import Checkout from "../pages/shop/Checkout";
import Contact from "../pages/contact/Contact";
import About from "../pages/about/About";

const router = createBrowserRouter([
{
path: "/",
element:<App/>,
children: [
    {path: "/",element: <Home/>},
    {path: "/categories/:categoryName", element: <CategoryPage/>},
    {path: "/categories/:categoryName/:subcategory", element: <CategoryPage/>},
    {path: "/category/:categoryName", element: <CategoryPage/>}, // Legacy support
    {path: "/search", element: <Search/>},
    {path: "/shop", element:<ShopPage/>},
    {path: "/product/:id", element:<SingleProduct/>},
    {path: "/checkout", element:<Checkout/>},
    {path: "/contact", element: <Contact/>},
    {path: "/about", element: <About/>}
]
},
{
    path:"/login",
    element: <Login/>
},
{
    path:'/register',
    element:<Register/>
}
]);

export default router;