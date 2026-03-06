const session = require('express-session');

module.exports = session({
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 1000 * 60 * 60, // 1 hora
    httpOnly: true,          // evita que JS del frontend acceda
    secure: false            // true si usas HTTPS
  },
  rolling: true // Renueva la cookie cada request activa
});