# Base de la imagen
FROM openjdk:11-jre-slim

# Instalar dependencias de Python y Flask
RUN apt-get update && apt-get install -y python3 python3-pip && pip3 install flask

# Crear directorios de trabajo
RUN mkdir -p /app/firmador /c/0104065461001/firma

# Crear enlace simbólico de c:/ hacia /c
RUN ln -s /c /c:

# Copiar los archivos del firmador .jar y dependencias
COPY ./org/MMfirma/firmar.jar /app/firmador/
COPY ./org/MMfirma/lib /app/firmador/lib/

# Copiar los certificados y claves
COPY ./firma/certificado.p12 /c/0104065461001/firma/
COPY ./firma/clave.txt /c/0104065461001/firma/

# Copiar el archivo Python que servirá como API
COPY ./firmador.py /app/firmador/

# Establecer el directorio de trabajo
WORKDIR /app/firmador

# Exponer el puerto para Flask
EXPOSE 8081

# Comando para iniciar el servidor Flask
CMD ["python3", "firmador.py"]
