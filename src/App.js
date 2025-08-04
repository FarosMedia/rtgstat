import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Projects from './pages/Projects';

import Analysis from './pages/Analysis';

const Channels = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900">Каналы</h1>
    <p className="text-gray-600 mt-1">Страница мониторинга каналов в разработке</p>
  </div>
);

const Posts = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900">Посты</h1>
    <p className="text-gray-600 mt-1">Страница анализа постов в разработке</p>
  </div>
);

const Trends = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900">Тренды</h1>
    <p className="text-gray-600 mt-1">Страница анализа трендов в разработке</p>
  </div>
);

import Users from './pages/Users';

const Settings = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900">Настройки</h1>
    <p className="text-gray-600 mt-1">Страница настроек в разработке</p>
  </div>
);

function AppContent() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/search" element={<Search />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/channels" element={<Channels />} />
              <Route path="/posts" element={<Posts />} />
              <Route path="/trends" element={<Trends />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;