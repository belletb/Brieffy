// Recupera o usuário do localStorage
const user = JSON.parse(localStorage.getItem('brieffy_user'));
const usuario_id = user?.id || null;

// Objeto da entrevista
const entrevista = {
  usuario_id: usuario_id,
  q1: '',
  q2: '',
  q3: ''
};

// Função para salvar respostas 
function salvarResposta(numero, texto) {
  entrevista[`q${numero}`] = texto;
}

// Função para registrar resposta digitada
function registrarRespostaDigitada(numero) {
  const texto = document.getElementById('respostaDigitada').value;
  salvarResposta(numero, texto);
  alert('Resposta salva!');
}

let isRecording = false;
let timerInterval = null;
let seconds = 0;

function toggleRecording() {
  const btn = document.getElementById('recordBtn');
  const responseArea = document.getElementById('responseArea');
  const aiThinking = document.getElementById('aiThinking');

  isRecording = !isRecording;

  if (isRecording) {
    btn.classList.add('recording');
    btn.innerHTML = '<i class="bi bi-stop-fill"></i>';
    responseArea.innerHTML = '<p class="response-text">Lorem, ipsum dolor sit amet consectetur adipisicing elit...</p>';
    startTimer();
  } else {
    btn.classList.remove('recording');
    btn.innerHTML = '<i class="bi bi-mic-fill"></i>';
    stopTimer();

    // Simula resposta gravada 
    salvarResposta(3, "Lorem, ipsum dolor sit amet...");

    aiThinking.classList.add('active');
    setTimeout(() => {
      aiThinking.classList.remove('active');
      showFeedback();
    }, 2000);
  }
}

function startTimer() {
  seconds = 0;
  timerInterval = setInterval(() => {
    seconds++;
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    document.getElementById('timer').textContent = `${mins}:${secs}`;
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function toggleWriteMode() {
  const responseArea = document.getElementById('responseArea');
  responseArea.innerHTML = `
    <textarea id="respostaDigitada" class="form-control" rows="6" placeholder="Digite sua resposta aqui..." style="border: none; background: transparent; resize: none; font-size: 1rem;"></textarea>
    <button onclick="registrarRespostaDigitada(3)" class="btn btn-success mt-2">Salvar Resposta</button>
  `;
}

function showFeedback() {
  alert('Ótima resposta! A IA está analisando sua estrutura de resposta e tom de voz. Você receberá feedback detalhado ao final da entrevista.');
}

function endInterview() {
  if (confirm('Tem certeza que deseja encerrar a entrevista? Seu progresso será salvo.')) {
    fetch('http://localhost:3000/api/entrevistas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
  body: JSON.stringify({
    usuario_id: entrevista.usuario_id,
    respostas: JSON.stringify(entrevista)
  })
    })
    .then(response => {
      if (!response.ok) throw new Error('Erro ao salvar entrevista');
      return response.json();
    })
    .then(data => {
      alert('Entrevista salva com sucesso!');
      window.location.href = 'index.html';
    })
    .catch(error => {
      alert('Falha ao salvar entrevista: ' + error.message);
    });
  }
}
