// ---------- CONFIG ----------
const backendUrl = "https://asesor-backend.onrender.com/laws"; 
// <-- cambia esto por la URL que Replit te dé (o deja vacío para usar solo la KB local: "")
console.log("script.js cargado"); // para confirmar que el archivo corre
const letters = {
  "convenio": "Estimado (a):\n\nPropongo un convenio de pago acorde a mis posibilidades para saldar la deuda en plazos mensuales de [monto] durante [número] meses...\n\nAtentamente,\n[Nombre]",
  "prorroga": "Estimado (a):\n\nSolicito prórroga por [motivo] y me comprometo a pagar a partir de [fecha]...\n\nAtentamente,\n[Nombre]",
  "no-propiedad": "A quien corresponda:\n\nHago constar que los bienes dentro del domicilio señalado no son propiedad del deudor, sino de terceros, por lo que solicito respetar su derecho de propiedad.\n\nAtentamente,\n[Nombre]"
};
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Asesor - cartas</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <main>
    <h1>Cartas del Asesor</h1>
    <div id="cardsContainer"></div>
  </main>

  <!-- Cargar script con defer para que espere al DOM -->
  <script src="script.js" defer></script>
</body>
</html>







