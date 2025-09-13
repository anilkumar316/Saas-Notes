
import { useEffect, useState } from 'react';
import Router from 'next/router';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type':'application/json' } : { 'Content-Type':'application/json' };
}

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [info, setInfo] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [tenantSlug, setTenantSlug] = useState('');
  const [plan, setPlan] = useState('');

  useEffect(()=> {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const slug = localStorage.getItem('tenantSlug');
    setUserEmail(email || '');
    setTenantSlug(slug || '');
    if (!token) Router.push('/login');
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setIsAdmin(payload.role === 'admin');
    } catch (e) {}
    loadNotes();
    fetchTenant();
  }, []);

  async function fetchTenant() {
    const slug = localStorage.getItem('tenantSlug');
    if (!slug) return;
    const res = await fetch(`/api/tenants/${slug}/info`, { headers: authHeaders() });
    if (!res.ok) return;
    const data = await res.json();
    setPlan(data.plan);
  }

  async function loadNotes() {
    const res = await fetch('/api/notes', { headers: authHeaders() });
    if (res.status === 401) return Router.push('/login');
    const data = await res.json();
    setNotes(Array.isArray(data) ? data : []);
  }

  async function createNote(e) {
    e.preventDefault();
    setInfo('');
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ title, content })
    });
    const data = await res.json();
    if (!res.ok) {
      setInfo(data.error || 'Error');
      return;
    }
    setTitle(''); setContent('');
    await loadNotes();
    await fetchTenant();
  }

  async function del(id) {
    await fetch(`/api/notes/${id}`, { method: 'DELETE', headers: authHeaders() });
    await loadNotes();
  }

  async function upgrade() {
    if (!tenantSlug) {
      const s = prompt('Enter tenant slug (acme or globex)');
      if (!s) return;
    }
    const slug = tenantSlug || prompt('Enter tenant slug (acme or globex)');
    const res = await fetch(`/api/tenants/${slug}/upgrade`, { method: 'POST', headers: authHeaders() });
    const data = await res.json();
    if (!res.ok) return setInfo(data.error || 'Upgrade failed');
    setInfo('Upgraded to Pro. Note limit lifted.');
    setPlan('pro');
    await loadNotes();
  }

  return (
    <div style={{maxWidth:800, margin:40}}>
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <h1>Notes</h1>
        <div>
          <div>{userEmail}</div>
          <div>Plan: {plan}</div>
          <button onClick={()=>{localStorage.clear(); Router.push('/login');}}>Logout</button>
        </div>
      </div>

      <div>
        <form onSubmit={createNote}>
          <input placeholder="title" value={title} onChange={e=>setTitle(e.target.value)} />
          <input placeholder="content" value={content} onChange={e=>setContent(e.target.value)} />
          <button type="submit">Create</button>
        </form>
      </div>

      {isAdmin && <div style={{marginTop:10}}>
        <button onClick={upgrade}>Upgrade to Pro (Admin only)</button>
      </div>}

      <div style={{marginTop:20}}>
        {info && <div style={{color:'red'}}>{info}</div>}
        <ul>
          {notes.map(n=>(
            <li key={n.id} style={{marginBottom:8}}>
              <strong>{n.title}</strong><br />
              <small>{n.content}</small><br />
              <button onClick={()=>del(n.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
