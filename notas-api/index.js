const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const FILE_PATH = './notas.json';

// Função para ler notas do arquivo
function lerNotas() {
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Função para salvar notas no arquivo
function salvarNotas(notas) {
  fs.writeFileSync(FILE_PATH, JSON.stringify(notas, null, 2));
}

// GET todas as notas
app.get('/notas', (req, res) => {
  const notas = lerNotas();
  res.json(notas);
});

// GET nota por id
app.get('/notas/:id', (req, res) => {
  const notas = lerNotas();
  const nota = notas.find(n => n.id === parseInt(req.params.id));
  if (nota) {
    res.json(nota);
  } else {
    res.status(404).json({ error: 'Nota não encontrada' });
  }
});

// POST criar nota
app.post('/notas', (req, res) => {
  const notas = lerNotas();
  const novaNota = {
    id: notas.length > 0 ? notas[notas.length -1].id +1 : 1,
    titulo: req.body.titulo,
    conteudo: req.body.conteudo
  };
  notas.push(novaNota);
  salvarNotas(notas);
  res.status(201).json(novaNota);
});

// PUT atualizar nota
app.put('/notas/:id', (req, res) => {
  const notas = lerNotas();
  const index = notas.findIndex(n => n.id === parseInt(req.params.id));
  if (index !== -1) {
    notas[index].titulo = req.body.titulo;
    notas[index].conteudo = req.body.conteudo;
    salvarNotas(notas);
    res.json(notas[index]);
  } else {
    res.status(404).json({ error: 'Nota não encontrada' });
  }
});

// DELETE nota
app.delete('/notas/:id', (req, res) => {
  let notas = lerNotas();
  const originalLength = notas.length;
  notas = notas.filter(n => n.id !== parseInt(req.params.id));
  if (notas.length === originalLength) {
    return res.status(404).json({ error: 'Nota não encontrada' });
  }
  salvarNotas(notas);
  res.json({ message: 'Nota deletada com sucesso' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
