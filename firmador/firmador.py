from flask import Flask, request, jsonify
import subprocess
import os

app = Flask(__name__)


@app.route('/firmar', methods=['POST'])
def firmar():
    try:
        data = request.json
        xml_file_path = data['xmlFilePath']
        ruc_empresa = data['ruc_empresa']
        clave_file_path = f"/app/firmador/Firma/clave.txt"

        if not os.path.exists(clave_file_path):
            return jsonify({"error": "No se encontró el archivo de clave"}), 400

        with open(clave_file_path, 'r', encoding='utf-8') as clave_file:
            clave = clave_file.readline().strip()

        jar_path = "/app/firmador/firmar.jar"
        numero_comprobante = os.path.basename(
            xml_file_path).replace('origen', '').replace('.xml', '')

        # Ejecutar el firmador .jar
        subprocess.run(['java', '-jar', jar_path, 'FACT',
                        numero_comprobante, clave, ruc_empresa])

        # Ruta del archivo firmado
        signed_file_path = f"/app/{ruc_empresa}/FACT/{numero_comprobante}.xml"
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
