import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  BarChart3, 
  Users, 
  Settings, 
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Plus,
  Target,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const menuItems = [
  {
    path: '/',
    icon: Home,
    label: 'Главная',
    description: 'Обзор проектов'
  },
  {
    path: '/search',
    icon: Search,
    label: 'Поиск',
    description: 'Поиск каналов и постов'
  },
  {
    path: '/projects',
    icon: FolderOpen,
    label: 'Проекты',
    description: 'Управление проектами'
  },
  {
    path: '/analysis',
    icon: BarChart3,
    label: 'Аналитика',
    description: 'Анализ данных'
  },
  {
    path: '/channels',
    icon: Target,
    label: 'Каналы',
    description: 'Мониторинг каналов'
  },
  {
    path: '/posts',
    icon: MessageSquare,
    label: 'Посты',
    description: 'Анализ постов'
  },
  {
    path: '/trends',
    icon: TrendingUp,
    label: 'Тренды',
    description: 'Анализ трендов'
  },
  {
    path: '/users',
    icon: Users,
    label: 'Пользователи',
    description: 'Управление доступом'
  },
  {
    path: '/settings',
    icon: Settings,
    label: 'Настройки',
    description: 'Настройки системы'
  }
];

export default function Sidebar() {
  const { state, actions } = useApp();
  const location = useLocation();
  const { sidebarCollapsed } = state.ui;

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      sidebarCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Заголовок */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!sidebarCollapsed && (
          <h1 className="text-lg font-semibold text-gray-800">TGStat Анализатор</h1>
        )}
        <button
          onClick={actions.toggleSidebar}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Навигация */}
      <nav className="p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  title={sidebarCollapsed ? item.description : ''}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="ml-3">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Быстрые действия */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Быстрые действия</h3>
          <div className="space-y-2">
            <button className="w-full btn-primary text-sm flex items-center justify-center">
              <Plus size={16} className="mr-2" />
              Новый проект
            </button>
            <button className="w-full btn-secondary text-sm flex items-center justify-center">
              <Search size={16} className="mr-2" />
              Быстрый поиск
            </button>
          </div>
        </div>
      )}

      {/* Информация о пользователе */}
      {state.currentUser && !sidebarCollapsed && (
        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-600 font-medium text-sm">
                {state.currentUser.name.charAt(0)}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800">
                {state.currentUser.name}
              </p>
              <p className="text-xs text-gray-500">
                {state.currentUser.role}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}