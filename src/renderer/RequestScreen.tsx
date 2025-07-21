import React, { useState, useEffect } from 'react';
import { ApiRequest } from './Dashboard';

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

if (typeof window !== 'undefined' && !document.getElementById('spin-keyframes')) {
  const style = document.createElement('style');
  style.id = 'spin-keyframes';
  style.innerHTML = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
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
    <form onSubmit={handleSend} style={{ width: 480, maxWidth: '100%', background: '#232526', borderRadius: 16, boxShadow: '0 2px 16px #0003', padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <label style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>Request URL</label>
      <input
        type="text"
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="https://jsonplaceholder.typicode.com/posts/1"
        style={{ padding: 12, borderRadius: 8, border: '1px solid #444', fontSize: 16, background: '#181a1b', color: '#fff' }}
        required
      />
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Method</label>
          <select
            value={method}
            onChange={e => setMethod(e.target.value as any)}
            style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #444', fontSize: 16, background: '#181a1b', color: '#fff' }}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
      </div>
      {/* Dynamic Headers */}
      <div>
        <label style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Headers</label>
        {headers.map((h, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            <input
              type="text"
              value={h.key}
              onChange={e => handleHeaderChange(i, 'key', e.target.value)}
              placeholder="Header Name"
              style={{ flex: 2, padding: 8, borderRadius: 6, border: '1px solid #444', background: '#181a1b', color: '#fff' }}
            />
            <input
              type="text"
              value={h.value}
              onChange={e => handleHeaderChange(i, 'value', e.target.value)}
              placeholder="Header Value"
              style={{ flex: 3, padding: 8, borderRadius: 6, border: '1px solid #444', background: '#181a1b', color: '#fff' }}
            />
            <button type="button" onClick={() => handleRemoveHeader(i)} style={{ background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 6, padding: '0 10px', fontWeight: 700, cursor: 'pointer' }}>×</button>
          </div>
        ))}
        <div style={{ marginTop: 14 }}>
          <button
            type="button"
            onClick={handleAddHeader}
            style={{
              background: 'transparent',
              color: '#00e0ff',
              border: '2px solid #00e0ff',
              borderRadius: 20,
              padding: '6px 20px',
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              outline: 'none',
              boxShadow: 'none',
              transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = '#00e0ff22';
              e.currentTarget.style.boxShadow = '0 2px 8px #00e0ff33';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ fontSize: 20, fontWeight: 900, marginRight: 4, lineHeight: 1 }}>+</span> Add Header
          </button>
        </div>
      </div>
      {(method === 'POST' || method === 'PUT') && (
        <div style={{ width: '100%' }}>
          <label style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Body (JSON)</label>
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder={`{\n  "title": "foo",\n  "body": "bar"\n}`}
            rows={4}
            style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #444', fontSize: 15, background: '#181a1b', color: '#fff', resize: 'vertical' }}
          />
        </div>
      )}
      <button
        type="submit"
        disabled={loading || !url}
        style={{
          marginTop: 10,
          padding: '14px 0',
          borderRadius: 8,
          background: loading ? 'linear-gradient(90deg, #00e0ff88 0%, #3a7bd588 100%)' : 'linear-gradient(90deg, #00e0ff 0%, #3a7bd5 100%)',
          color: '#232526',
          fontWeight: 700,
          fontSize: 18,
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 2px 8px #00e0ff33',
          transition: 'background 0.2s',
          outline: success ? '2px solid #00e0ff' : undefined,
          position: 'relative',
        }}
        onMouseOver={e => (e.currentTarget.style.filter = 'brightness(1.08)')}
        onMouseOut={e => (e.currentTarget.style.filter = '')}
        onMouseDown={e => (e.currentTarget.style.filter = 'brightness(0.95)')}
        onMouseUp={e => (e.currentTarget.style.filter = 'brightness(1.08)')}
      >
        {loading ? <Spinner /> : null}
        {loading ? 'Sending...' : 'Send Request'}
      </button>
      {success && !error && (
        <div style={{ color: '#00e0ff', fontWeight: 700, marginTop: 8, fontSize: 16, textAlign: 'center', letterSpacing: 1 }}>
          ✓ Request sent successfully!
        </div>
      )}
      {error && <div style={{ color: '#ff4d4f', fontWeight: 600, marginTop: 8, textAlign: 'center' }}>Error: {error}</div>}
      {result && (
        <div style={{ marginTop: 18, background: '#181a1b', borderRadius: 8, padding: 16, color: '#fff', fontSize: 15 }}>
          <div style={{ marginBottom: 8, fontWeight: 600 }}>Status: {result.status}</div>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0, fontFamily: 'Fira Mono, monospace', color: '#00e0ff' }}>{prettyJson(result.data)}</pre>
        </div>
      )}
    </form>
  );
};

export default RequestScreen; 