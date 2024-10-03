import subprocess
import os
import shutil
from flask import Flask, request, jsonify

app = Flask(__name__)


def firmar_xml(xml_file_path, ruc_empresa):
    # Crear la ruta de destino donde se espera que esté el archivo
    destination_directory = f"/app/{ruc_empresa}/FACT"
    destination_file_path = os.path.join(
        destination_directory, os.path.basename(xml_file_path))

    # Crear la carpeta si no existe
    os.makedirs(destination_directory, exist_ok=True)

    # Copiar el archivo a la carpeta destino
    shutil.copy(xml_file_path, destination_file_path)
    print(f"Archivo copiado a la ruta: {destination_file_path}")

    # Leer la clave desde el archivo clave.txt
    clave_file_path = f"/app/{ruc_empresa}/firma/clave.txt"
    if not os.path.exists(clave_file_path):
        print(f"No se encontró el archivo de clave en la ruta: {
              clave_file_path}")
        return jsonify({"success": False, "message": "No se encontró el archivo de clave."})

    with open(clave_file_path, 'r', encoding='utf-8') as clave_file:
        clave = clave_file.readline().strip()

    # Comando para firmar el archivo XML
    jar_path = f"/app/{ruc_empresa}/org/MMfirma/firmar.jar"
    numero_comprobante_secuencial = os.path.basename(
        destination_file_path).replace('origen', '').replace('.xml', '')

    # Ejecutar el comando de firma
    subprocess.run(['java', '-jar', jar_path, 'FACT',
                   numero_comprobante_secuencial, clave, ruc_empresa])
    print(f"Archivo XML firmado correctamente: {destination_file_path}")

    return jsonify({"success": True, "message": "XML firmado correctamente.", "file_path": destination_file_path})


@app.route('/firmar', methods=['POST'])
def firmar():
    data = request.json
    xml_file_path = data.get('xmlPath')
    ruc_empresa = data.get('rucEmpresa')

    if not xml_file_path or not ruc_empresa:
        return jsonify({"success": False, "message": "Faltan datos: xmlPath o rucEmpresa"}), 400

    return firmar_xml(xml_file_path, ruc_empresa)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
