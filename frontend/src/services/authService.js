import { API_BASE } from "../api/config";

export async function verifyToken(token) {
  try {
    const response = await fetch(`${API_BASE}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  } catch {
    return null;
  }
}

export async function loginRequest(email, password) {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true, user: data.user, token: data.token };
    }
    return { success: false, error: data.error };
  } catch {
    return { success: false, error: "Erro de conexão" };
  }
}

export async function registerRequest(name, email, password) {
  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      return { success: true, user: data.user, token: data.token };
    }
    return { success: false, error: data.error };
  } catch {
    return { success: false, error: "Erro de conexão" };
  }
}