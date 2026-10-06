// api/html.js

export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html');

  return res.status(200).send(`
    <html>
      <head>
        <title>Prueba Instana HTML</title>
      </head>
      <body>
        <h1>Respuesta del servicio</h1>
        <p>Código de respuesta: 00</p>
      </body>
    </html>
  `);
}