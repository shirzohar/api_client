import React from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export interface ApiRequest {
  id: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: string;
  date: string;
  status?: number;
}

const methodColors = ['#00e0ff', '#3a7bd5', '#ff4d4f', '#ffc107'];

const Dashboard: React.FC<{ history: ApiRequest[] }> = ({ history }) => {
  // Pie: HTTP methods
  const methodCounts = ['GET', 'POST', 'PUT', 'DELETE'].map(method => ({
    name: method,
    value: history.filter(r => r.method === method).length,
  })).filter(d => d.value > 0);

  // Bar: Status codes
  const statusMap: { [code: string]: number } = {};
  history.forEach(r => {
    if (r.status) statusMap[r.status] = (statusMap[r.status] || 0) + 1;
  });
  const statusData = Object.entries(statusMap).map(([code, value]) => ({ code, value }));

  // Line: Requests per day
  const dayMap: { [day: string]: number } = {};
  history.forEach(r => {
    const day = r.date.slice(0, 10);
    dayMap[day] = (dayMap[day] || 0) + 1;
  });
  const dayData = Object.entries(dayMap).map(([day, value]) => ({ day, value })).sort((a, b) => a.day.localeCompare(b.day));

  return (
    <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 32, marginTop: 24 }}>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ background: '#232526', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px #0002', minWidth: 280 }}>
          <h3 style={{ color: '#00e0ff', margin: 0, marginBottom: 12 }}>HTTP Methods</h3>
          <PieChart width={220} height={220}>
            <Pie data={methodCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
              {methodCounts.map((entry, idx) => <Cell key={entry.name} fill={methodColors[idx % methodColors.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <div style={{ background: '#232526', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px #0002', minWidth: 320 }}>
          <h3 style={{ color: '#3a7bd5', margin: 0, marginBottom: 12 }}>Status Codes</h3>
          <BarChart width={260} height={220} data={statusData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="code" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#00e0ff" />
          </BarChart>
        </div>
      </div>
      <div style={{ background: '#232526', borderRadius: 16, padding: 24, boxShadow: '0 2px 12px #0002', minWidth: 320 }}>
        <h3 style={{ color: '#ffc107', margin: 0, marginBottom: 12 }}>Requests per Day</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={dayData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#ffc107" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard; 