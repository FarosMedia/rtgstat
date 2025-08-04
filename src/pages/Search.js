import React, { useState } from 'react';
import { Search, Filter, Target, MessageSquare, Users, Eye, ExternalLink } from 'lucide-react';
import { tgstatApi } from '../services/tgstatApi';
import { useApp } from '../context/AppContext';

export default function Search() {
  const { state, actions } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('channels'); // 'channels' или 'posts'
  const [country, setCountry] = useState('ru');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const countries = [
    { code: 'ru', name: 'Россия' },
    { code: 'us', name: 'США' },
    { code: 'ua', name: 'Украина' },
    { code: 'by', name: 'Беларусь' },
    { code: 'kz', name: 'Казахстан' },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Введите поисковый запрос');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let data;
      if (searchType === 'channels') {
        data = await tgstatApi.searchChannels(searchQuery, country, 20);
      } else {
        data = await tgstatApi.searchPosts(searchQuery, country, 20);
      }

      if (data.status === 'ok') {
        setResults(data.response.items || []);
      } else {
        setError('Ошибка при выполнении поиска');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
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

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString('ru-RU');
  };

  const renderChannelCard = (channel) => (
    <div key={channel.id} className="card hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <img
            src={`https:${channel.image100}`}
            alt={channel.title}
            className="w-16 h-16 rounded-lg object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/64x64?text=TG';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {channel.title}
            </h3>
            <div className="flex items-center space-x-2">
              <button className="p-1 text-gray-400 hover:text-gray-600">
                <Eye size={16} />
              </button>
              <a
                href={`https://t.me/${channel.username?.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">{channel.username}</p>
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {channel.about}
          </p>
          <div className="flex items-center mt-3 space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Users size={14} className="mr-1" />
              {formatNumber(channel.participants_count)} подписчиков
            </span>
            <span className="flex items-center">
              <Target size={14} className="mr-1" />
              CI: {channel.ci_index?.toFixed(2) || 'N/A'}
            </span>
            <span className="text-green-600 font-medium">
              {channel.peer_type === 'channel' ? 'Канал' : 'Группа'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPostCard = (post) => (
    <div key={post.id} className="card hover:shadow-md transition-shadow">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Канал ID: {post.channel_id}</span>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-500">{formatDate(post.date)}</span>
          </div>
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <ExternalLink size={16} />
          </a>
        </div>
        
        <div className="prose prose-sm max-w-none">
          <div 
            className="text-gray-900"
            dangerouslySetInnerHTML={{ __html: post.snippet }}
          />
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center">
            <Eye size={14} className="mr-1" />
            {formatNumber(post.views)} просмотров
          </span>
          <span className="flex items-center">
            <MessageSquare size={14} className="mr-1" />
            {post.comments_count} комментариев
          </span>
          <span className="flex items-center">
            <Target size={14} className="mr-1" />
            {post.reactions_count} реакций
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Поиск</h1>
        <p className="text-gray-600 mt-1">
          Найдите каналы и посты в Telegram по ключевым словам
        </p>
      </div>

      {/* Форма поиска */}
      <div className="card">
        <div className="space-y-4">
          {/* Тип поиска */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Тип поиска:</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setSearchType('channels')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  searchType === 'channels'
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Target size={16} className="inline mr-2" />
                Каналы
              </button>
              <button
                onClick={() => setSearchType('posts')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  searchType === 'posts'
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <MessageSquare size={16} className="inline mr-2" />
                Посты
              </button>
            </div>
          </div>

          {/* Поисковый запрос */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Поисковый запрос
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Поиск ${searchType === 'channels' ? 'каналов' : 'постов'}...`}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Фильтры */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Страна
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="input-field"
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Кнопка поиска */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="btn-primary flex items-center"
            >
              <Search size={16} className="mr-2" />
              {loading ? 'Поиск...' : 'Найти'}
            </button>
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
          </div>
        </div>
      </div>

      {/* Результаты поиска */}
      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Результаты поиска ({results.length})
            </h2>
            <p className="text-sm text-gray-500">
              Найдено {results.length} {searchType === 'channels' ? 'каналов' : 'постов'}
            </p>
          </div>
          
          <div className="space-y-4">
            {searchType === 'channels' 
              ? results.map(renderChannelCard)
              : results.map(renderPostCard)
            }
          </div>
        </div>
      )}

      {/* Состояние загрузки */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Выполняется поиск...</p>
        </div>
      )}

      {/* Пустое состояние */}
      {!loading && results.length === 0 && searchQuery && (
        <div className="text-center py-8">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Ничего не найдено</h3>
          <p className="mt-1 text-sm text-gray-500">
            Попробуйте изменить поисковый запрос или фильтры
          </p>
        </div>
      )}
    </div>
  );
}