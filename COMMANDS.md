# Guía de Comandos - AGR Nomin

Aquí tienes los comandos necesarios para operar el sistema.

## 1. Base de Datos (Docker)
Antes de nada, asegúrate de que **Docker Desktop** esté abierto.

*   **Iniciar Base de Datos**:
    ```bash
    docker start agr_nomin_db
    ```
*   **Detener Base de Datos**:
    ```bash
    docker stop agr_nomin_db
    ```

## 2. Aplicación Web (Next.js)
*   **Iniciar App**:
    ```bash
    npm run dev
    ```
    *Ver en: http://localhost:3000*

*   **Detener App**:
    Presiona `Ctrl + C` en la terminal donde se está ejecutando.

## 3. Visualizador de Base de Datos (Prisma Studio)
*   **Abrir Visualizador**:
    ```bash
    npx prisma studio
    ```
    *Ver en: http://localhost:5555*

*   **Detener Visualizador**:
    Presiona `Ctrl + C` en la terminal.

---

### Notas Adicionales
- Si reinicias la computadora, solo necesitas correr `docker start agr_nomin_db` y luego `npm run dev`.
- Si haces cambios en `prisma/schema.prisma`, recuerda correr:
  ```bash
  npx prisma migrate dev
  ```
