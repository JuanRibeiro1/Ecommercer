import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/Loading';

const API_BASE = 'http://localhost:3001/api/orders';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetch(`${API_BASE}/orders`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Meus Pedidos</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Você ainda não fez nenhum pedido</p>
          <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Fazer Compras
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Pedido #{order.id}</h3>
                  <p className="text-gray-600">
                    {new Date(order.created_at).toLocaleDateString('pt-BR')}
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
              
              {order.items && (
                <div className="space-y-2">
                  <h4 className="font-medium">Itens:</h4>
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span>{item.product_name} x {item.quantity}</span>
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

export default MyOrdersPage;