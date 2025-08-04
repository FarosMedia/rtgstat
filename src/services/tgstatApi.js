import axios from 'axios';

const API_BASE_URL = 'https://api.tgstat.ru';
const API_TOKEN = 'a1c2cd559240a5d330d2b4184a16b86f';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Перехватчик для добавления токена к каждому запросу
api.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    token: API_TOKEN,
  };
  return config;
});

// Перехватчик для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const tgstatApi = {
  // Поиск каналов
  searchChannels: async (query, country = 'ru', limit = 20) => {
    try {
      const response = await api.get('/channels/search', {
        params: {
          q: query,
          country,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка поиска каналов: ${error.message}`);
    }
  },

  // Получение информации о канале
  getChannelInfo: async (channelId) => {
    try {
      const response = await api.get('/channels/info', {
        params: {
          channelId,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка получения информации о канале: ${error.message}`);
    }
  },

  // Получение постов канала
  getChannelPosts: async (channelId, limit = 20) => {
    try {
      const response = await api.get('/channels/posts', {
        params: {
          channelId,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка получения постов канала: ${error.message}`);
    }
  },

  // Поиск постов
  searchPosts: async (query, country = 'ru', limit = 20) => {
    try {
      const response = await api.get('/posts/search', {
        params: {
          q: query,
          country,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка поиска постов: ${error.message}`);
    }
  },

  // Получение статистики канала
  getChannelStats: async (channelId) => {
    try {
      const response = await api.get('/channels/stat', {
        params: {
          channelId,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка получения статистики канала: ${error.message}`);
    }
  },

  // Получение топ каналов
  getTopChannels: async (country = 'ru', category = null, limit = 20) => {
    try {
      const params = {
        country,
        limit,
      };
      if (category) {
        params.category = category;
      }
      
      const response = await api.get('/channels/top', { params });
      return response.data;
    } catch (error) {
      throw new Error(`Ошибка получения топ каналов: ${error.message}`);
    }
  },
};

export default tgstatApi;