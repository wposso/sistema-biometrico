let ioInstance = null;

/**
 * Inicializa Socket.io
 * @param {Server} server - servidor HTTP de Node
 */
function init(server) {
  const { Server } = require('socket.io');
  ioInstance = new Server(server, {
    cors: { origin: '*' } // Cambia a tu dominio en producción
  });

  ioInstance.on('connection', (socket) => {
    console.log('Nuevo socket conectado:', socket.id);

    // Escucha ubicación enviada por vendedor
    socket.on('locationUpdate', (data) => {
      // data: { userId, latitude, longitude, battery, speed }
      console.log('Ubicación recibida:', data);

      // Re-emite a todos los admins conectados
      ioInstance.emit('locationUpdate', data);
    });

    // Escucha alertas generadas
    socket.on('alert', (alertData) => {
      ioInstance.emit('alert', alertData);
    });

    socket.on('disconnect', () => {
      console.log('Socket desconectado:', socket.id);
    });
  });
}

/**
 * Envia datos a todos los sockets conectados
 * @param {string} event - nombre del evento
 * @param {any} data - payload
 */
function emit(event, data) {
  if (!ioInstance) {
    console.warn('Socket.io no inicializado');
    return;
  }
  ioInstance.emit(event, data);
}

module.exports = { init, emit };