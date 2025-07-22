import React from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import './styles/Dashboard.css';

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
  if (!history || history.length === 0) {
    return (
      <div className="dashboard-empty">No data to display. Please send some requests first.</div>
    );
  }
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
    <div className="dashboard-root">
      <div className="dashboard-charts-row">
        <div className="dashboard-card dashboard-methods">
          <h3 className="dashboard-title dashboard-title-methods">HTTP Methods</h3>
          <PieChart width={220} height={220}>
            <Pie data={methodCounts} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
              {methodCounts.map((entry, idx) => <Cell key={entry.name} fill={methodColors[idx % methodColors.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <div className="dashboard-card dashboard-status">
          <h3 className="dashboard-title dashboard-title-status">Status Codes</h3>
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
      <h3 className="dashboard-title dashboard-title-requests">Requests per Day</h3>
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
  );
};

export default Dashboard; 