import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
  useParams,
  useRouterState,
  useSearch,
} from "@tanstack/react-router";
import Layout from "./components/Layout";
import Toast from "./components/Toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyOrders from "./pages/MyOrders";
import ProductDetail from "./pages/ProductDetail";
import Shop from "./pages/Shop";
import Signup from "./pages/Signup";
import Wishlist from "./pages/Wishlist";
import Dashboard from "./pages/admin/Dashboard";
import DashboardStats from "./pages/admin/DashboardStats";
import ManageAdmins from "./pages/admin/ManageAdmins";
import ManageBannerOffers from "./pages/admin/ManageBannerOffers";
import ManageCustomers from "./pages/admin/ManageCustomers";
import ManageHeroSlides from "./pages/admin/ManageHeroSlides";
import ManageOrders from "./pages/admin/ManageOrders";

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => (
    <AuthProvider>
      <CartProvider>
        <Layout />
        <Toast />
      </CartProvider>
    </AuthProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: About,
});
const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop",
  component: Shop,
});
const productRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shop/$id",
  component: ProductDetail,
});
const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: Cart,
});
const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog",
  component: Blog,
});
const blogPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/blog/$id",
  component: BlogPost,
});
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: Contact,
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});
const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  component: Signup,
});
const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/gallery",
  component: Gallery,
});
const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/dashboard",
  component: Dashboard,
});
const adminStatsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/stats",
  component: DashboardStats,
});
const adminCustomersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/customers",
  component: ManageCustomers,
});
const adminOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/orders",
  component: ManageOrders,
});
const adminHeroSlidesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/hero-slides",
  component: ManageHeroSlides,
});
const adminBannerOffersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/banner-offers",
  component: ManageBannerOffers,
});

const adminAdminsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/admins",
  component: ManageAdmins,
});
const wishlistRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wishlist",
  component: Wishlist,
});
const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: Checkout,
});
const myOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-orders",
  component: MyOrders,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  shopRoute,
  productRoute,
  cartRoute,
  blogRoute,
  blogPostRoute,
  contactRoute,
  loginRoute,
  signupRoute,
  galleryRoute,
  adminDashboardRoute,
  adminStatsRoute,
  adminCustomersRoute,
  adminOrdersRoute,
  adminHeroSlidesRoute,
  adminBannerOffersRoute,
  adminAdminsRoute,
  wishlistRoute,
  checkoutRoute,
  myOrdersRoute,
]);

const router = createRouter({ routeTree });

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
