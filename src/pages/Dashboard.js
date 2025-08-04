import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Target, 
  MessageSquare, 
  TrendingUp,
  Plus,
  Eye,
  Activity,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { tgstatApi } from '../services/tgstatApi';

const statsCards = [
  {
    title: 'Всего проектов',
    value: '12',
    change: '+2',
    changeType: 'positive',
    icon: BarChart3,
    color: 'blue'
  },
  {
    title: 'Активных каналов',
    value: '156',
    change: '+12',
    changeType: 'positive',
    icon: Target,
    color: 'green'
  },
  {
    title: 'Проанализировано постов',
    value: '2,847',
    change: '+234',
    changeType: 'positive',
    icon: MessageSquare,
    color: 'purple'
  },
  {
    title: 'Пользователей',
    value: '8',
    change: '+1',
    changeType: 'positive',
    icon: Users,
    color: 'orange'
  }
];

const recentProjects = [
  {
    id: 1,
    name: 'Анализ IT каналов',
    description: 'Исследование популярных IT каналов в Telegram',
    channels: 15,
    posts: 234,
    status: 'active',
    lastUpdate: '2 часа назад'
  },
  {
    id: 2,
    name: 'Мониторинг новостей',
    description: 'Отслеживание новостных каналов',
    channels: 8,
    posts: 156,
    status: 'active',
    lastUpdate: '1 день назад'
  },
  {
    id: 3,
    name: 'Анализ криптовалют',
    description: 'Исследование каналов о криптовалютах',
    channels: 12,
    posts: 89,
    status: 'paused',
    lastUpdate: '3 дня назад'
  }
];

const topChannels = [
  {
    id: 1,
    name: '@test_dot',
    title: 'Тесты и точка.',
    subscribers: '522,844',
    posts: 156,
    engagement: '4.2%'
  },
  {
    id: 2,
    name: '@opentests',
    title: 'Биткоин Трейдинг Криптовалюта Заработок',
    subscribers: '252,456',
    posts: 89,
    engagement: '3.8%'
  },
  {
    id: 3,
    name: '@worldprotest',
    title: 'Протесты в мире',
    subscribers: '68,921',
    posts: 234,
    engagement: '5.1%'
  }
];

export default function Dashboard() {
  const { state, actions } = useApp();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(statsCards);

  useEffect(() => {
    // Устанавливаем текущего пользователя если его нет
    if (!state.currentUser) {
      actions.setCurrentUser(state.users[0]); // Администратор по умолчанию
    }
  }, [state.currentUser, actions, state.users]);

  const handleCreateProject = () => {
    // Логика создания проекта
    console.log('Создание нового проекта');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Активен';
      case 'paused':
        return 'Приостановлен';
      case 'completed':
        return 'Завершен';
      default:
        return 'Неизвестно';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Главная панель</h1>
          <p className="text-gray-600 mt-1">
            Добро пожаловать в TGStat Анализатор
          </p>
        </div>
        <button
          onClick={handleCreateProject}
          className="btn-primary flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Новый проект
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">с прошлого месяца</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`text-${stat.color}-600`} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Основной контент */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Недавние проекты */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Недавние проекты</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700">
              Посмотреть все
            </button>
          </div>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                    <span>{project.channels} каналов</span>
                    <span>{project.posts} постов</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Activity size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Топ каналов */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Топ каналов</h2>
            <button className="text-sm text-primary-600 hover:text-primary-700">
              Посмотреть все
            </button>
          </div>
          <div className="space-y-4">
            {topChannels.map((channel) => (
              <div key={channel.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{channel.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{channel.title}</p>
                  <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                    <span>{channel.subscribers} подписчиков</span>
                    <span>{channel.posts} постов</span>
                    <span className="text-green-600 font-medium">{channel.engagement} вовлеченность</span>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <TrendingUp size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Быстрые действия</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Search className="text-primary-600 mr-3" size={20} />
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Поиск каналов</h3>
              <p className="text-sm text-gray-600">Найти каналы по ключевым словам</p>
            </div>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <BarChart3 className="text-primary-600 mr-3" size={20} />
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Анализ данных</h3>
              <p className="text-sm text-gray-600">Создать аналитический отчет</p>
            </div>
          </button>
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Users className="text-primary-600 mr-3" size={20} />
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Управление доступом</h3>
              <p className="text-sm text-gray-600">Настроить права пользователей</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}