# Account System

Este proyecto es un sistema contable desarrollado utilizando microservicios, Docker y MongoDB. Está compuesto por varios servicios que se comunican entre sí a través de una pasarela API (`api-gateway`). Incluye funcionalidades como autenticación, gestión de clientes, proveedores, facturación, firma electrónica y un frontend.

## Estructura del Proyecto

```
/api-gateway    - Servicio de pasarela API para gestionar las solicitudes entre los microservicios.
/App-contable   - Aplicación contable (frontend).
/auth           - Servicio de autenticación (login, registro).
/billing        - Servicio de facturación, incluyendo generación de XML y firma electrónica.
/clients        - Servicio de gestión de clientes.
/firmador       - Servicio encargado de firmar electrónicamente los documentos XML.
/suppliers      - Servicio de gestión de proveedores.
/xmls           - Carpeta compartida para los archivos XML generados y firmados.
/docker-compose.yml - Archivo para la configuración de Docker Compose.
```

## Configuración de Docker

El archivo `docker-compose.yml` define los servicios del sistema. A continuación se describe cada uno de los servicios:

- **api-gateway**: Pasarela API para gestionar las solicitudes entre los servicios.
- **auth**: Servicio de autenticación que gestiona el registro y login de usuarios.
- **clients**: Microservicio para gestionar la información de los clientes.
- **suppliers**: Microservicio para gestionar los proveedores.
- **billing**: Servicio de facturación que genera documentos XML y realiza la firma digital.
- **firmador**: Servicio encargado de firmar electrónicamente los documentos XML.
- **mongo**: Base de datos MongoDB para almacenar la información de los servicios.

### Variables de Entorno

Cada servicio tiene sus propias variables de entorno configuradas en el archivo `docker-compose.yml`, entre las cuales se destacan:

- **MONGO_URI**: Dirección de la base de datos MongoDB.
- **P12_PASSWORD**: Contraseña para el archivo de certificado P12 utilizado en la firma electrónica.
- **AMBIENTE**: Configuración del ambiente (pruebas o producción).
- **FIRMADOR_HOST**: Dirección del servicio de firma electrónica.

### Comandos para Ejecutar el Proyecto

1. **Construir y levantar los servicios:**

   Para levantar los servicios con Docker Compose, navega hasta la carpeta raíz del proyecto y ejecuta el siguiente comando:

   ```bash
   docker-compose up
   ```

   Este comando creará y levantará todos los servicios definidos en el archivo `docker-compose.yml`.

2. **Acceder a los servicios:**

   - **API Gateway**: `http://localhost:4000`
   - **Servicio de autenticación**: `http://localhost:3000`
   - **Servicio de clientes**: `http://localhost:3005`
   - **Servicio de proveedores**: `http://localhost:3003`
   - **Servicio de facturación**: `http://localhost:3001`
   - **Servicio de firma**: `http://localhost:8081`
   - **MongoDB**: `mongodb://localhost:27017`

3. **Verificar el estado de los contenedores:**

   Puedes verificar que los servicios se están ejecutando correctamente usando el siguiente comando:

   ```bash
   docker ps
   ```

4. **Detener los servicios:**

   Para detener y eliminar los contenedores, ejecuta:

   ```bash
   docker-compose down
   docker system prune -a --volumes
   docker-compose up --build 

   ```
Aquí tienes un archivo `.md` que contiene los comandos para limpiar tu entorno Docker:

```markdown
# Docker Clean-up Guide

Este documento describe los comandos para realizar una limpieza completa de Docker, eliminando contenedores, volúmenes, imágenes y redes no utilizados.

## Eliminar todos los contenedores parados

```bash
docker container prune
```

Este comando eliminará todos los contenedores que se encuentren parados.

## Eliminar todas las imágenes no usadas

```bash
docker image prune -a
```

Este comando elimina todas las imágenes que no están siendo usadas por al menos un contenedor.

## Eliminar todos los volúmenes no utilizados

```bash
docker volume prune
```

Este comando elimina todos los volúmenes de Docker que no están siendo utilizados.

## Eliminar todas las redes no utilizadas

```bash
docker network prune
```

Este comando elimina todas las redes que no están siendo utilizadas por ningún contenedor.

## Eliminar todo: contenedores, imágenes, volúmenes y redes no utilizados

```bash
docker system prune -a --volumes
```

Este comando realiza una limpieza completa de Docker, eliminando todos los contenedores parados, imágenes no utilizadas, redes no conectadas y volúmenes no utilizados.

---

Recuerda siempre usar estos comandos con precaución, ya que eliminarán recursos que no estén en uso, lo que podría resultar en pérdida de datos no persistidos.
```

Este archivo te ofrece los comandos básicos para limpiar Docker. Solo tienes que copiar y pegar estos comandos en tu terminal para limpiar todo el entorno Docker.

## Configuración de Carpetas Compartidas

El proyecto utiliza carpetas compartidas entre algunos servicios. Por ejemplo:

- La carpeta `xmls` se comparte entre el servicio de facturación (`billing`) y el firmador (`firmador`), lo cual permite que ambos servicios accedan y modifiquen los mismos archivos XML.

- La carpeta `firmas` contiene los certificados utilizados por el servicio `firmador` para la firma digital de los documentos.

## Notas

- Asegúrate de que las rutas a los certificados y archivos en el `docker-compose.yml` estén correctamente configuradas para tu sistema operativo.
- La configuración de la base de datos MongoDB utiliza un volumen llamado `mongo-data`, que asegura la persistencia de los datos entre las ejecuciones de los contenedores.

## Licencia

Este proyecto es parte de una tesis y está bajo una licencia específica para ese propósito.

```

### Explicación:

1. **Estructura del proyecto**: Se describe la estructura de carpetas que tienes en tu proyecto.
2. **Descripción de servicios**: Se enumeran y describen brevemente todos los servicios que están definidos en el archivo `docker-compose.yml`.
3. **Instrucciones de uso**: Incluye los pasos para ejecutar y detener los contenedores con Docker.
4. **Variables de entorno**: Se mencionan algunas de las variables de entorno más importantes que deben configurarse.
5. **Carpetas compartidas**: Explicación de cómo los servicios comparten carpetas para trabajar con los XML y certificados.

