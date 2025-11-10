require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const { Pool } = require('pg');

const app = express(); 
app.use(cors());
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT
});

app.use(express.json()); 

app.post('/api/cadastro', async (req, res) => {
  const { name, email, role } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, perfil) VALUES ($1, $2, $3) RETURNING *',
      [name, email, role]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao cadastrar usuário');
  }
});

app.post('/api/entrevistas', async (req, res) => {
  const { respotas, usuario_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO entrevistas (respostas, usuario_id) VALUES ($1, $2, $3) RETURNING *',
      [respostas, usuario_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao salvar entrevista:', err);
    res.status(500).send('Erro ao salvar entrevista');
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

