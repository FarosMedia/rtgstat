import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Activity,
  Users,
  Calendar,
  Target,
  MessageSquare,
  MoreVertical
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Projects() {
  const { state, actions } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const statusOptions = [
    { value: 'all', label: 'Все проекты' },
    { value: 'active', label: 'Активные' },
    { value: 'paused', label: 'Приостановленные' },
    { value: 'completed', label: 'Завершенные' },
  ];

  const filteredProjects = state.projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ru-RU');
  };

  const handleCreateProject = () => {
    setShowCreateModal(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setShowCreateModal(true);
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот проект?')) {
      actions.deleteProject(projectId);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Проекты</h1>
          <p className="text-gray-600 mt-1">
            Управление проектами анализа Telegram каналов
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

      {/* Фильтры и поиск */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Поиск */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск проектов..."
              className="input-field pl-10"
            />
          </div>

          {/* Фильтр по статусу */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Сортировка */}
          <div>
            <select className="input-field">
              <option value="created">По дате создания</option>
              <option value="updated">По дате обновления</option>
              <option value="name">По названию</option>
              <option value="status">По статусу</option>
            </select>
          </div>
        </div>
      </div>

      {/* Список проектов */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="card hover:shadow-md transition-shadow">
            {/* Заголовок карточки */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {project.name}
                </h3>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
              </div>
              <div className="relative">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            {/* Описание */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {project.description}
            </p>

            {/* Статистика */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <Target size={14} className="mr-2" />
                <span>{project.channels?.length || 0} каналов</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MessageSquare size={14} className="mr-2" />
                <span>{project.posts || 0} постов</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Users size={14} className="mr-2" />
                <span>{project.members?.length || 0} участников</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar size={14} className="mr-2" />
                <span>{formatDate(project.createdAt)}</span>
              </div>
            </div>

            {/* Ключевые слова */}
            {project.keywords && project.keywords.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {project.keywords.slice(0, 3).map((keyword, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                  {project.keywords.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{project.keywords.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Действия */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEditProject(project)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title="Редактировать"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="p-2 text-gray-400 hover:text-red-600"
                  title="Удалить"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600" title="Просмотр">
                  <Eye size={16} />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600" title="Аналитика">
                  <Activity size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Пустое состояние */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Target className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery || filterStatus !== 'all' ? 'Проекты не найдены' : 'Нет проектов'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || filterStatus !== 'all' 
              ? 'Попробуйте изменить параметры поиска или фильтры'
              : 'Создайте первый проект для начала работы'
            }
          </p>
          <button
            onClick={handleCreateProject}
            className="btn-primary flex items-center mx-auto"
          >
            <Plus size={16} className="mr-2" />
            Создать проект
          </button>
        </div>
      )}

      {/* Модальное окно создания/редактирования проекта */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {selectedProject ? 'Редактировать проект' : 'Новый проект'}
            </h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название проекта
                </label>
                <input
                  type="text"
                  defaultValue={selectedProject?.name || ''}
                  className="input-field"
                  placeholder="Введите название проекта"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <textarea
                  defaultValue={selectedProject?.description || ''}
                  className="input-field"
                  rows={3}
                  placeholder="Опишите проект"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Статус
                </label>
                <select className="input-field">
                  <option value="active">Активен</option>
                  <option value="paused">Приостановлен</option>
                  <option value="completed">Завершен</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ключевые слова (через запятую)
                </label>
                <input
                  type="text"
                  defaultValue={selectedProject?.keywords?.join(', ') || ''}
                  className="input-field"
                  placeholder="программирование, технологии, IT"
                />
              </div>
            </form>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedProject(null);
                }}
                className="btn-secondary"
              >
                Отмена
              </button>
              <button className="btn-primary">
                {selectedProject ? 'Сохранить' : 'Создать'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}