import React from 'react';

export interface ApiTemplate {
  name: string;
  description: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: string;
}

const popularApis: ApiTemplate[] = [
  {
    name: 'JSONPlaceholder GET',
    description: 'Fake REST API for testing (GET post)',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    method: 'GET',
  },
  {
    name: 'JSONPlaceholder POST',
    description: 'Fake REST API for testing (create post)',
    url: 'https://jsonplaceholder.typicode.com/posts',
    method: 'POST',
    body: '{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}',
  },
  {
    name: 'JSONPlaceholder PUT',
    description: 'Fake REST API for testing (update post)',
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    method: 'PUT',
    body: '{\n  "id": 1,\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}',
  },
  {
    name: 'httpbin POST',
    description: 'Echoes your request (POST)',
    url: 'https://httpbin.org/post',
    method: 'POST',
    body: '{\n  "test": 123\n}',
  },
];

export function PopularApis({ onSelect }: { onSelect: (api: ApiTemplate) => void }) {
  return (
    <div style={{ width: 480, maxWidth: '100%', margin: '0 auto', marginTop: 32 }}>
      <h2 style={{ color: '#00e0ff', textAlign: 'center', marginBottom: 24 }}>Popular APIs</h2>
      {popularApis.map(api => (
        <div key={api.name} style={{ background: '#232526', borderRadius: 12, boxShadow: '0 2px 8px #0002', padding: 18, marginBottom: 18, cursor: 'pointer', transition: 'box-shadow 0.2s', border: '2px solid transparent' }}
          onClick={() => onSelect(api)}
          onMouseOver={e => (e.currentTarget.style.boxShadow = '0 4px 16px #00e0ff44')}
          onMouseOut={e => (e.currentTarget.style.boxShadow = '0 2px 8px #0002')}
        >
          <div style={{ fontWeight: 700, fontSize: 18, color: '#00e0ff' }}>{api.name}</div>
          <div style={{ fontSize: 15, color: '#ccc', margin: '6px 0 0 0' }}>{api.description}</div>
          <div style={{ fontSize: 14, color: '#aaa', marginTop: 6 }}><b>Method:</b> {api.method} <b>URL:</b> {api.url}</div>
          {api.body && <pre style={{ fontSize: 13, color: '#ffc107', margin: 0, marginTop: 8, background: '#181a1b', borderRadius: 6, padding: 8 }}>Body: {api.body}</pre>}
        </div>
      ))}
    </div>
  );
} 