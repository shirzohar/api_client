import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { PopularApis, ApiTemplate } from './PopularApis';
import Dashboard from './Dashboard';
import RequestScreen from './RequestScreen';
import HistoryScreen from './HistoryScreen';
import './styles.css';

const SIDEBAR_WIDTH = 220;

function useRequestHistory() {
  const [history, setHistory] = useState<ApiRequest[]>(() => {
    try {
      const raw = localStorage.getItem('api_client_history');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('api_client_history', JSON.stringify(history));
  }, [history]);

  function addRequest(req: ApiRequest) {
    setHistory(h => [req, ...h].slice(0, 50)); 
  }
  function deleteRequest(id: string) {
    setHistory(h => h.filter(r => r.id !== id));
  }
  return { history, addRequest, deleteRequest };
}

// Utility: try to pretty-print JSON, else return as is
function prettyJson(str: string) {
  try {
    const obj = JSON.parse(str);
    return JSON.stringify(obj, null, 2);
  } catch {
    return str;
  }
}

function Sidebar({ current, setCurrent }: { current: 'request' | 'history' | 'dashboard' | 'popular'; setCurrent: (v: 'request' | 'history' | 'dashboard' | 'popular') => void }) {
  return (
    <aside className="sidebar">
      <div className="logo">api_client</div>
      <nav className="nav">
        <button className={`nav-btn${current === 'request' ? ' active' : ''}`} onClick={() => setCurrent('request')}>
          📡 Send Request
        </button>
        <button className={`nav-btn${current === 'history' ? ' active' : ''}`} onClick={() => setCurrent('history')}>
          🕓 History
        </button>
        <button className={`nav-btn${current === 'dashboard' ? ' active' : ''}`} onClick={() => setCurrent('dashboard')}>
          📊 Dashboard
        </button>
        <button className={`nav-btn${current === 'popular' ? ' active' : ''}`} onClick={() => setCurrent('popular')}>
          🌐 Popular APIs
        </button>
      </nav>
    </aside>
  );
}

function Spinner() {
  return <span className="request-spinner" />;
}

// Add keyframes for spinner (inject into head once)
if (typeof window !== 'undefined' && !document.getElementById('spin-keyframes')) {
  const style = document.createElement('style');
  style.id = 'spin-keyframes';
  style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
}

function App() {
  const [screen, setScreen] = useState<'request' | 'history' | 'dashboard' | 'popular'>('request');
  const { history, addRequest, deleteRequest } = useRequestHistory();
  const [loadReq, setLoadReq] = useState<ApiRequest | null>(null);
  const [apiTemplate, setApiTemplate] = useState<ApiTemplate | null>(null);

  // When selecting a popular API, prefill the request form
  const handleSelectApi = (api: ApiTemplate) => {
    setScreen('request');
    setApiTemplate(api);
    setLoadReq(null);
  };

  return (
    <div className="app">
      <Sidebar current={screen} setCurrent={setScreen} />
      <main className="main">
        <header className="header">
          {screen === 'request' ? 'Send Request' : screen === 'dashboard' ? 'Dashboard' : screen === 'popular' ? 'Popular APIs' : 'Request History'}
        </header>
        <section className="content">
          {screen === 'request' ? (
            <RequestScreen
              key={loadReq?.id || apiTemplate?.name || 'new'}
              onHistoryAdd={addRequest}
              url={loadReq?.url || apiTemplate?.url}
              method={loadReq?.method || apiTemplate?.method}
              body={loadReq?.body || apiTemplate?.body}
            />
          ) : screen === 'dashboard' ? (
            <Dashboard history={history} />
          ) : screen === 'popular' ? (
            <PopularApis onSelect={handleSelectApi} />
          ) : (
            <HistoryScreen
              history={history}
              onDelete={deleteRequest}
              onLoad={req => {
                setScreen('request');
                setLoadReq(req);
                setApiTemplate(null);
              }}
            />
          )}
        </section>
      </main>
    </div>
  );
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />); 