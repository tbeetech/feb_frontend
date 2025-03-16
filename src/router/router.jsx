import {createBrowserRouter} from "react-router-dom";
import ProductUpload from "../pages/admin/ProductUpload";
import ProductManagement from "../pages/admin/ProductManagement";
import EditProduct from "../pages/admin/EditProduct";
import App from "../App";
import Home from "../pages/home/Home";
import CategoryPage from "../pages/category/CategoryPage";
import Search from "../pages/search/Search";
import ShopPage from "../pages/shop/ShopPage";
import SingleProduct from "../pages/shop/productDetails/SingleProduct";
import Login from "../components/Login";
import Register from "../components/Register";
import Checkout from "../pages/shop/Checkout";
import BillingDetails from "../components/BillingDetails";
import Contact from "../pages/contact/Contact";
import About from "../pages/about/About";
import ErrorBoundary from '../components/ErrorBoundary';

const router = createBrowserRouter([
{
path: "/",
element:<App/>,
errorElement: <ErrorBoundary />,
children: [
    {path: "/",element: <Home/>},
    {path: "/categories/:categoryName", element: <CategoryPage/>, errorElement: <ErrorBoundary />},
    {path: "/categories/:categoryName/:subcategory", element: <CategoryPage/>, errorElement: <ErrorBoundary />},
    {path: "/category/:categoryName", element: <CategoryPage/>}, // Legacy support
    {path: "/search", element: <Search/>},
    {path: "/shop", element:<ShopPage/>},
    {path: "/product/:id", element:<SingleProduct/>},
    {path: "/checkout", element:<Checkout/>},
    {path: "/billing-details", element:<BillingDetails/>},
    {path: "/contact", element: <Contact/>},
    {path: "/about", element: <About/>},
    {path: "/admin/upload-product", element: <ProductUpload />},
    {path: "/admin/manage-products", element: <ProductManagement />},
    {path: "/admin/edit-product/:id", element: <EditProduct />}
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