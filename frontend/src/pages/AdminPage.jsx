import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Loading from '../components/Loading';

const API_BASE = 'http://localhost:3001/api';

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: ''
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('stock', formData.stock);
      data.append('category', formData.category);

      const fileInput = document.getElementById('image');
      if (fileInput?.files[0]) {
        data.append('image', fileInput.files[0]);
      }

      const url = editingProduct 
        ? `${API_BASE}/products/${editingProduct.id}`
        : `${API_BASE}/products`;
      
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });

      if (response.ok) {
        alert(editingProduct ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
        resetForm();
        await loadProducts();
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.error || 'Erro ao salvar produto'}`);
      }
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert('Erro ao salvar produto. Tente novamente.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleEdit = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      stock: product.stock?.toString() || '',
      category: product.category || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm('Tem certeza que deseja deletar este produto?')) return;

    try {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        alert('Produto deletado com sucesso!');
        await loadProducts();
      } else {
        const errorData = await response.json();
        alert(`Erro ao deletar produto: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      alert('Erro ao deletar produto. Tente novamente.');
    }
  };

  const handleNewProduct = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    resetForm();
    setShowForm(true);
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Painel Admin - Produtos</h1>
        <button
          onClick={handleNewProduct}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center font-semibold"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Produto
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6 border">
          <h2 className="text-xl font-bold mb-4">
            {editingProduct ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nome do Produto:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Digite o nome do produto"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Categoria:</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Console">Console</option>
                  <option value="Jogo">Jogo</option>
                  <option value="Acessório">Acessório</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Descrição:</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Descrição detalhada do produto"
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Preço (R$):</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Estoque:</label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="0"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Imagem do Produto:</label>
              <input
                id="image"
                type="file"
                accept="image/*"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">Formatos aceitos: JPG, PNG, GIF</p>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={formSubmitting}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {formSubmitting ? (editingProduct ? 'Atualizando...' : 'Criando...') : (editingProduct ? 'Atualizar Produto' : 'Criar Produto')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 font-semibold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Lista de Produtos ({products.length})</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {products.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>Nenhum produto cadastrado ainda.</p>
              <p className="text-sm">Clique em "Adicionar Produto" para começar.</p>
            </div>
          ) : (
            products.map(product => (
              <div key={product.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    {product.image_url ? (
                      <img 
                        src={`http://localhost:3001${product.image_url}`} 
                        alt={product.name}
                        className="w-full h-full object-cover rounded"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <div className="text-2xl" style={product.image_url ? {display: 'none'} : {}}>🎮</div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-900 truncate">{product.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-green-600 font-bold text-lg">R$ {product.price?.toFixed(2)}</span>
                      <span className="text-sm text-gray-500">Estoque: {product.stock}</span>
                      {product.category && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                          {product.category}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => handleEdit(product, e)}
                      className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-colors"
                      title="Editar produto"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(product.id, e)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                      title="Excluir produto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;