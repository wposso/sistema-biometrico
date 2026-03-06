require('dotenv').config();
const app = require('./app');
const { html } = require('./src/utils/server.status');
const http = require('http');
const { init: initSocket } = require('./src/service/socket.service');
const { checkInactiveVendors } = require('./src/service/location_check.service');

const server = http.createServer(app);
initSocket(server);

app.get('/', (req, res) => {
  const now = new Date();

  res.status(200).send(html);
});

setInterval(() => {
  checkInactiveVendors(15) // 15 min sin reportar
    .then(() => console.log('Chequeo de inactividad ejecutado'))
    .catch(err => console.error('Error en chequeo de inactividad:', err));
}, 5 * 60 * 1000);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));