// frontend/src/services/api.ts
const API_URL = "http://localhost:8080/api"; // adapte si besoin

const getToken = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const api = {
  // === AUTH ===
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  register: async (email: string, password: string, name: string) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    return res.json();
  },

  // === TRANSACTIONS ===
  getTransactions: async () => {
    const res = await fetch(`${API_URL}/transactions`, { headers: headers() });
    return res.json();
  },
    // === BUDGET ===
  // Removed duplicate getBudget function

  getBalance: async () => {
    const res = await fetch(`${API_URL}/transactions/balance`, {
      headers: headers(),
    });
    return res.json();
  },

  createTransaction: async (data: any) => {
    const res = await fetch(`${API_URL}/transactions`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateTransaction: async (id: number, data: any) => {
    const res = await fetch(`${API_URL}/transactions/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteTransaction: async (id: number) => {
    const res = await fetch(`${API_URL}/transactions/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    return res.json();
  },

  // === ACCOUNTS ===
  getAccounts: async () => {
    const res = await fetch(`${API_URL}/accounts`, { headers: headers() });
    return res.json();
  },

  createAccount: async (data: any) => {
    const res = await fetch(`${API_URL}/accounts`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // === CATEGORIES ===
  // (removed duplicate getCategories and createCategory)

  // === SAVINGS ===
  getSavings: async () => {
    const res = await fetch(`${API_URL}/savings`, { headers: headers() });
    return res.json();
  },

  createSaving: async (data: any) => {
    const res = await fetch(`${API_URL}/savings`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },
  // === CATEGORIES ===
  getCategories: async (): Promise<{ categories: any[] }> => {
    const res = await fetch(`${API_URL}/categories`, { headers: headers() });
    return res.json();
  },

  createCategory: async (data: any): Promise<any> => {
    console.log("🚀 Données envoyées à l'API createCategory:", data);
    const res = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // === BUDGET ===
  getBudget: async (month: string): Promise<any> => {
    const res = await fetch(`${API_URL}/budget?month=${month}`, { headers: headers() });
    return res.json();
  },

  createBudget: async (data: any): Promise<any> => {
    const res = await fetch(`${API_URL}/budget`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  updateBudget: async (id: number, data: any): Promise<any> => {
    const res = await fetch(`${API_URL}/budget/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteBudget: async (id: number): Promise<any> => {
    const res = await fetch(`${API_URL}/budget/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    return res.json();
  },
};






export default api;
