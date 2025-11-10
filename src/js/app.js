
  // Formulário de login
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e){
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      const remember = document.getElementById('rememberMe').checked;

      const result = window.Auth ? window.Auth.login(email, password, remember) : { ok: false };
      if (result && result.ok) {
        window.location.href = './entrevista.html';
      }
    });
  }

  // Formulário de cadastro (modal)
const signupForm = document.querySelector('#signupModal form');
if (signupForm) {
  signupForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;

    try {
      const response = await fetch('http://localhost:3000/api/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, role })
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar');
      }

      const user = await response.json();
      localStorage.setItem('brieffy_user', JSON.stringify(user));
      window.location.href = './entrevista.html';
    } catch (error) {
      alert('Falha no cadastro: ' + error.message);
    }
  });
}
