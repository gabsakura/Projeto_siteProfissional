import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Função para verificar autenticação
export const checkAuth = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return { token, user };
};

// Função específica para login
export const login = async (credentials) => {
  try {
    const response = await api.post('/api/auth/login', credentials);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    
    return response.data;
  } catch (error) {
    console.error('API Login Error:', error.response?.data || error.message);
    throw error;
  }
};

// APIs específicas
export const authAPI = {
  login
};

export const kanbanAPI = {
  getColumns: () => api.get('/api/kanban/boards/1/columns'),
  getCards: () => api.get('/api/kanban'),
  createCard: (card) => api.post('/api/kanban', card),
  updateCard: (id, card) => api.put(`/api/kanban/${id}`, card),
  deleteCard: (id) => api.delete(`/api/kanban/${id}`)
};

export const financialAPI = {
  getFinancialData: () => api.get('/api/financial_data'),
  getChartData: async () => {
    const response = await api.get('/api/financial_data');
    return {
      totalCash: response.data.totalCash || [],
      customers: response.data.customers || [],
      profit: response.data.profit || [],
      sales: response.data.sales || [],
      expenses: response.data.expenses || [],
      newCustomers: response.data.newCustomers || []
    };
  }
};

// Configurar interceptor após inicialização
api.interceptors.request.use(
  (config) => {
    const { token } = checkAuth();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api; 