const express = require('express');
const router = express.Router();
const upload = require("../middleware/upload.middleware");
const pool = require('../config/db');
const sharp = require('sharp');

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
            'UPDATE employees SET picture=$1, picture_type=$2 WHERE applicant_id=$3',
            [bufferOptimizado, 'image/webp', usuarioId]
        );

        /*await pool.query(
          `INSERT INTO employees (applicant_id, picture, picture_type)
           VALUES ($1, $2, $3)
           ON CONFLICT (applicant_id)
           DO UPDATE SET picture = EXCLUDED.picture, picture_type = EXCLUDED.picture_type`,
          [usuarioId, bufferOptimizado, file.mimetype]
        );*/

        res.json({ message: "Photo saved successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error saving image" });
    }
});

router.get("/getPicture/:dni", async (req, res) => {
    try {
        const usuarioId = req.params.dni;

        //console.log('Fetching picture for userId:', usuarioId);

        const result = await pool.query(
            'SELECT picture, picture_type FROM employees WHERE document_number=$1',
            [usuarioId]
        );

       // console.log('Fetching picture rows:', result || 'No result');

        if (!Array.isArray(result) || result.length === 0) {
            return res.status(404).send("Image not found");
        }

        const foto = result[0];

        if (!Buffer.isBuffer(foto.picture)) {
            return res.status(500).json({ error: "Image data is invalid" });
        }

        const pictureBase64 = foto.picture.toString('base64');

        res.json({
            picture_type: foto.picture_type,
            picture_base64: pictureBase64,
            data_url: `data:${foto.picture_type};base64,${pictureBase64}`
        });

    } catch (error) {
        console.error('Error getting image:', error);
        res.status(500).send("Error getting image");
    }
});

/*router.get("/getPicture/:id", async (req, res) => {
    try {

        const usuarioId = req.params.id;
        console.log('usuarioId:', usuarioId);

        try {
            result = await pool.query(
                'SELECT picture, picture_type FROM employees WHERE applicant_id=$1',
                [usuarioId]
            );
        } catch (err) {
            console.error('Error querying database:', err);
        }
        console.log('Fetching picture rows:', result ? result.rows : 'No result');

        if (!result || !result.rows || result.rows.length === 0) {
            return res.status(404).send("Image not found");
        }

        const foto = result.rows[0];

        // Asegúrate de que sea Buffer
        if (!Buffer.isBuffer(foto.picture)) {
            return res.status(500).send("Image data is invalid");
        }
        console.log('Saving picture for user:', usuarioId, 'file:', foto.picture);
        res.set("Content-Type", foto.picture_type); // MIME type correcto
        res.send(foto.picture);                     // enviar buffer directo

    } catch (error) {
        console.error(error);
        res.status(500).send("Error getting image");
    }
});*/

module.exports = router;
