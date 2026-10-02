// api/health.js
// Endpoint para probar API Simple y API Script en Instana.
//
// Para simular una falla, cambia API_BROKEN a "true" en las
// Environment Variables del proyecto en el dashboard de Vercel
// (Settings > Environment Variables) y vuelve a desplegar
// (o usa "Redeploy" sin tocar código).

/* ------------------------------------- COMENTADO PARA PRUEBA DE <BODY> OO
export default function handler(req, res) {
  const broken = process.env.API_BROKEN === "true";

  if (broken) {
    return res.status(500).json({
      status: "error",
      message: "Fallo simulado para pruebas de Instana",
    });
  }

  return res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
-----------------------------------------------------*/



// api/health.js

// Endpoint para probar API Simple y API Script en Instana.

export default function handler(req, res) {

  const broken = process.env.API_BROKEN === "true";

  if (broken) {
    return res.status(500).json({
      status: "error",
      message: "Fallo simulado para pruebas de Instana",
      codigo: "99",
    });
  }

  return res.status(200).json({
    status: "ok",
    codigo: "00",
    timestamp: new Date().toISOString(),
  });
}