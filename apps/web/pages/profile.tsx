import React, { useEffect, useState, useRef } from 'react';
import Cat from '../components/Cat';

const WALLPAPERS = [
  { id: 'beach', label: 'Beach', value: 'linear-gradient(120deg,#f6d365 0%,#fda085 100%)' },
  { id: 'mint', label: 'Mint', value: 'linear-gradient(120deg,#84fab0 0%,#8fd3f4 100%)' },
  { id: 'night', label: 'Night', value: 'linear-gradient(120deg,#2b5876 0%,#4e4376 100%)' }
];

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [wallpaper, setWallpaper] = useState(WALLPAPERS[0].value);
  const [unsaved, setUnsaved] = useState(false);
  const unsavedTimer = useRef<number | null>(null);
  const meowTimer = useRef<number | null>(null);

  useEffect(() => {
    // try to load a user (first existing or create one)
    (async () => {
      const res = await fetch('http://localhost:4000/users');
      const list = await res.json();
      if (list.length > 0) {
        setUser(list[0]);
        setName(list[0].name || '');
        setEmail(list[0].email || '');
        setWallpaper(list[0].settings?.wallpaper || WALLPAPERS[0].value);
      }
    })();
  }, []);

  useEffect(() => {
    // start a meow timer only when there are unsaved changes
    if (!unsaved) {
      if (meowTimer.current) { window.clearTimeout(meowTimer.current); meowTimer.current = null; }
      return;
    }
    if (meowTimer.current) window.clearTimeout(meowTimer.current);
    // meow after 20s of unsaved changes
    meowTimer.current = window.setTimeout(() => {
      setCatActive(true);
    }, 20000);
  }, [unsaved]);

  const [catActive, setCatActive] = useState(false);

  useEffect(() => {
    if (!catActive) return;
    // stop cat after 10s
    const t = setTimeout(() => setCatActive(false), 10000);
    return () => clearTimeout(t);
  }, [catActive]);

  const save = async () => {
    setUnsaved(false);
    let id = user?.id;
    const payload = { name, email, settings: { wallpaper } };
    if (!id) {
      const res = await fetch('http://localhost:4000/users', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const created = await res.json();
      setUser(created);
    } else {
      const res = await fetch(`http://localhost:4000/users/${id}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const updated = await res.json();
      setUser(updated);
    }
  };

  function onChange() {
    setUnsaved(true);
  }

  return (
    <div style={{ minHeight: '100vh', padding: 24, fontFamily: 'Inter, Arial', background: wallpaper, transition: 'background 0.3s ease' }}>
      <h1>Profile</h1>
      <p>Manage your profile and app appearance. If you forget to save changes, the cat will remind you 😺</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 8 }}>Name</label>
          <input value={name} onChange={(e) => { setName(e.target.value); onChange(); }} style={{ width: '100%', padding: 8, marginBottom: 12 }} />

          <label style={{ display: 'block', marginBottom: 8 }}>Email</label>
          <input value={email} onChange={(e) => { setEmail(e.target.value); onChange(); }} style={{ width: '100%', padding: 8, marginBottom: 12 }} />

          <div style={{ marginTop: 12 }}>
            <button onClick={save} style={{ padding: '10px 16px', background: '#0b5fff', color: 'white', border: 'none', borderRadius: 6 }}>{user ? 'Save profile' : 'Create profile'}</button>
            {unsaved && <span style={{ marginLeft: 12, color: '#b55' }}>Unsaved changes</span>}
          </div>
        </div>

        <aside>
          <h3>Appearance</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {WALLPAPERS.map((w) => (
              <label key={w.id} style={{ display: 'block', cursor: 'pointer', borderRadius: 8, overflow: 'hidden', padding: 8 }}>
                <input type="radio" name="wall" checked={wallpaper === w.value} onChange={() => { setWallpaper(w.value); onChange(); }} style={{ marginRight: 8 }} />
                <div style={{ display: 'inline-block', verticalAlign: 'middle', padding: 8, borderRadius: 6, background: w.value, color: '#fff' }}>{w.label}</div>
              </label>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            <h4>Preview</h4>
            <div style={{ height: 160, borderRadius: 8, overflow: 'hidden', background: wallpaper }} />
          </div>
        </aside>
      </div>

      <Cat active={catActive} />
    </div>
  );
}
