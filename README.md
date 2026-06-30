# Laboratorio Instana Synthetic Monitoring

Página pública mínima para probar los 6 tipos de test de Instana Synthetic
Monitoring: API Simple, API Script, Browser Simple, Browser Script, DNS y
SSL Certificate.

## 1. Desplegar en Vercel

1. Crea un repo nuevo en GitHub y sube todo el contenido de esta carpeta.
2. Entra a [vercel.com](https://vercel.com), crea cuenta con tu GitHub.
3. "Add New Project" → selecciona el repo → Deploy (no necesitas tocar
   ninguna configuración, Vercel detecta `vercel.json` automáticamente).
4. Al terminar, Vercel te da una URL pública tipo
   `https://instana-lab-tuusuario.vercel.app`. Esa URL ya es 100% pública,
   con HTTPS automático (Let's Encrypt) — ya puedes apuntar Instana ahí.

## 2. (Opcional pero recomendado) Dominio propio

Para poder practicar el test de DNS de verdad (controlando tú los
registros), conviene un dominio propio:

1. Compra un dominio barato (Namecheap, Porkbun, etc. — un `.xyz` o
   `.online` cuesta 1-2 USD el primer año).
2. En Vercel: Project Settings → Domains → agrega tu dominio.
3. Vercel te da el registro (A o CNAME) que debes crear en tu proveedor
   DNS. Si usas Cloudflare como DNS (gratis), ahí configuras el registro.
4. Espera la propagación (minutos a un par de horas) y verifica que
   `https://tudominio.com` cargue igual que la URL de Vercel.

## 3. Configurar los tests en Instana

### API Simple
- URL: `https://tudominio.com` (o la URL de Vercel)
- Código esperado: 200

### API Script
- URL del endpoint: `https://tudominio.com/api/health`
- Script de ejemplo:

```javascript
const response = await $http.get('https://tudominio.com/api/health');

if (response.statusCode !== 200) {
  throw new Error(`Código inesperado: ${response.statusCode}`);
}

const body = JSON.parse(response.body);
if (body.status !== 'ok') {
  throw new Error(`Status inesperado: ${body.status}`);
}
```

### Browser Simple
- URL: `https://tudominio.com`
- Activa grabación de video para ver visualmente las fallas simuladas.

### Browser Script
- URL: `https://tudominio.com`
- Script de ejemplo (login + assertion):

```javascript
await driver.get('https://tudominio.com');

await driver.findElement(By.id('user')).sendKeys('usuario_test');
await driver.findElement(By.id('loginBtn')).click();

const result = await driver.wait(
  until.elementLocated(By.id('result')),
  5000
);

const text = await result.getText();
if (!text.includes('Bienvenido')) {
  throw new Error('El login no mostró el mensaje de bienvenida esperado');
}
```

- Para validar contenido del `#main-content` (caso "página en blanco"):

```javascript
await driver.get('https://tudominio.com');

const main = await driver.findElement(By.id('main-content'));
const text = await main.getText();

if (!text || text.trim().length === 0) {
  throw new Error('El contenedor principal está vacío: posible página en blanco');
}
```

### DNS Test
- Dominio: `tudominio.com`
- Tipo de registro: A
- Valor esperado: la IP que te dio Vercel (opcional, para alertar si cambia)

### SSL Certificate Test
- Dominio: `tudominio.com`
- Puerto: 443
- Umbral de alerta: pruébalo bajo (ej. 89 días) para ver el test "fallar"
  de inmediato, ya que los certificados de Let's Encrypt duran ~90 días.

## 4. Cómo simular fallas para ver las alertas en acción

### Simular "página en blanco" (Browser Simple / Browser Script)
1. Edita `config.js`, cambia `BROKEN_MODE: false` a `BROKEN_MODE: true`.
2. Commit + push. Vercel redespliega automático en segundos.
3. Espera el siguiente ciclo del test en Instana y revisa cómo lo detecta.
4. Para volver al estado OK, repite el paso 1-2 con `BROKEN_MODE: false`.

### Simular falla de API (API Simple / API Script)
1. En el dashboard de Vercel: Project Settings → Environment Variables.
2. Agrega `API_BROKEN` = `true`.
3. Redeploy (botón "Redeploy" en la pestaña Deployments, sin tocar código).
4. El endpoint `/api/health` empezará a responder 500.
5. Para revertir, cambia la variable a `false` (o bórrala) y vuelve a
   hacer redeploy.

### Simular falla de DNS
1. En tu proveedor DNS (ej. Cloudflare), cambia temporalmente el registro
   A a una IP inválida (ej. `0.0.0.0`).
2. Espera el siguiente ciclo del DNS test en Instana y observa la alerta.
3. Revierte el registro a la IP correcta de Vercel.

**Importante:** baja la frecuencia de los tests mientras hagas estas
pruebas (o súbela temporalmente a cada 1 min) para no esperar demasiado
entre cada ciclo de validación.

## Estructura del repo

```
instana-lab/
├── index.html        # página principal
├── style.css          # estilos
├── config.js          # flag BROKEN_MODE para simular fallas de render
├── app.js             # lógica de render, login y fetch al API
├── api/
│   └── health.js       # endpoint serverless para API Simple/Script
├── vercel.json         # configuración de despliegue
└── README.md
```
