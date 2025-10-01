import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const API_BASE = "http://localhost:3001/api";

const ProfilePage = () => {
  const { user, token } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        setSuccess("Perfil atualizado com sucesso!");
      } else {
        const data = await response.json();
        setError(data.error);
      }
    } catch (error) {
      setError("Erro ao atualizar perfil");
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold mb-6">Meu Perfil</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded">{success}</div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Nome:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email:</label>
          <input
            type="email"
            value={user?.email}
            className="w-full p-3 border rounded-lg bg-gray-100"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tipo:</label>
          <input
            type="text"
            value={user?.role === "admin" ? "Administrador" : "Cliente"}
            className="w-full p-3 border rounded-lg bg-gray-100"
            disabled
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Atualizando..." : "Atualizar Perfil"}
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;