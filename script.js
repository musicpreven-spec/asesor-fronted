const backendUrl = "https://asesor-backend.onrender.com"; 

// ---------- ELEMENTOS ----------
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const advisorImg = document.getElementById("advisor-img");
const sendBtn = document.getElementById("send-btn");
const resetBtn = document.getElementById("reset-btn");

// ---------- RESPUESTAS LOCALES ----------
const localResponses = {
  "embargo": "⚠️ Un embargo solo puede realizarse con una orden judicial. Nadie puede entrar a tu casa sin una orden de un juez.",
  "demanda": "⚖️ Si recibiste una demanda civil, lo recomendable es buscar asesoría legal o acercarte a CONDUSEF.",
  "bienes": "🏠 Los bienes de terceros no pueden ser embargados sin prueba; es importante tener facturas o contratos que acrediten propiedad.",
  "carcel": "🚫 En México en general no existe cárcel por deudas civiles. Si alguien te amenaza con llevarte a prisión por una deuda civil, eso es abuso y debe denunciarse.",
  "cartas": "📄 Modelos: carta de convenio, carta de prórroga, carta de no propiedad. Haz clic en una opción para ver el texto."
};

const letters = {
  "convenio": "Estimado(a):\n\nPropongo un convenio de pago acorde a mis posibilidades para saldar la deuda en plazos mensuales de [monto] durante [número] meses...\n\nAtentamente,\n[Nombre]",
  "prorroga": "Estimado(a):\n\nSolicito prórroga por [motivo] y me comprometo a pagar a partir de [fecha]...\n\nAtentamente,\n[Nombre]",
  "no-propiedad": "A quien corresponda:\n\nHago constar que los bienes dentro del domicilio señalado no son propiedad del deudor, sino de terceros, por lo que solicito respetar su derecho de propiedad.\n\nAtentamente,\n[Nombre]"
};

// ---------- UTILIDADES ----------
function addMessage(html, className="bot-message"){
  const msg = document.createElement("div");
  msg.className = className;
  msg.innerHTML = html;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function setAdvisorMood(mood){
  if(mood==="thinking") advisorImg.src="assets/advisor-thinking.png";
  else if(mood==="worried") advisorImg.src="assets/advisor-worried.png";
  else advisorImg.src="assets/advisor-happy.png";
}

function escapeHtml(str){
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

// ---------- FUNCIONES ----------
function sendMessage(){
  const text = userInput.value.trim();
  if(!text) return;
  addMessage(escapeHtml(text),"user-message");
  userInput.value="";
  // Asesor pensando
  setAdvisorMood("thinking");
  setTimeout(()=>{ handleResponse(text); }, 500);
}

function handleResponse(text){
  const low = text.toLowerCase();
  let found = null;

  if(low.includes("embargo")) found = localResponses.embargo;
  else if(low.includes("demanda")) found = localResponses.demanda;
  else if(low.includes("bien") || low.includes("tercero")) found = localResponses.bienes;
  else if(low.includes("carcel") || low.includes("cárcel") || low.includes("preso") || low.includes("prision")) found = localResponses.carcel;
  else if(low.includes("carta") || low.includes("cartas")) found = localResponses.cartas;

  if(!found) found = "🙂 Gracias por tu consulta. Puedes preguntar sobre: embargo, demanda, bienes de terceros, cárcel o pedir cartas modelo.";

  addMessage(found,"bot-message");
  setAdvisorMood("happy");
}

function sendSuggestion(text){
  userInput.value = text;
  sendMessage();
}

function showLetter(type){
  const letter = letters[type] || "No encontré esa carta.";
  addMessage(`<div class="letter">${escapeHtml(letter)}</div>`);
  setAdvisorMood("happy");
}

function resetChat(){
  chatBox.innerHTML="";
  setAdvisorMood("happy");
  addWelcome();
}

function addWelcome(){
  const welcome = `👋 ¡Bienvenido! Soy tu asesor especializado en deudas civiles en México ⚖️.
<div style="margin-top:8px;" class="suggestions">
  <button onclick="sendSuggestion('¿Qué hago si recibo una notificación de embargo?')">⚠️ Embargo</button>
  <button onclick="sendSuggestion('¿Pueden meterme a la cárcel por no pagar?')">🚫 Cárcel</button>
  <button onclick="sendSuggestion('¿Cómo redacto una carta de convenio?')">✍️ Carta de convenio</button>
  <button onclick="sendSuggestion('Cartas')">📄 Ver cartas</button>
</div>`;
  addMessage(welcome,"bot-message");
}

// ---------- EVENTOS ----------
sendBtn.addEventListener("click", sendMessage);
resetBtn.addEventListener("click", resetChat);
userInput.addEventListener("keypress", function(e){
  if(e.key==="Enter") sendMessage();
});

window.addEventListener("load", ()=>{ resetChat(); });
