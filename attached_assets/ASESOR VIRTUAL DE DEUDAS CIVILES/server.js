// server.js - backend simple para el asesor
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const LAWS_PATH = path.join(__dirname, "laws.json");
let laws = {};
try {
  laws = JSON.parse(fs.readFileSync(LAWS_PATH, "utf8"));
} catch (e) {
  console.error("No se pudo leer laws.json:", e);
  laws = {};
}

// Log simple de interacciones (logs.json)
const LOG_PATH = path.join(__dirname, "logs.json");
function appendLog(entry){
  try {
    const arr = fs.existsSync(LOG_PATH) ? JSON.parse(fs.readFileSync(LOG_PATH,"utf8")) : [];
    arr.push(entry);
    fs.writeFileSync(LOG_PATH, JSON.stringify(arr, null, 2));
  } catch (e) {
    console.error("Error al guardar log:", e);
  }
}

app.get("/", (req,res) => res.send("Asesor legal backend activo"));

app.post("/ask", (req,res) => {
  const question = (req.body.question || "").toLowerCase();
  let answer = null;

  if(!question) {
    return res.json({ answer: "Escribe tu pregunta." });
  }

  if (question.includes("embargo")) answer = laws.embargo;
  else if (question.includes("demanda")) answer = laws.demanda;
  else if (question.includes("bien") || question.includes("tercero")) answer = laws.bienes;
  else if (question.includes("carcel") || question.includes("cárcel") || question.includes("preso") || question.includes("prision")) answer = laws.carcel;
  else if (question.includes("carta") || question.includes("cartas")) answer = laws.cartas;

  // búsqueda por palabras clave en todo laws.json
  if (!answer) {
    for (const k of Object.keys(laws)) {
      if (question.includes(k)) { answer = laws[k]; break; }
    }
  }

  if(!answer) answer = "Lo siento, no encontré una respuesta clara. Puedes preguntar sobre: embargo, demanda, bienes, cárcel o cartas modelo.";

  appendLog({ question, answer, ts: new Date().toISOString() });
  res.json({ answer });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT} (puerto ${PORT})`));
