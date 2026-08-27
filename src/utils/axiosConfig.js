// src/utils/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add token to requests if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses and errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Return only the data for cleaner API calls
    return response;
  },
  (error) => {
    // Handle different error types
    if (error.code === 'ECONNABORTED') {
      // Timeout error
      return Promise.reject({
        success: false,
        message: 'La richiesta ha impiegato troppo tempo. Per favore riprova.',
      });
    }

    if (!error.response) {
      // Network error (no response from server)
      return Promise.reject({
        success: false,
        message: 'Impossibile connettersi al server. Per favore controlla la tua connessione internet.',
      });
    }

    const { status, data } = error.response;

    // Handle specific status codes
    switch (status) {
      case 400:
        // Bad request - validation errors
        return Promise.reject({
          success: false,
          message: data.message || 'Dati non validi. Per favore controlla i campi.',
          errors: data.errors || [],
        });

      case 401:
        // Unauthorized - token expired or invalid
        localStorage.removeItem('token');
        // Only redirect if not already on signin page
        if (!window.location.pathname.includes('/signin')) {
          window.location.href = '/signin';
        }
        return Promise.reject({
          success: false,
          message: 'Sessione scaduta. Per favore effettua nuovamente il login.',
        });

      case 403:
        // Forbidden
        return Promise.reject({
          success: false,
          message: data.message || 'Non hai i permessi per eseguire questa operazione.',
        });

      case 404:
        // Not found
        return Promise.reject({
          success: false,
          message: data.message || 'Risorsa non trovata.',
        });

      case 429:
        // Too many requests (rate limiting)
        return Promise.reject({
          success: false,
          message: data.message || 'Troppe richieste. Per favore attendi qualche minuto.',
        });

      case 500:
        // Internal server error
        return Promise.reject({
          success: false,
          message: 'Si è verificato un errore interno. Per favore riprova più tardi.',
        });

      default:
        // Generic error
        return Promise.reject({
          success: false,
          message: data.message || 'Si è verificato un errore. Per favore riprova.',
        });
    }
  }
);

export default axiosInstance;