// ---------- CONFIG ----------
const backendUrl = "https://asesor-backend.onrender.com"; 
// <-- cambia esto por la URL que Replit te dé (o deja vacío para usar solo la KB local: "")

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
  "carcel": "🚫 En general, en México no existe cárcel por deudas civiles; si te amenazan con eso, denúncialo. (Hay excepciones muy puntuales en casos penales o incumplimiento de obligaciones judiciales).",
  "cartas": "📄 Puedo darte modelos: convenio, prórroga, o carta de no propiedad. Escribe 'cartas' para verlos."
};

const letters = {
  "convenio": "Estimado (a):\n\nPropongo un convenio de pago acorde a mis posibilidades para saldar la deuda en plazos mensuales de [monto] durante [número] meses...\n\nAtentamente,\n[Nombre]",
  "prorroga": "Estimado (a):\n\nSolicito prórroga por [motivo] y me comprometo a pagar a partir de [fecha]...\n\nAtentamente,\n[Nombre]",
  "no-propiedad": "A quien corresponda:\n\nHago constar que los bienes dentro del domicilio señalado no son propiedad del deudor, sino de terceros, por lo que solicito respetar su derecho de propiedad.\n\nAtentamente,\n[Nombre]"
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
  // espera que tengas las imágenes dentro de /assets/
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

  // UI: asesor pensando
  advisorStatus.textContent = "🤔 Estoy pensando en cómo ayudarte...";
  setAdvisorMood("thinking");

  // intenta backend si está configurado
  if(backendUrl && backendUrl.startsWith("http")){
    try {
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ question: text })
      });
      const data = await res.json();
      addMessage(data.answer, "bot-message");
      advisorStatus.textContent = "🙂 Aquí tienes lo que encontré.";
      setAdvisorMood("happy");
      return;
    } catch (err) {
      // sigue al fallback local
      console.warn("No se pudo conectar al backend, usando KB local.", err);
    }
  }

  // Fallback local: busca coincidencias simples
  const low = text.toLowerCase();
  let found = null;
  if(low.includes("embargo")) found = localResponses.embargo;
  else if(low.includes("demanda")) found = localResponses.demanda;
  else if(low.includes("bien") || low.includes("tercero")) found = localResponses.bienes;
  else if(low.includes("carcel") || low.includes("cárcel") || low.includes("preso") || low.includes("prision")) found = localResponses.carcel;
  else if(low.includes("carta") || low.includes("cartas")) found = localResponses.cartas;

  if(!found){
    found = "🙂 Gracias por tu consulta. Puedes preguntar sobre: embargo, demanda, bienes de terceros, cárcel o pedir cartas modelo.";
  }
  addMessage(found, "bot-message");
  advisorStatus.textContent = "🙂 Estoy aquí para ayudarte.";
  setAdvisorMood("happy");
}

function sendSuggestion(text){
  userInput.value = text;
  sendMessage();
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
      Selecciona una sugerencia para comenzar:
      <div class="suggestions">
        <button onclick="sendSuggestion('¿Qué hago si recibo una notificación de embargo?')">⚠️ Embargo</button>
        <button onclick="sendSuggestion('¿Pueden meterme a la cárcel por no pagar?')">🚫 Cárcel</button>
        <button onclick="sendSuggestion('¿Cómo redacto una carta de convenio?')">✍️ Carta de convenio</button>
        <button onclick="sendSuggestion('Cartas')">📄 Ver cartas</button>
      </div>
    </div>`;
  addMessage(welcome, "bot-message");
}

// Escape básico para evitar inyección accidental
function escapeHtml(str){
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
}

// ---------- EVENTOS ----------
sendBtn.addEventListener("click", sendMessage);
resetBtn.addEventListener("click", resetChat);
userInput.addEventListener("keypress", function(e){
  if(e.key === "Enter") sendMessage();
});

// al cargar
window.addEventListener("load", () => {
  resetChat();
});



