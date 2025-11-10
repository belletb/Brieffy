# Brieffy

## Descrição 
Brieffy é uma plataforma de preparação para entrevistas com inteligência artificial, desenvolvida como parte do meu Projeto Integrador no curso de Tecnologia da Informação da UFMS. Seu objetivo é ajudar estudantes, profissionais em transição de carreira e candidatos ao primeiro emprego a se prepararem com mais segurança. Para isso, a plataforma simula entrevistas, oferece feedback personalizado e propõe trilhas de aprendizado adaptativas.

## Funcionalidades 
- Simulações de entrevistas com IA 
- Feedback das respostas
- Interface responsiva e intuitiva
- Tela de cadastro com segmentação de público

## Tecnologias utilizadas
- HTML
- CSS
- Bootstrap
- JavaScript
- Node.JS
- Express
- PostgreSQL

## Instalação

Siga estes passos para obter uma cópia local do projeto e executá-lo no seu computador.

### Requisitos

- Git (para clonar o repositório)
- Navegador moderno (Chrome, Edge, Firefox)
- Opcional: Node.js + npm 

### Passo a passo

1. Clone o repositório:

   ```powershell
   git clone https://github.com/belletb/brieffy.git
   cd brieffy
   ```

2. Abrir localmente (modo rápido):

   - Abra o arquivo `public\index.html` no navegador (duplo clique ou `Start-Process` no PowerShell):

     ```powershell
     Start-Process .\public\index.html
     ```

3. Servir em um servidor local (recomendado para evitar restrições de CORS e testar recursos que dependam de um servidor):

     ```powershell
     npm install -g http-server
     http-server -p 8000
     # Depois abra http://localhost:8000/public
     ```

## Uso

Após abrir a aplicação no navegador, você pode navegar pela interface e testar as funcionalidades:

- A pasta `public/` contém os arquivos estáticos (HTML, imagens e assets).
- A pasta `styles/` contém `styles.css` e `entrevista.css` para estilização.
- Para modificar textos e conteúdo estático, edite `public/index.html` e os arquivos dentro de `public/images`.

Exemplo rápido — editar título da página:

1. Abra `public\index.html` em um editor de texto.
2. Localize a tag `<title>` ou o elemento de título na página e altere o texto.
3. Salve o arquivo e recarregue a página no navegador.

### Scripts / organização de scripts

- `public/js/auth.js` — módulo de autenticação cliente (mock). Expõe `window.Auth.init()` e `window.Auth.login(email, password, remember)`.
- `public/js/app.js` — comportamentos principais da interface 

## Como testar rapidamente

1. Lance o servidor local (veja instruções acima).
2. Acesse `http://localhost:8000/public` (ou abra `public/index.html` diretamente).
3. Navegue pela aplicação e verifique as páginas e estilos.

