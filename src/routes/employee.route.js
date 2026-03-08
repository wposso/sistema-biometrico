const express = require('express');
const router = express.Router();
const upload = require("./upload");
const pool = require('../config/db');

router.post("/sendPicture/:id", upload.single("foto"), async (req, res) => {
  try {
    const usuarioId = req.params.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No image was uploaded' });
    }

    const bufferOptimizado = await sharp(file.buffer)
      .resize(512)
      .webp({ quality: 80 })
      .toBuffer();

    await pool.query(
      `INSERT INTO usuario_fotos (usuario_id, foto, tipo)
       VALUES ($1, $2, $3)
       ON CONFLICT (usuario_id)
       DO UPDATE SET foto = EXCLUDED.foto, tipo = EXCLUDED.tipo`,
      [usuarioId, bufferOptimizado, file.mimetype]
    );

    res.json({ message: "Photo saved successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error saving image" });
  }
});

router.get("/getPicture/:id", async (req, res) => {
  try {
    const usuarioId = req.params.id;

    const result = await pool.query(
      "SELECT foto, tipo FROM usuario_fotos WHERE usuario_id = $1",
      [usuarioId]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Image not found");
    }

    const foto = result.rows[0];

    res.set("Content-Type", foto.tipo);
    res.send(foto.foto);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting image");
  }
});

module.exports = router;