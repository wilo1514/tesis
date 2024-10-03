# Usamos una imagen base de Python con Java
FROM openjdk:11-jre-slim

# Instalar dependencias de Python
RUN apt-get update && apt-get install -y python3 python3-pip

# Crear el directorio de trabajo
WORKDIR /app

# Copiar el script y las dependencias
COPY org /app/org
COPY Firma /app/Firma
COPY firma_server.py /app/firma_server.py

# Instalar Flask
RUN pip3 install flask

# Exponer el puerto del servidor
EXPOSE 8080

# Comando para ejecutar el servidor Python
CMD ["python3", "/app/firma_server.py"]
