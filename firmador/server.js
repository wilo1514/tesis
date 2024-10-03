const express = require('express');
const { exec } = require('child_process');
const app = express();

app.use(express.json());

app.post('/firmar', (req, res) => {
    const { xmlPath } = req.body;
    const rucEmpresa = '0104065461001'; // El RUC de la empresa

    // Ejecutar el comando para firmar
    exec(`java -jar /app/firmar.jar FACT ${path.basename(xmlPath, '.xml')} /app/clave.txt ${rucEmpresa}`, (error, stdout, stderr) => {
        if (error) {
            console.error('Error ejecutando el firmador:', stderr);
            return res.status(500).json({ success: false, message: 'Error al firmar' });
        }

        // Leer el archivo firmado
        const signedXmlPath = xmlPath.replace('.xml', '_signed.xml');
        const signedXml = fs.readFileSync(signedXmlPath, 'utf8');
        res.json({ success: true, signedXml });
    });
});

app.listen(8080, () => {
    console.log('Firmador escuchando en el puerto 8080');
});
