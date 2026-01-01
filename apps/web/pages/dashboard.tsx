import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [forecast, setForecast] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token');
      if (!token) { window.location.href = '/login'; return; }
      const headers = { Authorization: `Bearer ${token}` };
      const t = await fetch('http://localhost:4000/transactions', { headers });
      if (t.status === 401) { window.location.href = '/login'; return; }
      setTransactions(await t.json());
      const b = await fetch('http://localhost:4000/budgets', { headers });
      setBudgets(await b.json());
      const f = await fetch('http://localhost:4000/forecast', { headers });
      setForecast(await f.json());
    })();
  }, []);

  const total = transactions.reduce((s,tx) => s + tx.amount, 0);

  return (
    <div style={{ padding: 24 }}>
      <h1>Dashboard</h1>
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <h3>Balance</h3>
          <div style={{ fontSize: 32 }}>{total.toFixed(2)}</div>

          <h3 style={{ marginTop: 20 }}>Budgets</h3>
          <ul>{budgets.map(b => <li key={b.id}>{b.name}: {b.limit}</li>)}</ul>

          <h3 style={{ marginTop: 20 }}>Forecast (avg monthly)</h3>
          {forecast && <div>{forecast.avgMonthly.toFixed(2)}</div>}
        </div>

        <aside style={{ width: 320 }}>
          <h3>Recent Transactions</h3>
          <ul>{transactions.slice(-10).reverse().map(tx => <li key={tx.id}>{tx.date} - {tx.name} - {tx.amount}</li>)}</ul>
        </aside>
      </div>
    </div>
  );
}
