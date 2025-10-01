import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "../hooks/useRouter";
import { createOrder } from "../config/api";


const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
  const { navigate } = useRouter();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    try {
      // chamada ao backend para criar pedido
      const items = cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const data = await createOrder(token, items, getTotal());


      // limpar carrinho local (frontend)
      clearCart();

      alert(`Pedido realizado com sucesso! #${data.orderId}`);
      navigate("/my-orders");
    } catch (error) {
      alert("Erro ao realizar pedido: " + error.message);
    }
    setLoading(false);
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-6">Carrinho de Compras</h1>
        <p className="text-gray-600 mb-6">Seu carrinho está vazio</p>
        <Link
          to="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Continuar Comprando
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Carrinho de Compras</h1>

      <div className="space-y-4 mb-6">
        {cart.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-lg shadow flex items-center gap-4"
          >
            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
              {item.image_url ? (
                <img
                  src={`http://localhost:3001${item.image_url}`}
                  alt={item.name}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div className="text-2xl">🎮</div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-gray-600">R$ {item.price.toFixed(2)} cada</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-12 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
              >
                +
              </button>
            </div>

            <div className="text-right">
              <p className="font-semibold">
                R$ {(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-bold">Total:</span>
          <span className="text-2xl font-bold text-green-600">
            R$ {getTotal().toFixed(2)}
          </span>
        </div>

        <div className="flex gap-4">
          <Link
            to="/"
            className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 text-center"
          >
            Continuar Comprando
          </Link>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Processando..." : "Finalizar Compra"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;