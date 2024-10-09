from flask import Flask, request, jsonify
import subprocess
import os

app = Flask(__name__)


@app.route('/firmar', methods=['POST'])
def firmar():
    try:
        data = request.json
        # Ruta completa del XML sin firmar enviado por billing
        xml_file_path = data['xmlFilePath']
        ruc_empresa = data['ruc_empresa']

        # Leer variables de entorno para las rutas de los certificados y claves
        certificado_path = os.getenv(
            'CERTIFICADO_PATH', '/app/firmador/Firma/certificado.p12')
        clave_file_path = os.getenv(
            'CLAVE_PATH', '/app/firmador/Firma/clave.txt')

        # Verificar si existe el archivo de clave
        if not os.path.exists(clave_file_path):
            return jsonify({"error": "No se encontró el archivo de clave"}), 400

        # Leer la clave
        with open(clave_file_path, 'r', encoding='utf-8') as clave_file:
            clave = clave_file.readline().strip()

        # Ruta del archivo .jar ajustada
        jar_path = "/app/firmador/firmar.jar"

        # Extraer el número de comprobante (estab, ptoEmi, secuencial)
        nombre_archivo = os.path.basename(xml_file_path).replace('.xml', '')
        numero_comprobante = f"{nombre_archivo[24:27]}-{nombre_archivo[27:30]}-{nombre_archivo[30:39]}"

        # Ruta de salida del archivo firmado
        output_dir = f"/app/firmador/FACT/{ruc_empresa}/"
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        # Ejecutar el firmador .jar
        subprocess.run(['java', '-jar', jar_path, 'FACT',numero_comprobante, clave, ruc_empresa])

        # Ruta del archivo firmado
        signed_file_path = os.path.join(
            output_dir, f"{numero_comprobante}.xml")

        # Verificar si el archivo firmado existe
        if os.path.exists(signed_file_path):
            with open(signed_file_path, 'r') as signed_file:
                xmlFirmado = signed_file.read()
            return jsonify({"success": True, "xmlFirmado": xmlFirmado})
        else:
            return jsonify({"success": False, "message": "Archivo firmado no encontrado"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8081)
