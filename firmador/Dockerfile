# Dockerfile

FROM openjdk:17-slim

# Instalar dependencias de Python y Flask
RUN apt-get update && apt-get install -y python3 python3-pip wget && pip3 install flask

# Crear directorios de trabajo
 WORKDIR /app/firmador
RUN mkdir -p /app/firmador/Firma
RUN mkdir -p /app/firmador/firma

# Copiar los archivos del firmador .jar
COPY ./org/MMfirma/firmar.jar /app/firmador/
COPY ./org/MMfirma/lib /app/firmador/lib/

# Descargar los archivos del repositorio público
RUN wget https://raw.githubusercontent.com/wilo1514/claves/main/certificado.p12 -O /app/firmador/firma/certificado.p12
RUN wget https://raw.githubusercontent.com/wilo1514/claves/main/clave.txt -O /app/firmador/firma/clave.txt

RUN wget https://raw.githubusercontent.com/wilo1514/claves/main/certificado.p12 -O /app/firmador/Firma/certificado.p12
RUN wget https://raw.githubusercontent.com/wilo1514/claves/main/clave.txt -O /app/firmador/Firma/clave.txt


# Copiar el archivo Python que servirá como API
COPY ./firmador.py /app/firmador/

EXPOSE 8081

CMD ["python3", "firmador.py"]
