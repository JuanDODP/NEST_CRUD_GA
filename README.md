<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# CRUDGA API (SQL Server)

Este es un sistema de gestión desarrollado con **NestJS** y **SQL Server**, diseñado para entornos de desarrollo utilizando Docker. Está optimizado para arquitecturas Apple Silicon (M1, M2, M3, M4) y Windows.

## Requisitos Previos
* [Node.js](https://nodejs.org/) (Versión 18 o superior)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* [TablePlus](https://tableplus.com/) (Recomendado para la gestión de base de datos)

## Pasos para ejecutar en local

1. Clonar proyecto
2. ```npm install```
3. Clonar el archivo ```.env.example``` y renombrarlo a ```.env```
4. Cambiar las variables de entorno (Asegúrate de que DB_PASSWORD sea fuerte)
5. Configurar la Base de Datos (Elegir una opción):

   **Opción A: Docker (Recomendado para Mac M1/M2/M4 y Linux)**
   Levanta el contenedor preconfigurado:
   ```bash
   docker compose up -d
6. ``Opción B:`` Instalación Local (Directo en el motor de SQL Server) Si ya tienes SQL Server instalado en tu sistema (Express o Developer Edition):

Asegúrate de que el servicio esté corriendo en el puerto 1433.

Verifica que el usuario `sa` esté habilitado y tenga la misma contraseña del archivo .env.
7. Crear la base de datos manualmente en TablePlus (o tu gestor preferido): SQL ``CREATE DATABASE CRUDGA_DB;``
8. npm run start:dev
