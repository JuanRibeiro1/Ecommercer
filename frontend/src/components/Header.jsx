import React from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useCart } from '../contexts/CartContext';
import { useRouter } from '../contexts/RouterContext';
import Link from './Link';
import { ShoppingCart, User, LogOut } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { navigate } = useRouter();

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white hover:text-blue-200">
            🎮 GameStore
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-blue-200 text-white">Produtos</Link>
            {user?.role === 'admin' && (
              <>
                <Link to="/admin" className="hover:text-blue-200 text-white">Admin</Link>
                <Link to="/orders" className="hover:text-blue-200 text-white">Pedidos</Link>
              </>
            )}
            {user?.role === 'client' && (
              <Link to="/my-orders" className="hover:text-blue-200 text-white">Meus Pedidos</Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/profile" className="flex items-center hover:text-blue-200 text-white">
                  <User className="w-5 h-5 mr-1" />
                  {user.name}
                </Link>
                {user.role === 'client' && (
                  <Link to="/cart" className="flex items-center hover:text-blue-200 relative text-white">
                    <ShoppingCart className="w-5 h-5" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                )}
                <button onClick={logout} className="flex items-center hover:text-blue-200">
                  <LogOut className="w-5 h-5 mr-1" />
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 text-white">Login</Link>
                <Link to="/register" className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded text-white">
                  Cadastro
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;