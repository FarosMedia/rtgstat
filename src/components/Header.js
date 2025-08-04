import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  User, 
  LogOut, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { state, actions } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Новый проект создан',
      message: 'Проект "Анализ IT каналов" успешно создан',
      time: '2 минуты назад',
      read: false,
    },
    {
      id: 2,
      title: 'Обновление данных',
      message: 'Данные по каналу @test_dot обновлены',
      time: '1 час назад',
      read: true,
    },
  ];

  const handleLogout = () => {
    actions.setCurrentUser(null);
    setShowProfileMenu(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Левая часть */}
        <div className="flex items-center space-x-4">
          <button
            onClick={actions.toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} />
          </button>
          
          {/* Поиск */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Поиск проектов, каналов..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-80"
            />
          </div>
        </div>

        {/* Правая часть */}
        <div className="flex items-center space-x-4">
          {/* Уведомления */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            >
              <Bell size={20} />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            {/* Выпадающее меню уведомлений */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold">Уведомления</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full ml-2"></div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      Нет новых уведомлений
                    </div>
                  )}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <button className="text-sm text-primary-600 hover:text-primary-700">
                    Посмотреть все уведомления
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Профиль пользователя */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-medium text-sm">
                  {state.currentUser?.name?.charAt(0) || 'U'}
                </span>
              </div>
              {state.currentUser && (
                <span className="text-sm font-medium text-gray-700">
                  {state.currentUser.name}
                </span>
              )}
            </button>

            {/* Выпадающее меню профиля */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {state.currentUser?.name || 'Пользователь'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {state.currentUser?.email || 'user@example.com'}
                  </p>
                </div>
                <div className="py-2">
                  <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User size={16} className="mr-3" />
                    Профиль
                  </button>
                  <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings size={16} className="mr-3" />
                    Настройки
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} className="mr-3" />
                    Выйти
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Закрытие выпадающих меню при клике вне их */}
      {(showProfileMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowProfileMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
}