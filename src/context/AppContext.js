import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  // Пользователи и права доступа
  users: [
    {
      id: 1,
      name: 'Администратор',
      email: 'admin@example.com',
      role: 'admin',
      permissions: ['all'],
    },
    {
      id: 2,
      name: 'Аналитик',
      email: 'analyst@example.com',
      role: 'analyst',
      permissions: ['read', 'analyze'],
    },
    {
      id: 3,
      name: 'Менеджер',
      email: 'manager@example.com',
      role: 'manager',
      permissions: ['read', 'create_projects'],
    },
  ],
  currentUser: null,
  
  // Проекты
  projects: [
    {
      id: 1,
      name: 'Анализ IT каналов',
      description: 'Исследование популярных IT каналов в Telegram',
      createdBy: 1,
      createdAt: new Date('2024-01-01'),
      members: [1, 2, 3],
      channels: ['@test_dot', '@opentests'],
      keywords: ['программирование', 'технологии', 'IT'],
      status: 'active',
    },
    {
      id: 2,
      name: 'Мониторинг новостей',
      description: 'Отслеживание новостных каналов',
      createdBy: 1,
      createdAt: new Date('2024-01-15'),
      members: [1, 2],
      channels: ['@worldprotest'],
      keywords: ['новости', 'политика', 'экономика'],
      status: 'active',
    },
  ],
  
  // Настройки интерфейса
  ui: {
    sidebarCollapsed: false,
    theme: 'light',
    language: 'ru',
  },
  
  // Данные анализа
  analysisData: {
    channels: [],
    posts: [],
    statistics: {},
  },
  
  // Состояние загрузки
  loading: false,
  error: null,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return {
        ...state,
        currentUser: action.payload,
      };
      
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarCollapsed: !state.ui.sidebarCollapsed,
        },
      };
      
    case 'CREATE_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };
      
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? action.payload : project
        ),
      };
      
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
      };
      
    case 'ADD_USER':
      return {
        ...state,
        users: [...state.users, action.payload],
      };
      
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        ),
      };
      
    case 'SET_ANALYSIS_DATA':
      return {
        ...state,
        analysisData: action.payload,
      };
      
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
      
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
      
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Загрузка данных из localStorage при инициализации
  useEffect(() => {
    const savedState = localStorage.getItem('tgstat-analyzer-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Восстанавливаем только определенные части состояния
        if (parsedState.ui) {
          dispatch({ type: 'SET_UI', payload: parsedState.ui });
        }
        if (parsedState.currentUser) {
          dispatch({ type: 'SET_CURRENT_USER', payload: parsedState.currentUser });
        }
      } catch (error) {
        console.error('Ошибка загрузки состояния:', error);
      }
    }
  }, []);

  // Сохранение состояния в localStorage при изменениях
  useEffect(() => {
    const stateToSave = {
      ui: state.ui,
      currentUser: state.currentUser,
    };
    localStorage.setItem('tgstat-analyzer-state', JSON.stringify(stateToSave));
  }, [state.ui, state.currentUser]);

  const value = {
    state,
    dispatch,
    actions: {
      setCurrentUser: (user) => dispatch({ type: 'SET_CURRENT_USER', payload: user }),
      toggleSidebar: () => dispatch({ type: 'TOGGLE_SIDEBAR' }),
      createProject: (project) => dispatch({ type: 'CREATE_PROJECT', payload: project }),
      updateProject: (project) => dispatch({ type: 'UPDATE_PROJECT', payload: project }),
      deleteProject: (projectId) => dispatch({ type: 'DELETE_PROJECT', payload: projectId }),
      addUser: (user) => dispatch({ type: 'ADD_USER', payload: user }),
      updateUser: (user) => dispatch({ type: 'UPDATE_USER', payload: user }),
      setAnalysisData: (data) => dispatch({ type: 'SET_ANALYSIS_DATA', payload: data }),
      setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
      setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
      clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
    },
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp должен использоваться внутри AppProvider');
  }
  return context;
}