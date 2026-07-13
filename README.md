# 💈 Barber Studio - Sistema de Gestión de Turnos

> **Aviso:** Este es un proyecto experimental diseñado como demostración técnica y pieza de portafolio. No corresponde a un dominio o negocio real en producción.

## 📝 Descripción

Barber Studio es una aplicación web Full-Stack orientada a la gestión integral de una barbería clásica y moderna. Permite a los clientes explorar servicios y solicitar turnos de manera intuitiva, mientras que proporciona a la administración un *Dashboard* completo para gestionar la agenda, el catálogo de servicios, la disponibilidad de los barberos y la base de datos de clientes.

## ✨ Características Principales

### 👨‍💻 Interfaz Pública (clientes)
* **Catálogo Dinámico:** Visualización atractiva de servicios de barbería (cortes, barba, tratamientos), duraciones y precios actualizados.
* **Reserva de Turnos (Wizard):** Flujo paso a paso validado para seleccionar servicio, barbero, fecha y hora.
* **Integración Inteligente:** Derivación automática a WhatsApp con un mensaje pre-armado resumiendo los datos de la reserva para su confirmación final.

### 🔐 Panel de Administración (Dashboard)
* **Métricas (KPIs):** Resumen visual de turnos del día, solicitudes pendientes e ingresos estimados.
* **Agenda Interactiva:** Calendario dinámico con vistas por mes, semana y día.
* **Gestor de Catálogo:** Creación, edición y actualización de servicios sin necesidad de tocar el código.
* **Mini-CRM:** Base de datos de clientes con historial de visitas y accesos rápidos de contacto.

## 🛠️ Stack Tecnológico

El proyecto está dividido en una arquitectura Frontend/Backend moderna:

**Frontend:**
* React + Vite
* TypeScript
* Tailwind CSS (v4 - Custom Dark Theme)
* React Router DOM (Navegación protegida y pública)
* React Big Calendar (Manejo de fechas y agenda)
* Lucide React (Iconografía)

**Backend & Base de Datos:**
* Node.js + Express
* Mongoose
* MongoDB (Base de Datos NoSQL)

## 🚀 Instalación y Ejecución Local

Para correr este proyecto en tu entorno local, asegúrate de tener `pnpm` y Node.js instalados.

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/barber-studio.git
   cd barber-studio
   ```
2. **Configuración del Backend:**
   ```bash
   cd backend
   pnpm install
   ```
  * Crea un archivo `.env` en la carpeta backend con tu cadena de conexión de MongoDB:
    ```env
    MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/barber-studio
    PORT=3000
    ```
  * Inicia el servidor de desarrollo:
    ```bash
    pnpm run dev
    ```
3. **Configuración del Frontend:**
   En otra terminal:
   ```bash
   cd frontend
   pnpm install
   pnpm dev
   ```
  * La aplicación estará disponible en http://localhost:5173

## 👤 Autor
Desarrollado y refactorizado por Abril Gavilan.
