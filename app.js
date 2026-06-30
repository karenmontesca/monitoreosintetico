// app.js

(function renderMainContent() {
  const container = document.getElementById("main-content");

  if (window.LAB_CONFIG && window.LAB_CONFIG.BROKEN_MODE) {
    // Simula una falla de renderizado: el contenedor queda vacío
    // y se lanza un error en consola, tal como pasaría con un bug real de frontend.
    console.error("Fallo simulado de renderizado (BROKEN_MODE activo)");
    return; // el contenedor #main-content se queda vacío -> "página en blanco"
  }

  container.innerHTML = `
    <h2>Contenido cargado correctamente</h2>
    <p>Si ves este texto, el renderizado del navegador funcionó bien.</p>
  `;
})();

// Mini login de prueba, para usar con Browser Script (Selenium)
document.getElementById("loginBtn").addEventListener("click", () => {
  const user = document.getElementById("user").value.trim();
  const resultDiv = document.getElementById("result");

  if (!user) {
    resultDiv.innerText = "Error: usuario vacío";
    resultDiv.style.color = "red";
    return;
  }

  resultDiv.innerText = `Bienvenido, ${user}`;
  resultDiv.style.color = "green";
});

// Consulta al endpoint serverless, para correlacionar con el API Script
fetch("/api/health")
  .then((res) => res.json())
  .then((data) => {
    document.getElementById("api-status").innerText = data.status;
  })
  .catch(() => {
    document.getElementById("api-status").innerText = "no disponible";
  });
