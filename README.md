# PixelVault-Front

Frontend para PixelVault – la aplicación cliente de la plataforma de descubrimiento de videojuegos. Desarrollado con **Vue 3** y **Vite**, consume la API REST del backend PixelVault-Back para gestionar usuarios, favoritos y categorías.

## Características

- Interfaz de usuario reactiva con Vue 3 (Composition API)
- Enrutamiento con Vue Router
- Autenticación mediante tokens JWT (almacenados en `localStorage` o `sessionStorage`)
- Gestión de favoritos y categorías
- Comunicación con el backend a través de Axios
- Linting y formateo de código con ESLint, Oxlint y Prettier
- Recarga en caliente

## Requisitos

- **Node.js** versión `^22.18.0` o `>=24.12.0` (se especifica en `package.json`)
- **npm** (viene con Node.js)
- **Backend en ejecución** – PixelVault-Back debe estar corriendo en `http://localhost:3000` (o la URL que se configure)

## Configuración e instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/alexei377mx/PixelVault-Front.git
```

### 2. Instalar las dependencias

```bash
npm install
```

## Ejecutar en modo desarrollo

```bash
npm run dev
```

El servidor de desarrollo estará disponible en `http://localhost:5173`. La recarga en caliente está activada para los archivos `.vue`, `.js`, etc.

## Integración con el backend

El frontend se comunica con la API REST mediante Axios. La URL base se define en la variable de entorno `VITE_API_BASE_URL`. Por defecto, todas las peticiones se envían a `http://localhost:3000`.

**Ejemplo de uso en un servicio:**

```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Interceptor para añadir el token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```
