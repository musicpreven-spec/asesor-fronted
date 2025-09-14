// ---------- CONFIG ----------
// 👇 Cambia esta URL por la de tu backend en Render cuando lo tengas.
// Ejemplo: "https://mi-backend.onrender.com/ask"
const backendUrl = "https://asesor-backend.onrender.com"; 

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const advisorImg = document.getElementById("advisor-img");
const advisorStatus = document.getElementById("advisor-status");
const sendBtn = document.getElementById("send-btn");
const resetBtn = document.getElementById("reset-btn");

const localResponses = {
  "embargo": "⚠️ Un embargo solo puede realizarse con una orden judicial...",
  "demanda": "⚖️ Si recibiste una demanda civil, lo ideal es acudir con un abogado...",
  "bienes": "🏠 Los bienes de terceros no pueden ser embargados sin prueba...",
  "carcel": "🚫 En México no existe cárcel por deudas civiles...",
  "cartas": "📄 Puedo darte modelos: convenio, prórroga, o carta de no propiedad."
};

const letters = {
  "convenio": "Estimado (a):\n\nPropongo un convenio de pago...",
  "prorroga": "Estimado (a):\n\nSolicito prórroga por [motivo]...",
  "no-propiedad": "A quien corresponda:\n\nHago constar que los bienes..."
};

function addMessage(html, className="bot-message"){
  const msg = document.createElement("div");
  msg.className = className;
  msg.innerHTML = html;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function setAdvisorMood(mood){
  if(mood === "thinking") {
    advisorImg.src = "assets/advisor-thinking.png";
    advisorStatus.textContent = "🤔 Estoy pensando en cómo ayudarte...";
  }
  else if(mood === "worried") {
    advisorImg.src = "assets/advisor-worried.png";
    advisorStatus.textContent = "😟 No encontré información exacta, pero aquí tienes orientación general.";
  }
  else {
    advisorImg.src = "assets/advisor-happy.png";
    advisorStatus.textContent = "🙂 Estoy aquí para ayudarte.";
  }
}

async function sendMessage(){
  const text = userInput.value.trim();
  if(!text) return;
  addMessage(escapeHtml(text), "user-message");
  userInput.value = "";

  setAdvisorMood("thinking");

  try {
    if(backendUrl && backendUrl.startsWith("http")){
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ question: text })
      });
      const data = await res.json();
      addMessage(data.answer, "bot-message");
      setAdvisorMood("happy");
      return;
    }
  } catch (err) {
    console.warn("Backend no disponible:", err);
  }

  const low = text.toLowerCase();
  let found = null;
  if(low.includes("embargo")) found = localResponses.embargo;
  else if(low.includes("demanda")) found = localResponses.demanda;
  else if(low.includes("bien") || low.includes("tercero")) found = localResponses.bienes;
  else if(low.includes("carcel") || low.includes("cárcel") || low.includes("prisión")) found = localResponses.carcel;
  else if(low.includes("carta") || low.includes("cartas")) found = localResponses.cartas;

  if(!found){
    setAdvisorMood("worried");
    found = "🤔 No tengo respuesta exacta, pero puedes preguntar sobre embargo, demanda, bienes de terceros, cárcel o pedir cartas modelo.";
  } else {
    setAdvisorMood("happy");
  }
  addMessage(found, "bot-message");
}

function sendSuggestion(text){
  userInput.value = text;
  sendMessage();
}

function showLetter(type){
  const letter = letters[type] || "No encontré esa carta.";
  addMessage(`<div class="letter-box">${escapeHtml(letter)}</div>`, "bot-message");
  setAdvisorMood("happy");
}

function resetChat(){
  chatBox.innerHTML = "";
  setAdvisorMood("happy");
  addWelcome();
}

function addWelcome(){
  const welcome = `
    👋 ¡Bienvenido! Soy tu asesor especializado en deudas civiles ⚖️.
    <div style="margin-top:8px;">
      Usa los botones de arriba para empezar o escribe tu consulta.
    </div>`;
  addMessage(welcome, "bot-message");
}

function escapeHtml(str){
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
}

sendBtn.addEventListener("click", sendMessage);
resetBtn.addEventListener("click", resetChat);
userInput.addEventListener("keypress", e => { if(e.key === "Enter") sendMessage(); });

window.addEventListener("load", () => { resetChat(); });
