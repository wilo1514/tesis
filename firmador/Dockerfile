# Usamos la imagen base de OpenJDK que es compatible con Java
FROM openjdk:17-slim

# Instalar dependencias de Python y Flask
RUN apt-get update && apt-get install -y python3 python3-pip && pip3 install flask

# Crear directorios de trabajo
WORKDIR /app/firmador

# Copiar los archivos del firmador .jar y dependencias
COPY ./org/MMfirma/firmar.jar /app/firmador/
COPY ./org/MMfirma/lib /app/firmador/lib/

# Copiar los certificados y claves
COPY ./firma/certificado.p12 /app/firmador/Firma/
COPY ./firma/clave.txt /app/firmador/Firma/

# Copiar el archivo Python que servirá como API
COPY ./firmador.py /app/firmador/

# Exponer el puerto para Flask
EXPOSE 8081

# Ejecutar tanto el JAR como el servicio de Flask
CMD ["python3", "firmador.py"]
