import React from 'react';
import { ApiRequest } from './Dashboard';

interface Props {
  history: ApiRequest[];
  onDelete: (id: string) => void;
  onLoad: (req: ApiRequest) => void;
}

const HistoryScreen: React.FC<Props> = ({ history, onDelete, onLoad }) => {
  if (history.length === 0) {
    return <div style={{ fontSize: 22, color: '#aaa', marginTop: 60 }}>No history yet.</div>;
  }
  return (
    <div style={{ width: 600, maxWidth: '100%', margin: '0 auto', marginTop: 24 }}>
      {history.map(req => (
        <div key={req.id} style={{ background: '#232526', borderRadius: 12, boxShadow: '0 2px 8px #0002', padding: 18, marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{req.method} <span style={{ color: '#00e0ff' }}>{req.url}</span></div>
            <div style={{ fontSize: 13, color: '#aaa', marginTop: 2 }}>{new Date(req.date).toLocaleString()} {req.status && <span style={{ color: '#3a7bd5', marginLeft: 8 }}>Status: {req.status}</span>}</div>
            {req.body && <pre style={{ fontSize: 13, color: '#ccc', margin: 0, marginTop: 4, background: '#181a1b', borderRadius: 6, padding: 8 }}>{req.body}</pre>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={() => onLoad(req)} style={{ background: 'linear-gradient(90deg, #00e0ff 0%, #3a7bd5 100%)', color: '#232526', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 700, cursor: 'pointer' }}>Load</button>
            <button onClick={() => onDelete(req.id)} style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontWeight: 700, cursor: 'pointer' }}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryScreen; 