import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { useRouter } from './contexts/RouterContext';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminPage from './pages/AdminPage';
import OrdersPage from './pages/OrdersPage';
import Loading from './components/Loading';

const AppRouter = () => {
  const { currentPath } = useRouter();
  const { user, loading } = useAuth();
  if (loading) return <Loading />;

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isClient = user?.role === 'client';

  switch (currentPath) {
    case '/': return <HomePage />;
    case '/product': return <ProductPage />;
    case '/login': return isAuthenticated ? <HomePage /> : <LoginPage />;
    case '/register': return isAuthenticated ? <HomePage /> : <RegisterPage />;
    case '/profile': return isAuthenticated ? <ProfilePage /> : <LoginPage />;
    case '/cart': return isClient ? <CartPage /> : <LoginPage />;
    case '/my-orders': return isClient ? <MyOrdersPage /> : <LoginPage />;
    case '/admin': return isAdmin ? <AdminPage /> : <HomePage />;
    case '/orders': return isAdmin ? <OrdersPage /> : <HomePage />;
    default: return <HomePage />;
  }
};

export default AppRouter;