import React from 'react';
import { ApiRequest } from './Dashboard';
import './styles/HistoryScreen.css';

interface Props {
  history: ApiRequest[];
  onDelete: (id: string) => void;
  onLoad: (req: ApiRequest) => void;
}

const HistoryScreen: React.FC<Props> = ({ history, onDelete, onLoad }) => {
  if (history.length === 0) {
    return <div className="history-empty">No history yet.</div>;
  }
  return (
    <div className="history-root">
      {history.map(req => (
        <div key={req.id} className="history-card">
          <div className="history-card-main">
            <div className="history-method-url">
              {req.method} <span className="history-url">{req.url}</span>
            </div>
            <div className="history-date-status">
              {new Date(req.date).toLocaleString()} {req.status && <span className="history-status">Status: {req.status}</span>}
            </div>
            {req.body && <pre className="history-body">{req.body}</pre>}
          </div>
          <div className="history-card-actions">
            <button onClick={() => onLoad(req)} className="history-load">Load</button>
            <button onClick={() => onDelete(req.id)} className="history-delete">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryScreen; 