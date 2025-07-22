import React, { useState, useEffect } from 'react';
import { ApiRequest } from './Dashboard';
import './styles/RequestScreen.css';

function Spinner() {
  return <span className="request-spinner" />;
}

function prettyJson(str: string) {
  try {
    const obj = JSON.parse(str);
    return JSON.stringify(obj, null, 2);
  } catch {
    return str;
  }
}

interface Props {
  onHistoryAdd: (req: ApiRequest) => void;
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: string;
}

const RequestScreen: React.FC<Props> = ({ onHistoryAdd, url: defaultUrl = '', method: defaultMethod = 'GET', body: defaultBody = '' }) => {
  const [url, setUrl] = useState(defaultUrl);
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>(defaultMethod);
  const [body, setBody] = useState(defaultBody);
  const [headers, setHeaders] = useState<Array<{ key: string; value: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<null | { status: number; data: string }>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setUrl(defaultUrl);
    setMethod(defaultMethod);
    setBody(defaultBody);
    setHeaders([]);
    setError(null);
    setResult(null);
    setSuccess(false);
  }, [defaultUrl, defaultMethod, defaultBody]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setSuccess(false);
    try {
      const headersObj: Record<string, string> = { 'Content-Type': 'application/json' };
      headers.forEach(h => {
        if (h.key.trim()) headersObj[h.key.trim()] = h.value;
      });
      const options: RequestInit = {
        method,
        headers: headersObj,
      };
      if ((method === 'POST' || method === 'PUT') && body) {
        options.body = body;
      }
      const res = await fetch(url, options);
      const text = await res.text();
      setResult({ status: res.status, data: text });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1800);
      onHistoryAdd({
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        url,
        method,
        body: (method === 'POST' || method === 'PUT') ? body : undefined,
        date: new Date().toISOString(),
        status: res.status,
      });
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleHeaderChange = (idx: number, field: 'key' | 'value', value: string) => {
    setHeaders(hs => hs.map((h, i) => i === idx ? { ...h, [field]: value } : h));
  };
  const handleAddHeader = () => setHeaders(hs => [...hs, { key: '', value: '' }]);
  const handleRemoveHeader = (idx: number) => setHeaders(hs => hs.filter((_, i) => i !== idx));

  return (
    <form className="request-form" onSubmit={handleSend}>
      <label className="request-label request-label-url">Request URL</label>
      <input
        className="request-input request-input-url"
        type="text"
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="https://jsonplaceholder.typicode.com/posts/1"
        required
      />
      <div className="request-row">
        <div className="request-method-col">
          <label className="request-label request-label-method">Method</label>
          <select
            className="request-select"
            value={method}
            onChange={e => setMethod(e.target.value as any)}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
      </div>
      <label className="request-label request-label-headers">Headers</label>
      {headers.map((h, i) => (
        <div key={i} className="request-header-row">
          <input
            className="request-input request-header-key"
            type="text"
            value={h.key}
            onChange={e => handleHeaderChange(i, 'key', e.target.value)}
            placeholder="Header Name"
          />
          <input
            className="request-input request-header-value"
            type="text"
            value={h.value}
            onChange={e => handleHeaderChange(i, 'value', e.target.value)}
            placeholder="Header Value"
          />
          <button type="button" className="request-header-remove" onClick={() => handleRemoveHeader(i)}>×</button>
        </div>
      ))}
      <button
        type="button"
        className="request-add-header"
        onClick={handleAddHeader}
      >
        <span className="request-add-header-plus">+</span> Add Header
      </button>
      {(method === 'POST' || method === 'PUT') && (
        <div className="request-body-row">
          <label className="request-label request-label-body">Body (JSON)</label>
          <textarea
            className="request-textarea"
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder={`{\n  "title": "foo",\n  "body": "bar"\n}`}
            rows={4}
          />
        </div>
      )}
      <button
        type="submit"
        className={`request-submit${loading ? ' loading' : ''}${success ? ' success' : ''}`}
        disabled={loading || !url}
      >
        {loading ? <Spinner /> : null}
        {loading ? 'Sending...' : 'Send Request'}
      </button>
      {success && !error && (
        <div className="request-success">✓ Request sent successfully!</div>
      )}
      {error && <div className="request-error">Error: {error}</div>}
      {result && (
        <div className="request-result">
          <div className="request-result-status">Status: {result.status}</div>
          <pre className="request-result-data">{prettyJson(result.data)}</pre>
        </div>
      )}
    </form>
  );
};

export default RequestScreen; 