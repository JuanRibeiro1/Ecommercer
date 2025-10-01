import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "../hooks/useRouter";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/Loading";

const API_BASE = "http://localhost:3001/api";

const ProductPage = () => {
  const { params, navigate } = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    if (params.id) {
      fetch(`${API_BASE}/products/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [params.id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`${quantity} ${product.name}(s) adicionado(s) ao carrinho!`);
  };

  if (loading) return <Loading />;
  if (!product) return <div className="text-center py-8">Produto não encontrado</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/")}
        className="mb-6 text-blue-600 hover:text-blue-800"
      >
        ← Voltar aos produtos
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-200 aspect-square flex items-center justify-center rounded-lg">
          {product.image_url ? (
            <img
              src={`http://localhost:3001${product.image_url}`}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="text-9xl">🎮</div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="mb-6">
            <span className="text-3xl font-bold text-green-600">
              R$ {product.price.toFixed(2)}
            </span>
          </div>

          <div className="mb-6">
            <span className="text-lg">
              Estoque disponível: {product.stock} unidades
            </span>
          </div>

          {user?.role === "client" && product.stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Quantidade:
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(parseInt(e.target.value) || 1)
                  }
                  className="w-20 p-2 border rounded"
                />
                <button
                  onClick={handleAddToCart}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          )}

          {product.stock === 0 && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
              Produto fora de estoque
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;