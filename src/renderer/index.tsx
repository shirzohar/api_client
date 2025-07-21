import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { PopularApis, ApiTemplate } from './PopularApis';
import Dashboard from './Dashboard';
import RequestScreen from './RequestScreen';
import HistoryScreen from './HistoryScreen';

const SIDEBAR_WIDTH = 220;

const styles: { [key: string]: React.CSSProperties } = {
  app: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Inter, Arial, sans-serif',
    background: 'linear-gradient(120deg, #232526 0%, #414345 100%)',
    color: '#fff',
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    background: 'rgba(30,32,34,0.98)',
    boxShadow: '2px 0 12px 0 rgba(0,0,0,0.12)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px 0',
    gap: 32,
  },
  logo: {
    fontWeight: 800,
    fontSize: 28,
    letterSpacing: 1,
    marginBottom: 40,
    color: '#00e0ff',
    textShadow: '0 2px 8px #00e0ff44',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
    width: '100%',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  header: {
    height: 64,
    display: 'flex',
    alignItems: 'center',
    padding: '0 32px',
    borderBottom: '1px solid #333',
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: 1,
    background: 'rgba(30,32,34,0.92)',
    boxShadow: '0 2px 8px #0002',
  },
  content: {
    flex: 1,
    padding: '40px 32px',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
};

const navBtnStyle = (active: boolean): React.CSSProperties => ({
  background: active ? 'linear-gradient(90deg, #00e0ff 0%, #3a7bd5 100%)' : 'transparent',
  color: active ? '#232526' : '#fff',
  border: 'none',
  borderRadius: 8,
  padding: '12px 24px',
  fontWeight: 600,
  fontSize: 18,
  cursor: 'pointer',
  transition: 'background 0.2s, color 0.2s',
  textAlign: 'left',
  width: '90%',
  margin: '0 auto',
  boxShadow: active ? '0 2px 12px #00e0ff33' : undefined,
});

// Types for request and history
interface ApiRequest {
  id: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: string;
  date: string;
  status?: number;
}

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
    <aside style={styles.sidebar}>
      <div style={styles.logo}>api_client</div>
      <nav style={styles.nav}>
        <button style={navBtnStyle(current === 'request')} onClick={() => setCurrent('request')}>
          📡 Send Request
        </button>
        <button style={navBtnStyle(current === 'history')} onClick={() => setCurrent('history')}>
          🕓 History
        </button>
        <button style={navBtnStyle(current === 'dashboard')} onClick={() => setCurrent('dashboard')}>
          📊 Dashboard
        </button>
        <button style={navBtnStyle(current === 'popular')} onClick={() => setCurrent('popular')}>
          🌐 Popular APIs
        </button>
      </nav>
    </aside>
  );
}

// Spinner component
function Spinner() {
  return (
    <span style={{
      display: 'inline-block',
      width: 18,
      height: 18,
      border: '3px solid #00e0ff',
      borderTop: '3px solid transparent',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      verticalAlign: 'middle',
      marginRight: 8,
    }} />
  );
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
    <div style={styles.app}>
      <Sidebar current={screen} setCurrent={setScreen} />
      <main style={styles.main}>
        <header style={styles.header}>
          {screen === 'request' ? 'Send Request' : screen === 'dashboard' ? 'Dashboard' : screen === 'popular' ? 'Popular APIs' : 'Request History'}
        </header>
        <section style={styles.content}>
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