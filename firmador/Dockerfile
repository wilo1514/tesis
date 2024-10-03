# Base de la imagen
FROM openjdk:11-jre-slim

# Instalar dependencias de Python y Flask
RUN apt-get update && apt-get install -y python3 python3-pip && pip3 install flask

# Crear directorios de trabajo
RUN mkdir -p /app/firmador

# Copiar los archivos del firmador .jar y dependencias
COPY ./MMfirma/firmar.jar /app/firmador/
COPY ./MMfirma/lib /app/firmador/lib/

# Copiar los certificados y claves
COPY ./Firma/certificado.p12 /app/firmador/Firma/
COPY ./Firma/clave.txt /app/firmador/Firma/

# Copiar el archivo Python que servirá como API
COPY ./firmador.py /app/firmador/

# Establecer el directorio de trabajo
WORKDIR /app/firmador

# Exponer el puerto para Flask
EXPOSE 8081

# Comando para iniciar el servidor Flask
CMD ["python3", "firmador.py"]
