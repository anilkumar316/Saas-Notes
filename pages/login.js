
import { useState } from 'react';
import Router from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password');
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    setErr('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      setErr(data.error || 'Login failed');
      return;
    }
    localStorage.setItem('token', data.token);
    localStorage.setItem('email', data.user.email);
    localStorage.setItem('tenantSlug', data.user.tenantSlug);
    Router.push('/');
  }

  return (
    <div style={{maxWidth:600, margin:40}}>
      <h1>Login</h1>
      <form onSubmit={submit}>
        <div><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" /></div>
        <div><input value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" /></div>
        <button type="submit">Login</button>
        {err && <div style={{color:'red'}}>{err}</div>}
      </form>
      <div style={{marginTop:20}}>
        <strong>Test accounts (password: password)</strong>
        <ul>
          <li>admin@acme.test (Admin, tenant: Acme)</li>
          <li>user@acme.test (Member, tenant: Acme)</li>
          <li>admin@globex.test (Admin, tenant: Globex)</li>
          <li>user@globex.test (Member, tenant: Globex)</li>
        </ul>
      </div>
    </div>
  );
}
