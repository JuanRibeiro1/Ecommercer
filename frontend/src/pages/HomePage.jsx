import React, { useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from '../contexts/RouterContext';
import { API_BASE } from '../config/api';
import Loading from '../components/Loading';
import { Eye, ShoppingCart } from 'lucide-react';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { navigate } = useRouter();

  useEffect(() => {
    fetch(`${API_BASE}/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao carregar produtos:', error);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      alert('Produto fora de estoque!');
      return;
    }
    addToCart(product);
    alert('Produto adicionado ao carrinho!');
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">🎮 Nossos Produtos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              {product.image_url ? (
                <img 
                  src={`http://localhost:3001${product.image_url}`} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-6xl">🎮</div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 truncate">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-green-600">
                  R$ {product.price.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">
                  Estoque: {product.stock}
                </span>
              </div>
              
              {product.category && (
                <div className="mb-3">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    {product.category}
                  </span>
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/product', { id: product.id })}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Ver
                </button>
                
                {user?.role === 'client' && (
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? (
                      'Sem estoque'
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Comprar
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎮</div>
          <p className="text-gray-600 text-lg">Nenhum produto disponível no momento.</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;