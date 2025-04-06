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
import CartPage from "../pages/shop/CartPage";
import BillingDetails from "../components/BillingDetails";
import Contact from "../pages/contact/Contact";
import About from "../pages/about/About";
import ErrorBoundary from '../components/ErrorBoundary';
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Orders from "../pages/Orders";
import Payments from "../pages/Payments";
import Reviews from "../pages/Reviews";
import PrivateRoute from "../routes/PrivateRoute";
import AdminRoute from "../routes/AdminRoute";
import ScrollToTop from "../components/ScrollToTopOnNavigate";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const router = createBrowserRouter([
{
path: "/",
element:
    <>
        <ScrollToTop />
        <App/>
    </>,
errorElement: <ErrorBoundary />,
children: [
    {path: "/",element: <Home/>},
    {path: "/categories/:categoryName", element: <CategoryPage/>, errorElement: <ErrorBoundary />},
    {path: "/categories/:categoryName/:subcategory", element: <CategoryPage/>, errorElement: <ErrorBoundary />},
    {path: "/category/:categoryName", element: <CategoryPage/>}, // Legacy support - redirect to new format
    {path: "/search", element: <Search/>},
    {path: "/shop", element:<ShopPage/>},
    {path: "/product/:id", element:<SingleProduct/>},
    {path: "/cart", element:<CartPage/>},
    {path: "/checkout", element:<Checkout/>},
    {path: "/billing-details", element:<BillingDetails/>},
    {path: "/contact", element: <Contact/>},
    {path: "/about", element: <About/>},
    {path: "/admin/upload-product", element: <AdminRoute><ProductUpload /></AdminRoute>},
    {path: "/admin/manage-products", element: <AdminRoute><ProductManagement /></AdminRoute>},
    {path: "/admin/edit-product", element: <AdminRoute><EditProduct /></AdminRoute>},
    {path: "/admin/edit-product/:id", element: <AdminRoute><EditProduct /></AdminRoute>},
    {
        path: "/dashboard",
        element: <PrivateRoute><Dashboard /></PrivateRoute>,
        children: [
            { index: true, element: <Profile /> },
            { path: "profile", element: <Profile /> },
            { path: "orders", element: <Orders /> },
            { path: "payments", element: <Payments /> },
            { path: "reviews", element: <Reviews /> }
        ]
    }
]
},
{
    path:"/login",
    element: 
    <>
        <ScrollToTop />
        <Navbar />
        <Login/>
        <Footer />
    </>
},
{
    path:'/register',
    element:
    <>
        <ScrollToTop />
        <Navbar />
        <Register/>
        <Footer />
    </>
}
]);

export default router;