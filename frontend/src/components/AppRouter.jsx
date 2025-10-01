import React from "react";
import { useRouter } from "./contexts/RouterContext";
import { useAuth } from "./contexts/AuthContext";
import Loading from "./components/Loading";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import CartPage from "./pages/CartPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import AdminPage from "./pages/AdminPage";
import OrdersPage from "./pages/OrdersPage";

const AppRouter = () => {
  const { currentPath } = useRouter();
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isClient = user?.role === 'client';

  const renderPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage />;
      case '/product':
        return <ProductPage />;
      case '/login':
        return isAuthenticated ? <HomePage /> : <LoginPage />;
      case '/register':
        return isAuthenticated ? <HomePage /> : <RegisterPage />;
      case '/profile':
        return isAuthenticated ? <ProfilePage /> : <LoginPage />;
      case '/cart':
        return isClient ? <CartPage /> : <LoginPage />;
      case '/my-orders':
        return isClient ? <MyOrdersPage /> : <LoginPage />;
      case '/admin':
        return isAdmin ? <AdminPage /> : <HomePage />;
      case '/orders':
        return isAdmin ? <OrdersPage /> : <HomePage />;
      default:
        return <HomePage />;
    }
  };

  return <div>{renderPage()}</div>;
};

export default AppRouter;