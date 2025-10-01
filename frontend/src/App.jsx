import React from "react";
import { RouterProvider } from "./contexts/RouterContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import Header from "./components/Header";
import AppRouter from "./AppRouter";

const App = () => {
  return (
    <RouterProvider>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-100">
            <Header />
            <main>
              <AppRouter />
            </main>
          </div>
        </CartProvider>
      </AuthProvider>
    </RouterProvider>
  );
};

export default App;