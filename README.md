# Plantilla Base Fullstack (.NET 10 + Angular 22 + SQL Server)
## Guía Rápida de Arquitectura y Conexión de Capas

Esta solución es la plantilla base para el desarrollo de la evaluación técnica práctica. Contiene la estructura lista y conectada para **Backend (.NET 10 + Dapper)** y **Frontend (Angular 22 Standalone)**.

---

## 🚀 1. Puesta en Marcha Rápida

### A. Base de datos (SQL Server)
1. Verifica que exista la base `PE_WINET_CRM` con la tabla `dbo.Cliente`.
2. Ejecuta el stored procedure (con `PE_WINET_CRM` seleccionada):
   ```bash
   sqlcmd -S localhost -d PE_WINET_CRM -i 02_sp_buscar_clientes.sql
   ```
   También puedes abrir el script en SQL Server Management Studio y ejecutarlo sobre `PE_WINET_CRM`.

### B. Backend (.NET 10 — Puerto `:5000`)
1. Crea la configuración local a partir del ejemplo (el archivo real no se versiona). Ya trae la cadena a SQL Server local con autenticación de Windows:
   ```bash
   cp backend/WinServices.Api.Api/appsettings.Development.json-example backend/WinServices.Api.Api/appsettings.Development.json
   ```
   Si tu instancia no es `localhost` o usas usuario y contraseña, ajusta `ConnectionStrings.DefaultConnection`:
   ```json
   "DefaultConnection": "Server=localhost;Database=PE_WINET_CRM;Trusted_Connection=True;TrustServerCertificate=True;"
   ```
2. Compila y levanta el API:
   ```bash
   cd backend/WinServices.Api.Api
   dotnet run
   ```
   - El API escuchará en `http://localhost:5000` (Documentación interactiva en `http://localhost:5000/scalar/v1`).

### C. Frontend (Angular 22 — Puerto `:4200`)
1. En otra terminal, instala paquetes e inicia el servidor:
   ```bash
   cd frontend
   npm install
   npm start
   ```
   - La aplicación abrirá en `http://localhost:4200`.
   - `npm start` genera automáticamente el archivo `.env` desde `.env.example` (con `WIN_APP_USE_MOCK=false`), por lo que consume el API real.
   - El proxy (`proxy.conf.json`) ya redirige automáticamente toda llamada a `/api/*` hacia `http://localhost:5000`.

---

## 🧩 2. Cómo se Conectan las Capas en el Backend (.NET)

Puedes tomar como referencia directa los archivos de `Example` que ya están implementados y conectados en la solución:

| Paso | Capa / Proyecto | Ubicación y Propósito | Ejemplo de Referencia |
|:---:|---|---|---|
| **1** | **Domain** | `WinServices.Api.Domain/Entities/`<br>Entidades simples con propiedades C#. | `Entities/Example.cs` |
| **2** | **Application** | `WinServices.Api.Application/`<br>• `DTOs/`: Records de entrada/salida.<br>• `Validators/`: Reglas con FluentValidation.<br>• `Interfaces/`: Contratos `IXxxRepository` e `IXxxService`.<br>• `Services/`: Lógica de negocio que retorna `Result<T>`. | `DTOs/ExampleDto.cs`<br>`Validators/CreateExampleValidator.cs`<br>`Interfaces/IExampleRepository.cs`<br>`Services/ExampleService.cs` |
| **3** | **Infrastructure** | `WinServices.Api.Infrastructure/Repositories/`<br>Hereda de `BaseRepository` y usa `ConnectionFactory.CreateConnection()` con **Dapper** (`CommandType.StoredProcedure`). | `Repositories/ExampleRepository.cs` |
| **4** | **Registro DI** | Registra tus interfaces en:<br>• `Application/DependencyInjection.cs` (`AddScoped<IMiService, MiService>()`).<br>• `Infrastructure/DependencyInjection.cs` (`AddScoped<IMiRepository, MiRepository>()`). | Ambos `DependencyInjection.cs` |
| **5** | **Api** | `WinServices.Api.Api/Controllers/`<br>Controlador REST bajo la ruta `api/v{version:apiVersion}/...`. | `Controllers/ExampleController.cs` |

---

## 💻 3. Cómo se Conectan las Capas en el Frontend (Angular)

Puedes guiarte del módulo de referencia en `frontend/src/app/features/ejemplo/`:
1. **Modelos (`models/`)**: Interfaces TypeScript para tipar las respuestas del backend.
2. **Servicios (`services/`)**: Usa `HttpClient` apuntando a `/api/v1/<recurso>`.
3. **Página / Componente (`.page.ts` y `.page.html`)**: Componente Standalone usando `ReactiveFormsModule` (`FormGroup`) o Signals, registrado en `src/app/app.routes.ts`.
4. **UI Kit Disponible (`src/app/shared/`)**: Puedes utilizar los componentes compartidos (`<app-ui-table>`, `<app-ui-modal>`, `<app-ui-toast>`, `<app-ui-combobox-async>`, `[uiButton]`, `uiBadge`) o elementos HTML con clases Tailwind CSS.

---

## 🎯 4. Solución Implementada — Ejercicio 3: Buscador Asíncrono de Clientes

### Base de datos
- Script: `02_sp_buscar_clientes.sql` → crea `dbo.usp_Cliente_Buscar` en la base `PE_WINET_CRM`.
- Filtra solo clientes activos: documento por prefijo y razón social por coincidencia parcial.
- Parámetro `@Limite` acotado entre 1 y 100.

### Backend
- Endpoint: `GET /api/v1/clientes/buscar?q=<término>&limit=<1-50>`.
- Validación con FluentValidation: mínimo 3 y máximo 100 caracteres; `limit` entre 1 y 50.
- `ClienteRepository` ejecuta el stored procedure con Dapper (`CommandType.StoredProcedure`).
- Respuestas: `200` con la lista de clientes y `400` con `{ "error": "..." }` si el término no es válido.

### Frontend
- Pantalla única en `/clientes` (la raíz `/` redirige ahí).
- Búsqueda automática con debounce de 300 ms y cancelación de peticiones obsoletas (`switchMap`).
- Lista de coincidencias y ficha de detalle del cliente seleccionado.
- Estados de carga, error y sin resultados; diseño con Angular Material + Tailwind CSS.

---

## 📤 5. Entrega del Ejercicio

1. Sube tu solución a un **repositorio público en tu cuenta de GitHub** (incluyendo el script `.sql` que hayas creado).
2. Comparte el enlace de tu repositorio con el evaluador.
