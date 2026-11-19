import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState(null);

  const fetchContacts = async () => {
    try {
      setError(null);
      const res = await fetch('/api/contacts');
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
      const result = await res.json();
      setContacts(Array.isArray(result) ? result : result.data || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !age) return;

    try {
      setError(null);
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age: Number(age) }),
      });
      if (!res.ok) throw new Error(`Erreur ajout (${res.status})`);
      setName('');
      setAge('');
      fetchContacts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Contacts</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Âge"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <button type="submit">Ajouter</button>
      </form>

      {error && <p style={{ color: 'red' }}>Erreur : {error}</p>}

      {contacts.length === 0 ? (
        <p>Aucun contact en base.</p>
      ) : (
        contacts.map((item) => (
          <div key={item._id}>
            <p>{item.name} - {item.age} ans</p>
          </div>
        ))
      )}
    </div>
  );
}

export default App;