const db = require('../config/db');
const { generateAttendancePDF } = require('../service/pdf.service');

exports.attendanceReport = async (req, res) => {
  const { from, to } = req.query;
  const data = await db.manyOrNone(
    'SELECT u.name, a.type, a.server_timestamp FROM attendance a JOIN users u ON a.user_id=u.id WHERE a.server_timestamp BETWEEN $1 AND $2',
    [from, to]
  );
  res.json(data);
};

exports.exportPDF = async (req, res) => {
  const { from, to } = req.query;
  const data = await db.manyOrNone(
    'SELECT u.name, a.type, a.server_timestamp FROM attendance a JOIN users u ON a.user_id=u.id WHERE a.server_timestamp BETWEEN $1 AND $2',
    [from, to]
  );
  const path = await generateAttendancePDF(data);
  res.download(path);
};