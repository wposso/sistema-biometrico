const express = require('express');
const cors = require("cors");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('./src/config/session');

const setupSwagger = require('./swagger');

const authRoute = require('./src/routes/auth.route');
const authRouteMobile = require('./src/routes/auth.mobile.route');
const attendanceRoute = require('./src/routes/attendance.route');
const locationRoute = require('./src/routes/location.route');
const alertRoute = require('./src/routes/alert.route');
const reportRoute = require('./src/routes/reporte.route');
const userRoute = require('./src/routes/user.route');
const employeeRoute = require('./src/routes/employee.route');

const app = express();

app.use(cors({
  origin: "*"
}));

app.use(express.json());
app.use(helmet());
app.use(rateLimit({ windowMs: 1*60*1000, max: 100 }));
app.use(session);

app.use('/api/engine/v1/auth', authRoute);
app.use('/api/MobileEngine/v1/auth', authRouteMobile);

app.use('/api/engine/v1/attendance', attendanceRoute);
app.use('/api/engine/v1/location', locationRoute);
app.use('/api/engine/v1/alerts', alertRoute);
app.use('/api/engine/v1/reports', reportRoute);
app.use('/api/engine/v1/users', userRoute);
app.use('/api/emgine/v1/employees', employeeRoute);

setupSwagger(app);


module.exports = app;