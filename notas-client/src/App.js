import React, { useEffect, useState } from 'react';

const API_URL = 'https://atividade9-2.onrender.com/notas';

function App() {
  const [notas, setNotas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  // Carrega notas
  const carregarNotas = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setNotas(data);
  };

  useEffect(() => {
    carregarNotas();
  }, []);

  // Criar ou atualizar nota
  const salvarNota = async (e) => {
    e.preventDefault();
    const novaNota = { titulo, conteudo };

    if (editandoId) {
      // Atualizar
      await fetch(`${API_URL}/${editandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaNota),
      });
      setEditandoId(null);
    } else {
      // Criar
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaNota),
      });
    }

    setTitulo('');
    setConteudo('');
    carregarNotas();
  };

  // Editar nota
  const editarNota = (nota) => {
    setTitulo(nota.titulo);
    setConteudo(nota.conteudo);
    setEditandoId(nota.id);
  };

  // Deletar nota
  const deletarNota = async (id) => {
    if (window.confirm('Confirma deletar essa nota?')) {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      carregarNotas();
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Notas</h1>

      <form onSubmit={salvarNota} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          required
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <textarea
          placeholder="Conteúdo"
          value={conteudo}
          onChange={e => setConteudo(e.target.value)}
          required
          rows={4}
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>
          {editandoId ? 'Atualizar Nota' : 'Criar Nota'}
        </button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {notas.map(nota => (
          <li key={nota.id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
            <h3>{nota.titulo}</h3>
            <p>{nota.conteudo}</p>
            <button onClick={() => editarNota(nota)} style={{ marginRight: 10 }}>
              Editar
            </button>
            <button onClick={() => deletarNota(nota.id)}>Deletar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
