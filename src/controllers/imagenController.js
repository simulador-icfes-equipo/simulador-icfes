const { cloudinary } = require("../config/cloudinary");

class ImagenController {

    subir = async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    mensaje: "No se recibió ninguna imagen. Envía el archivo en el campo 'imagen'."
                });
            }

            const carpeta = req.query.carpeta || "simulador-icfes";

            const resultado = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: carpeta },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );

                stream.end(req.file.buffer);
            });

            return res.status(201).json({
                mensaje: "Imagen subida correctamente",
                url: resultado.secure_url,
                public_id: resultado.public_id
            });

        } catch (error) {
            console.error("Error al subir la imagen:", error);
            return res.status(500).json({
                mensaje: "Error al subir la imagen a Cloudinary",
                error: error.message
            });
        }
    };

}

module.exports = ImagenController;