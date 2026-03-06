const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.generateAttendancePDF = async (attendanceData, path = './attendance_report.pdf') => {
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(path));

  doc.fontSize(16).text('Reporte de Asistencia', { align: 'center' });
  doc.moveDown();

  attendanceData.forEach(record => {
    doc.fontSize(12).text(
      `${record.name} | ${record.type} | ${new Date(record.server_timestamp).toLocaleString()}`
    );
  });

  doc.end();
  return path;
};