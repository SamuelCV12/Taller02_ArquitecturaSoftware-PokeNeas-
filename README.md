# Taller 02 - Pokeneas

Aplicación Express para consultar Pokeneas nacidos en Antioquia. La
implementación usa controladores, servicios, rutas y modelos separados, y
está preparada para ejecutarse como servicio replicado en Docker Swarm sobre
AWS.

## Estructura

- `src/models`: un modelo por archivo, con atributos públicos y getters/setters.
- `src/data`: los 5 Pokeneas de este integrante. El compañero puede agregar sus
  5 en el mismo arreglo para completar los 10 solicitados.
- `src/controllers`: toda la lógica que atienden las rutas.
- `src/routes`: únicamente conecta URLs con controladores.
- `src/services`: selección aleatoria, URL de imágenes e identificación del
  contenedor.
- `views`: vista HTML; los datos se entregan agrupados dentro del arreglo
  `data`.
- `public/images`: imágenes SVG locales para probar sin AWS.

## Ejecución local

Requiere Node.js 22 o superior.

```bash
npm install
cp .env.example .env
npm start
```

Rutas:

- `GET /api/pokenea`: devuelve aleatoriamente `id`, `nombre`, `altura`,
  `habilidad` y `containerId`.
- `GET /pokenea`: muestra aleatoriamente imagen, frase filosófica y
  `containerId`.

## Imágenes en Amazon S3

1. Crear un bucket S3 en AWS.
2. Subir los cinco archivos de `public/images`.
3. Configurar acceso de lectura de los objetos según la política de seguridad
   de la cuenta (para una práctica se puede usar una bucket policy de lectura
   pública únicamente para esa carpeta).
4. Copiar la URL base pública del bucket en `S3_PUBLIC_BASE_URL`, sin `/` al
   final. Ejemplo:

```env
S3_PUBLIC_BASE_URL=https://mi-bucket.s3.us-east-1.amazonaws.com
```

La aplicación construye las URLs como
`S3_PUBLIC_BASE_URL/<imageKey>`. En local, si no se configura la variable, usa
las imágenes incluidas en `public/images`.

## Docker y Docker Hub

```bash
docker build -t <usuario-dockerhub>/pokeneas:latest .
docker run --rm -p 3000:3000 \
  -e S3_PUBLIC_BASE_URL=https://mi-bucket.s3.us-east-1.amazonaws.com \
  <usuario-dockerhub>/pokeneas:latest
```

En el repositorio de GitHub se debe configurar:

- `DOCKERHUB_USERNAME`: usuario de Docker Hub.
- `DOCKERHUB_TOKEN`: token de acceso de Docker Hub.

El workflow `.github/workflows/docker-publish.yml` publica `latest` y una
etiqueta con el SHA de cada push a `main`.

## Adaptación del despliegue a AWS

La actividad original solicita GCP; esta versión usa EC2 y S3:

1. Crear 4 instancias EC2 con Docker instalado y permitir TCP `3000`, además
   de los puertos de Docker Swarm `2377/tcp`, `7946/tcp` y `7946/udp`,
   `4789/udp` entre las instancias.
2. En la instancia líder:

```bash
docker swarm init --advertise-addr <IP_PRIVADA_LIDER>
docker swarm join-token manager
```

3. Ejecutar el comando `docker swarm join` mostrado en las otras 3 instancias.
4. En la líder, comprobar los 4 managers:

```bash
docker node ls
```

5. Crear un servicio con 10 réplicas. Sustituir los valores entre `<...>`:

```bash
docker service create \
  --name pokeneas \
  --publish published=3000,target=3000 \
  --env S3_PUBLIC_BASE_URL=https://<bucket>.s3.<region>.amazonaws.com \
  --replicas 10 \
  <usuario-dockerhub>/pokeneas:latest
```

6. Verificar la distribución:

```bash
docker service ls
docker service ps pokeneas
curl http://<IP_PUBLICA_DE_CUALQUIER_EC2>:3000/api/pokenea
```

Al consultar varias veces `/pokenea`, el `containerId` permite evidenciar que
las respuestas vienen de distintos contenedores. No se requiere autoescalado.

## Evidencias para la entrega

- Captura de `docker service ls` o `docker service ps pokeneas` mostrando las
  10 réplicas.
- Captura del listado de imágenes de Docker (`docker images`) en EC2.
- Dos capturas de `/pokenea` donde se observen `containerId` diferentes.
- IP pública de la instancia o del balanceador que el docente probará.
