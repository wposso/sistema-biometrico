const now = new Date();

const html = `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <title>API Service</title>
    <style>
      body {
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
        background-color: #f5f6f8;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
      }

      .container {
        background: #ffffff;
        padding: 45px 65px;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.08);
        text-align: center;
        min-width: 320px;
      }

      h1 {
        margin: 0;
        font-size: 24px;
        color: #2c2c2c;
      }

      .status {
        margin-top: 18px;
        display: inline-block;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
        background-color: #e6f6ec;
        color: #1f8f4e;
      }

      .info {
        margin-top: 25px;
        font-size: 14px;
        color: #555;
        line-height: 1.6;
      }

      .label {
        color: #888;
      }

      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #999;
      }

    </style>
  </head>
  <body>
    <div class="container">
      <h1>API Service</h1>

      <div class="status">
        Servicio activo
      </div>

      <div class="info">
        <div><span class="label">Puerto:</span> 0.0.0.0</div>
        <div><span class="label">Hora del servidor:</span> ${now.toLocaleString()}</div>
        <div><span class="label">Estado:</span> Operativo</div>
      </div>

      <div class="footer">
        Sistema en ejecución
      </div>
    </div>
  </body>
  </html>
  `;

  module.exports = {html};