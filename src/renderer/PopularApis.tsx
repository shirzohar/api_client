import React from 'react';
import './styles/PopularApis.css';

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
    <div className="popular-root">
      <h2 className="popular-title">Popular APIs</h2>
      {popularApis.map(api => (
        <div
          key={api.name}
          className="popular-card"
          onClick={() => onSelect(api)}
        >
          <div className="popular-name">{api.name}</div>
          <div className="popular-desc">{api.description}</div>
          <div className="popular-meta"><b>Method:</b> {api.method} <b>URL:</b> {api.url}</div>
          {api.body && <pre className="popular-body">Body: {api.body}</pre>}
        </div>
      ))}
    </div>
  );
} 