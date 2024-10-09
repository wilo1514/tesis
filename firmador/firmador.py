import subprocess
import os
import shutil
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/firmar', methods=['POST'])
def firmar():
    data = request.get_json()
    xml_file_path = data.get('xmlFilePath')
    ruc_empresa = data.get('ruc_empresa')
    
    if not xml_file_path or not ruc_empresa:
        return jsonify({"success": False, "message": "Faltan parámetros: xmlFilePath o ruc_empresa"}), 400

    try:
        firmar_xml(xml_file_path, ruc_empresa)
        return jsonify({"success": True, "message": "Archivo firmado correctamente", "xmlFirmado": xml_file_path}), 200
    except Exception as e:
        return jsonify({"success": False, "message": f"Error durante la firma: {str(e)}"}), 500

def firmar_xml(xml_file_path, ruc_empresa):
    # Crear la ruta de destino donde se espera que esté el archivo
    destination_directory = f"/app/{ruc_empresa}/FACT"
    destination_file_path = os.path.join(destination_directory, os.path.basename(xml_file_path))

    # Crear la carpeta si no existe
    os.makedirs(destination_directory, exist_ok=True)

    # Copiar el archivo XML al directorio destino
    shutil.copy(xml_file_path, destination_file_path)
    print(f"Archivo copiado a la ruta: {destination_file_path}")

    # Leer la clave desde el archivo clave.txt
    clave_file_path = f"/app/firmador/Firma/clave.txt"
    if not os.path.exists(clave_file_path):
        print(f"No se encontró el archivo de clave en la ruta: {clave_file_path}")
        return

    with open(clave_file_path, 'r', encoding='utf-8') as clave_file:
        clave = clave_file.readline().strip()  # Leer la clave de la firma

    # Ruta del archivo JAR
    jar_path = "/app/firmador/firmar.jar"
    numero_comprobante_secuencial = os.path.basename(destination_file_path).replace('origen', '').replace('.xml', '')

    # Verificar que el archivo JAR exista
    if os.path.exists(jar_path):
        print(f"El archivo JAR existe en la ruta: {jar_path}")
    else:
        print(f"El archivo JAR NO existe en la ruta: {jar_path}")
        return

    # Ejecutar el comando de firma y capturar la salida y errores
    result = subprocess.run(['java', '-jar', jar_path, 'FACT', numero_comprobante_secuencial, clave, ruc_empresa], capture_output=True, text=True)

    # Imprimir la salida y los errores del comando de firma
    print(f"Salida de la firma: {result.stdout}")
    print(f"Errores durante la firma: {result.stderr}")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8081)
