-- Criação da tabela de usuários
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  perfil TEXT NOT NULL
);

-- Criação da tabela de entrevistas
CREATE TABLE entrevistas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
  respostas TEXT NOT NULL,
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserção de dados de exemplo na tabela usuarios
INSERT INTO usuarios (nome, email, perfil)
VALUES 
  ('Isabelle', 'isabelle@example.com', 'admin'),
  ('Estudante', 'estudante@example.com', 'estudante'),
  ('profissional', 'profissional@example.com', 'profissional');

-- Inserção de dados de exemplo na tabela entrevistas
INSERT INTO entrevistas (usuario_id, respostas)
VALUES 
  (1, '{"q1":"Sim","q2":"Não","q3":"Talvez"}'),
  (2, '{"q1":"Usei React","q2":"Resolvi com Redux","q3":"Aprendi muito"}'),
  (3, '{"q1":"Projeto de dados","q2":"Problemas com performance","q3":"Usei índices"}');
