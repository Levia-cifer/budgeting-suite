import React, { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState<'login'|'register'>('login');

  async function submit() {
    if (mode === 'login') {
      const res = await fetch('http://localhost:4000/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (data?.token) { localStorage.setItem('token', data.token); window.location.href = '/dashboard'; }
      else alert(JSON.stringify(data));
    } else {
      const res = await fetch('http://localhost:4000/auth/register', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password, name }) });
      const data = await res.json();
      if (data?.token) { localStorage.setItem('token', data.token); window.location.href = '/dashboard'; }
      else alert(JSON.stringify(data));
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>{mode === 'login' ? 'Login' : 'Register'}</h1>
      {mode === 'register' && <div><label>Name</label><input value={name} onChange={(e) => setName(e.target.value)} style={{ display: 'block', marginBottom: 8 }} /></div>}
      <div><label>Email</label><input value={email} onChange={(e) => setEmail(e.target.value)} style={{ display: 'block', marginBottom: 8 }} /></div>
      <div><label>Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ display: 'block', marginBottom: 12 }} /></div>
      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={submit}>{mode === 'login' ? 'Login' : 'Register'}</button>
        <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Switch to register' : 'Switch to login'}</button>
      </div>
    </div>
  );
}
