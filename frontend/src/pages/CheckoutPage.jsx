import React, { useState } from "react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "../hooks/useRouter";
import { createOrder } from "../config/api";

export default function CheckoutPage() {
  const { cart, clearCart, total } = useCart();
  const { user, token } = useAuth();
  const { navigate } = useRouter();
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <p className="text-center mt-6">
        Você precisa fazer login para finalizar a compra.
      </p>
    );
  }

  if (cart.length === 0) {
    return (
      <p className="text-center mt-6">
        Seu carrinho está vazio. <br />
        <button
          onClick={() => navigate("/")}
          className="text-blue-600 underline"
        >
          Voltar para a loja
        </button>
      </p>
    );
  }

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const items = cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));

      const data = await createOrder(token, items, total);

      clearCart();
      alert(`Pedido realizado com sucesso! #${data.orderId}`);
      navigate("/my-orders");
    } catch (error) {
      alert("Não foi possível finalizar a compra. Tente novamente.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Finalizar Compra</h2>
      <ul className="space-y-4">
        {cart.map((item) => (
          <li key={item.id} className="flex justify-between border-b pb-2">
            <span>
              {item.name} (x{item.quantity})
            </span>
            <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-between text-lg font-bold">
        <span>Total:</span>
        <span>R$ {total.toFixed(2)}</span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Processando..." : "Confirmar Pedido"}
      </button>
    </div>
  );
}