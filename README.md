# Pokedex de Pokeneas

Aplicación web desarrollada con **Node.js y Express** para consultar
Pokeneas nacidos en Antioquia. La aplicación expone una respuesta JSON y una
vista HTML, seleccionando un Pokenea aleatoriamente en cada solicitud.

El proyecto está preparado para ejecutarse localmente, como contenedor Docker
y como un servicio replicado en Docker Swarm sobre instancias Amazon EC2. Las
imágenes de los Pokeneas se almacenan en Amazon S3.

## Requisitos

- Node.js 22 o superior.
- npm.
- Docker, para ejecutar la aplicación como contenedor.
- Una cuenta de AWS con permisos para S3 y EC2, para el despliegue.

## Ejecución local

Instalar dependencias:

```bash
npm install
```

Crear la configuración local:

```bash
cp .env.example .env
```

Iniciar la aplicación:

```bash
npm start
```

La aplicación queda disponible en:

- Vista HTML: <http://localhost:3000/pokenea>
- Respuesta JSON: <http://localhost:3000/api/pokenea>

También se puede acceder a la vista desde la ruta raíz:

<http://localhost:3000/>

Para desarrollo se puede usar:

```bash
npm run dev
```

## Rutas

### `GET /api/pokenea`

Devuelve aleatoriamente un Pokenea con sus datos principales y el
identificador del proceso o contenedor:

```json
{
  "id": 1,
  "nombre": "Perrillin",
  "altura": 1.7,
  "habilidad": "Nea-Mimetismo",
  "containerId": "identificador-del-contenedor"
}
```

### `GET /pokenea`

Muestra aleatoriamente:

- Nombre del Pokenea.
- Imagen.
- Frase filosófica.
- Identificador del contenedor.

En ejecución local, `containerId` puede corresponder al hostname del equipo.
Cuando la aplicación se ejecuta en Docker, corresponde al hostname del
contenedor.

## Arquitectura

El proyecto sigue una separación de responsabilidades basada en controladores,
servicios, modelos y vistas:

```text
src/
├── controllers/     Controladores HTTP
├── data/            Arreglo de Pokeneas
├── middleware/      Manejo de errores
├── models/          Modelos del dominio
├── routes/          Definición de rutas
└── services/        Lógica de aplicación reutilizable
views/               Plantillas EJS
public/              Archivos estáticos e imágenes locales
```

Responsabilidades principales:

- `routes`: conecta cada URL con su controlador. No contiene lógica de negocio.
- `controllers`: reciben la petición y envían la respuesta HTTP.
- `services`: seleccionan Pokeneas, preparan datos de respuesta, obtienen el
  identificador del contenedor y construyen las URLs de las imágenes.
- `models`: representan los Pokeneas con getters y setters.
- `data`: contiene el arreglo de Pokeneas, sin necesidad de una base de datos.
- `views`: renderiza la información recibida agrupada en el arreglo `data`.

La estructura mantiene un modelo por archivo, evita atributos `protected`,
aplica getters y setters y separa las responsabilidades de acuerdo con
principios SOLID y KISS.

## Imágenes en Amazon S3

Las imágenes deben estar cargadas en un bucket de Amazon S3. Para configurar
la aplicación, definir en `.env`:

```env
PORT=3000
S3_PUBLIC_BASE_URL=https://mi-bucket.s3.us-east-1.amazonaws.com
```

`S3_PUBLIC_BASE_URL` debe ser la URL base del bucket, sin `/` al final. La
aplicación agrega automáticamente el nombre de cada imagen:

```text
S3_PUBLIC_BASE_URL/<imageKey>
```

Los objetos deben tener permisos de lectura adecuados para que el navegador
pueda cargarlos.

Si `S3_PUBLIC_BASE_URL` está vacío, la aplicación utiliza las imágenes locales
de `public/images`. Esto permite probar el proyecto sin configurar AWS.

## Docker

Construir la imagen:

```bash
docker build -t pokeneas:local .
```

Ejecutar usando las imágenes locales incluidas en el proyecto:

```bash
docker run --rm \
  --name pokeneas-app \
  -p 3000:3000 \
  pokeneas:local
```

Ejecutar usando las imágenes almacenadas en S3:

```bash
docker run --rm \
  --name pokeneas-app \
  -p 3000:3000 \
  -e S3_PUBLIC_BASE_URL=https://mi-bucket.s3.us-east-1.amazonaws.com \
  pokeneas:local
```

Después de iniciar el contenedor, probar:

- <http://localhost:3000/pokenea>
- <http://localhost:3000/api/pokenea>

## Publicación en Docker Hub

El workflow [.github/workflows/docker-publish.yml](.github/workflows/docker-publish.yml)
publica automáticamente la imagen al hacer push a `main`.

Configurar en el repositorio de GitHub los siguientes secrets:

- `DOCKERHUB_USERNAME`: usuario de Docker Hub.
- `DOCKERHUB_TOKEN`: token de acceso de Docker Hub.

El workflow publica dos etiquetas:

- `latest`
- El SHA del commit que generó la imagen.

Para publicar manualmente:

```bash
docker login
docker tag pokeneas:local <usuario-dockerhub>/pokeneas:latest
docker push <usuario-dockerhub>/pokeneas:latest
```

## Despliegue en AWS con Docker Swarm

Utiliza cuatro instancias
Amazon EC2 con Docker instalado:

1. Crear cuatro instancias EC2 dentro de una red que permita comunicación
   entre ellas.
2. En el grupo de seguridad, permitir el puerto `3000` para acceder a la
   aplicación y los siguientes puertos entre nodos:
   - `2377/tcp`
   - `7946/tcp`
   - `7946/udp`
   - `4789/udp`
3. En la instancia líder, inicializar Docker Swarm:

```bash
docker swarm init --advertise-addr <IP_PRIVADA_LIDER>
docker swarm join-token manager
```

4. Ejecutar el comando `docker swarm join` generado por el líder en las otras
   tres instancias.
5. Verificar los nodos desde la instancia líder:

```bash
docker node ls
```

6. Crear el servicio con diez réplicas. Reemplazar los valores entre `<...>`:

```bash
docker service create \
  --name pokeneas \
  --publish published=3000,target=3000 \
  --env S3_PUBLIC_BASE_URL=https://<bucket>.s3.<region>.amazonaws.com \
  --replicas 10 \
  <usuario-dockerhub>/pokeneas:latest
```

7. Verificar el servicio:

```bash
docker service ls
docker service ps pokeneas
curl http://<IP_PUBLICA_EC2>:3000/api/pokenea
```

Al consultar varias veces `/pokenea`, el `containerId` permite comprobar que
las respuestas pueden provenir de distintos contenedores. El autoescalado no
es necesario para esta actividad.
