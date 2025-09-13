// ---------- CONFIG ----------
// 👇 Cambia esta URL por la de tu backend en Render cuando lo tengas.
// Ejemplo: "https://mi-backend.onrender.com/ask"
const backendUrl = ""; 

// ---------- ELEMENTOS ----------
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const advisorImg = document.getElementById("advisor-img");
const advisorStatus = document.getElementById("advisor-status");
const sendBtn = document.getElementById("send-btn");
const resetBtn = document.getElementById("reset-btn");

// ---------- BASE LOCAL (fallback) ----------
const localResponses = {
  "embargo": "⚠️ Un embargo solo puede realizarse con una orden judicial. Nadie puede entrar a tu casa sin una orden de un juez.",
  "demanda": "⚖️ Si recibiste una demanda civil, lo ideal es acudir con un abogado o solicitar apoyo gratuito en CONDUSEF: 55 5340 0999 o 800 824 4722.",
  "bienes": "🏠 Los bienes de terceros no pueden ser embargados sin prueba. Ten facturas o contratos que acrediten propiedad.",
  "carcel": "🚫 En general, en México no existe cárcel por deudas civiles.",
  "cartas": "📄 Aquí tienes modelos de cartas. Selecciona la que necesites:"
};

const letters = {
  "convenio": "Estimado (a):\n\nPropongo un convenio de pago acorde a mis posibilidades...",
  "prorroga": "Estimado (a):\n\nSolicito prórroga por [motivo] y me comprometo a pagar a partir de [fecha]...",
  "no-propiedad": "A quien corresponda:\n\nHago constar que los bienes dentro del domicilio señalado no son propiedad del deudor..."
};

// ---------- UTILIDADES UI ----------
function addMessage(html, className="bot-message"){
  const msg = document.createElement("div");
  msg.className = className;
  msg.innerHTML = html;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function setAdvisorMood(mood){
  if(mood === "thinking") advisorImg.src = "assets/advisor-thinking.png";
  else if(mood === "worried") advisorImg.src = "assets/advisor-worried.png";
  else advisorImg.src = "assets/advisor-happy.png";
}

// ---------- HANDLERS ----------
async function sendMessage(){
  const text = userInput.value.trim();
  if(!text) return;
  addMessage(escapeHtml(text), "user-message");
  userInput.value = "";

  advisorStatus.textContent = "🤔 Estoy pensando en cómo ayudarte...";
  setAdvisorMood("thinking");

  // Fallback local
  const low = text.toLowerCase();
  if(low.includes("carta") || low.includes("cartas")){
    addMessage(localResponses.cartas, "bot-message");
    addMessage(`
      <div class="suggestions">
        <button onclick="showLetter('convenio')">✍️ Convenio</button>
        <button onclick="showLetter('prorroga')">🕒 Prórroga</button>
        <button onclick="showLetter('no-propiedad')">🚪 No propiedad</button>
      </div>`, "bot-message");
    advisorStatus.textContent = "✍️ Selecciona la carta que necesites.";
    setAdvisorMood("happy");
    return;
  }

  // Resto de respuestas
  let found = null;
  if(low.includes("embargo")) found = localResponses.embargo;
  else if(low.includes("demanda")) found = localResponses.demanda;
  else if(low.includes("bien")) found = localResponses.bienes;
  else if(low.includes("carcel") || low.includes("cárcel")) found = localResponses.carcel;

  if(!found){
    found = "🙂 Gracias por tu consulta. Pregunta sobre: embargo, demanda, bienes, cárcel o cartas modelo.";
  }
  addMessage(found, "bot-message");
  advisorStatus.textContent = "🙂 Estoy aquí para ayudarte.";
  setAdvisorMood("happy");
}

function showLetter(type){
  const letter = letters[type] || "No encontré esa carta.";
  addMessage("📄 Texto sugerido:<br><pre>" + escapeHtml(letter) + "</pre>", "bot-message");
  advisorStatus.textContent = "✍️ Aquí está la carta modelo.";
  setAdvisorMood("happy");
}

function resetChat(){
  chatBox.innerHTML = "";
  advisorStatus.textContent = "🙂 Hola, soy tu asesor virtual. Estoy aquí para ayudarte.";
  setAdvisorMood("happy");
  addWelcome();
}

function addWelcome(){
  const welcome = `
    👋 ¡Bienvenido! Soy tu asesor especializado en deudas civiles en México ⚖️.
    <div style="margin-top:8px;">
      Selecciona una sugerencia:
      <div class="suggestions">
        <button onclick="sendSuggestion('embargo')">⚠️ Embargo</button>
        <button onclick="sendSuggestion('carcel')">🚫 Cárcel</button>
        <button onclick="sendSuggestion('convenio')">✍️ Carta de convenio</button>
        <button onclick="sendSuggestion('cartas')">📄 Ver cartas</button>
      </div>
    </div>`;
  addMessage(welcome, "bot-message");
}

function sendSuggestion(text){
  userInput.value = text;
  sendMessage();
}

function escapeHtml(str){
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
}

// ---------- EVENTOS ----------
sendBtn.addEventListener("click", sendMessage);
resetBtn.addEventListener("click", resetChat);
userInput.addEventListener("keypress", e => { if(e.key === "Enter") sendMessage(); });
window.addEventListener("load", resetChat);

