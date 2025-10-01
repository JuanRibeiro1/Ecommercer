// API Base URL
export const API_BASE = "http://localhost:3001/api";

// helper
async function request(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro na API");
  return data;
}


export async function registerUser(name, email, password, role = "client") {
  return request(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role })
  });
}

export async function login(email, password) {
  return request(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
}


export async function getProducts() {
  return request(`${API_BASE}/products`);
}

export async function getProductById(id) {
  return request(`${API_BASE}/products/${id}`);
}

export async function createProduct(token, formData) {
  return request(`${API_BASE}/products`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
}

export async function updateProduct(token, id, formData) {
  return request(`${API_BASE}/products/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
}

export async function deleteProduct(token, id) {
  return request(`${API_BASE}/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function addToCart(token, productId, quantity = 1) {
  return request(`${API_BASE}/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ productId, quantity })
  });
}

export async function getCart(token) {
  return request(`${API_BASE}/cart`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function removeCartItem(token, id) {
  return request(`${API_BASE}/cart/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function createOrder(token, items, total) {
  return request(`${API_BASE}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ items, total })
  });
}

export async function getMyOrders(token) {
  return request(`${API_BASE}/orders/my`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function getAllOrders(token) {
  return request(`${API_BASE}/orders`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}