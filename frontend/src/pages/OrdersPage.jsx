import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/Loading";

const API_BASE = "http://localhost:3001/api";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        // garante que orders é sempre array
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao buscar pedidos:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Todos os Pedidos</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">Nenhum pedido encontrado</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Pedido #{order.id}</h3>
                  <p className="text-gray-600">
                    Cliente: {order.user_name || "Não informado"}
                  </p>
                  <p className="text-gray-600">
                    Email: {order.user_email || "Não informado"}
                  </p>
                  <p className="text-gray-600">
                    Data: {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    R$ {order.total.toFixed(2)}
                  </p>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                    {order.status}
                  </span>
                </div>
              </div>

              {order.OrderItems && order.OrderItems.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Itens:</h4>
                  {order.OrderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center text-sm"
                    >
                      <span>
                        {item.Product?.name || "Produto"} x {item.quantity}
                      </span>
                      <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;