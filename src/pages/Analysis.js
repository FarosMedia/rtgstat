import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Target,
  Calendar,
  Filter,
  Download,
  Eye,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { tgstatApi } from '../services/tgstatApi';

// Моковые данные для демонстрации
const mockData = {
  channelsGrowth: [
    { date: '2024-01', subscribers: 1200000, posts: 450 },
    { date: '2024-02', subscribers: 1350000, posts: 520 },
    { date: '2024-03', subscribers: 1480000, posts: 480 },
    { date: '2024-04', subscribers: 1620000, posts: 600 },
    { date: '2024-05', subscribers: 1750000, posts: 550 },
    { date: '2024-06', subscribers: 1890000, posts: 680 },
  ],
  engagementData: [
    { channel: '@test_dot', engagement: 4.2, subscribers: 522844, posts: 156 },
    { channel: '@opentests', engagement: 3.8, subscribers: 252456, posts: 89 },
    { channel: '@worldprotest', engagement: 5.1, subscribers: 68921, posts: 234 },
    { channel: '@tech_news', engagement: 3.5, subscribers: 125000, posts: 78 },
    { channel: '@crypto_analytics', engagement: 4.8, subscribers: 89000, posts: 145 },
  ],
  topKeywords: [
    { keyword: 'программирование', mentions: 1250, growth: 15 },
    { keyword: 'технологии', mentions: 980, growth: 8 },
    { keyword: 'IT', mentions: 750, growth: 12 },
    { keyword: 'криптовалюта', mentions: 620, growth: -5 },
    { keyword: 'новости', mentions: 580, growth: 3 },
  ],
  postsPerformance: [
    { date: '2024-06-01', views: 45000, likes: 1200, shares: 180 },
    { date: '2024-06-02', views: 52000, likes: 1400, shares: 220 },
    { date: '2024-06-03', views: 38000, likes: 950, shares: 140 },
    { date: '2024-06-04', views: 61000, likes: 1800, shares: 280 },
    { date: '2024-06-05', views: 48000, likes: 1300, shares: 200 },
    { date: '2024-06-06', views: 55000, likes: 1600, shares: 250 },
  ]
};

export default function Analysis() {
  const { state, actions } = useApp();
  const [selectedProject, setSelectedProject] = useState(null);
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(mockData);

  const dateRanges = [
    { value: '7d', label: '7 дней' },
    { value: '30d', label: '30 дней' },
    { value: '90d', label: '90 дней' },
    { value: '1y', label: '1 год' },
  ];

  useEffect(() => {
    // Загружаем данные при изменении проекта или диапазона дат
    if (selectedProject) {
      loadAnalysisData();
    }
  }, [selectedProject, dateRange]);

  const loadAnalysisData = async () => {
    setLoading(true);
    try {
      // Здесь будет реальная загрузка данных через API
      // Пока используем моковые данные
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData(mockData);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getGrowthColor = (growth) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGrowthIcon = (growth) => {
    if (growth > 0) return <TrendingUp size={14} className="text-green-600" />;
    if (growth < 0) return <TrendingUp size={14} className="text-red-600 transform rotate-180" />;
    return null;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Аналитика</h1>
          <p className="text-gray-600 mt-1">
            Анализ данных каналов и постов
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedProject || ''}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="input-field"
          >
            <option value="">Выберите проект</option>
            {state.projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input-field"
          >
            {dateRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <button className="btn-secondary flex items-center">
            <Download size={16} className="mr-2" />
            Экспорт
          </button>
        </div>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Общий охват</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatNumber(data.channelsGrowth[data.channelsGrowth.length - 1]?.subscribers || 0)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp size={14} className="text-green-600 mr-1" />
                <span className="text-sm text-green-600">+12.5%</span>
                <span className="text-sm text-gray-500 ml-1">с прошлого месяца</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-blue-100">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Активность</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {data.channelsGrowth[data.channelsGrowth.length - 1]?.posts || 0}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp size={14} className="text-green-600 mr-1" />
                <span className="text-sm text-green-600">+8.3%</span>
                <span className="text-sm text-gray-500 ml-1">постов</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-green-100">
              <MessageSquare className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Вовлеченность</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">4.2%</p>
              <div className="flex items-center mt-2">
                <TrendingUp size={14} className="text-green-600 mr-1" />
                <span className="text-sm text-green-600">+0.8%</span>
                <span className="text-sm text-gray-500 ml-1">средняя</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-purple-100">
              <Activity className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Каналы</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {state.projects.find(p => p.id == selectedProject)?.channels?.length || 0}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">в проекте</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-orange-100">
              <Target className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Графики и таблицы */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Рост подписчиков */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Рост подписчиков</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700">
              Подробнее
            </button>
          </div>
          <div className="space-y-3">
            {data.channelsGrowth.slice(-6).map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{item.date}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatNumber(item.subscribers)}
                  </p>
                  <p className="text-xs text-gray-500">{item.posts} постов</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Топ каналов по вовлеченности */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Топ каналов</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700">
              Все каналы
            </button>
          </div>
          <div className="space-y-3">
            {data.engagementData.map((channel, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-xs">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{channel.channel}</p>
                    <p className="text-xs text-gray-500">{formatNumber(channel.subscribers)} подписчиков</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{channel.engagement}%</p>
                  <p className="text-xs text-gray-500">{channel.posts} постов</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Популярные ключевые слова */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Популярные ключевые слова</h3>
          <button className="text-sm text-primary-600 hover:text-primary-700">
            Анализ трендов
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ключевое слово
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Упоминания
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Рост
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тренд
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.topKeywords.map((keyword, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{keyword.keyword}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{keyword.mentions}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center text-sm ${getGrowthColor(keyword.growth)}`}>
                      {getGrowthIcon(keyword.growth)}
                      <span className="ml-1">{keyword.growth > 0 ? '+' : ''}{keyword.growth}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary-600 rounded-full"
                          style={{ width: `${Math.min(100, Math.max(0, keyword.growth + 50))}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Производительность постов */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Производительность постов</h3>
          <div className="flex items-center space-x-2">
            <button className="text-sm text-primary-600 hover:text-primary-700">
              Просмотры
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-700">
              Лайки
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-700">
              Репосты
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {data.postsPerformance.slice(-6).map((post, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{post.date}</span>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">{formatNumber(post.views)}</p>
                  <p className="text-xs text-gray-500">просмотров</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">{formatNumber(post.likes)}</p>
                  <p className="text-xs text-gray-500">лайков</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">{formatNumber(post.shares)}</p>
                  <p className="text-xs text-gray-500">репостов</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Состояние загрузки */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Загрузка данных...</p>
          </div>
        </div>
      )}
    </div>
  );
}