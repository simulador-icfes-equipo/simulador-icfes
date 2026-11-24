# Informe Técnico: Desarrollo de Pruebas Unitarias, Integración y Pipeline CI

**Estudiante:** Norman Davey Bravo  
**Proyecto:** Simulador Saber 11 / ICFES (Backend API Express + Sequelize)  
**Repositorio GitHub:** [https://github.com/simulador-icfes-equipo/simulador-icfes.git](https://github.com/simulador-icfes-equipo/simulador-icfes.git)  
**Rama de trabajo:** `Norman-Pruebas`  
**Estado de Pruebas:** 20/20 Exitosas (5 Test Suites)

---

## 1. Fichas Técnicas de Pruebas Unitarias

### Prueba Unitaria 1: Capa de Controlador (Controller)

| Campo | Detalle |
| :--- | :--- |
| **Nombre del Estudiante** | Norman Davey Bravo |
| **Capa probada** | Controller (`src/controllers/AreaController.js`) |
| **Elemento a validar** | Método `crear`: Valida que ante un payload válido, se invoque al servicio `AreaService.crear` y se retorne una respuesta HTTP 201 (Created) con la estructura JSON estándar de éxito y la entidad creada. |
| **Datos de entrada (Payload/Mock)** | `req.body`: `{"nombre_area": "Ciencias Naturales", "descripcion": "Área enfocada en biología, química y física"}`<br>Mock del servicio: `mockAreaService.crear.mockResolvedValue({"id_area": 1, "nombre_area": "Ciencias Naturales", "descripcion": "..."})` |
| **Resultado esperado** | Código HTTP **201** y cuerpo de respuesta: `{"success": true, "message": "Área creada correctamente.", "data": {"id_area": 1, "nombre_area": "Ciencias Naturales", "descripcion": "..."}}` |

---

### Prueba Unitaria 2: Capa de Servicio / Lógica de Negocio (Service)

| Campo | Detalle |
| :--- | :--- |
| **Nombre del Estudiante** | Norman Davey Bravo |
| **Capa probada** | Service (`src/services/AreaService.js`) |
| **Elemento a validar** | Método `crear`: Valida la regla de negocio que prohíbe nombres de área duplicados. Si `areaRepository.obtenerPorNombre` encuentra un registro existente, se lanza una excepción inmediata sin llamar a `crear` del repositorio. |
| **Datos de entrada (Payload/Mock)** | Parámetro `area`: `{"nombre_area": "Matemáticas", "descripcion": "Preguntas cuantitativas"}`<br>Mock de repositorio: `mockAreaRepository.obtenerPorNombre.mockResolvedValue({"id_area": 1, "nombre_area": "Matemáticas"})` |
| **Resultado esperado** | Excepción esperada: `Error("Ya existe un área con ese nombre.")`. El método `areaRepository.crear` no es ejecutado (0 llamadas). |

---

### Prueba Unitaria 3: Capa de Repositorio (Repository / Persistencia)

| Campo | Detalle |
| :--- | :--- |
| **Nombre del Estudiante** | Norman Davey Bravo |
| **Capa probada** | Repository (`src/repositories/AreaRepository.js`) |
| **Elemento a validar** | Método `obtenerPorId`: Valida que el repositorio invoque adecuadamente la función `findByPk` del modelo Sequelize `Area` con el identificador numérico y retorne el objeto encontrado sin alteraciones. |
| **Datos de entrada (Payload/Mock)** | Parámetro: `id_area: 1`<br>Mock Sequelize: `Area.findByPk.mockResolvedValue({"id_area": 1, "nombre_area": "Lectura Crítica", "descripcion": "Comprensión lectora"})` |
| **Resultado esperado** | Invocación `Area.findByPk(1)` exactamente 1 vez y retorno del registro: `{"id_area": 1, "nombre_area": "Lectura Crítica", "descripcion": "Comprensión lectora"}` |

---

### Prueba Unitaria 4: Capa de Middleware / Seguridad (Middleware)

| Campo | Detalle |
| :--- | :--- |
| **Nombre del Estudiante** | Norman Davey Bravo |
| **Capa probada** | Middleware (`src/middlewares/auth.js` - `permitirRoles`) |
| **Elemento a validar** | Función `permitirRoles("admin", "gestor")`: Valida el control de acceso por roles (RBAC). Si el usuario autenticado posee un rol no autorizado (ej. `estudiante`), se deniega el acceso con HTTP 403 y se detiene la cadena sin llamar a `next()`. |
| **Datos de entrada (Payload/Mock)** | Configuración: `permitirRoles("admin", "gestor")`<br>Mock `req.usuario`: `{"id_usuario": 5, "rol": "estudiante"}` |
| **Resultado esperado** | Código HTTP **403**, cuerpo JSON `{"mensaje": "No tienes permisos para realizar esta acción."}` y función `next()` sin ejecutar. |

---

## 2. Ficha Técnica de Prueba de Integración

| Campo | Detalle |
| :--- | :--- |
| **Nombre del Estudiante** | Norman Davey Bravo |
| **Componentes integrados** | **Express Router + Controller + Service + Base de Datos de Pruebas** |
| **Elemento a validar** | Flujo completo de creación y consulta: Cliente HTTP (mediante `supertest`) envía `POST /api/areas`; el Router recibe la solicitud, invoca `AreaController.crear`, que valida y ejecuta la lógica real de negocio en `AreaService.crear`, persistiendo en el almacenamiento de pruebas. Se verifica la respuesta HTTP 201 y la persistencia en el almacenamiento de base de datos. |
| **Datos de entrada (Payload)** | `POST /api/areas`<br>`Content-Type: application/json`<br>`{"nombre_area": "Ciencias Naturales", "descripcion": "Biología y Física"}` |
| **Resultado esperado** | Código HTTP **201 Created**, persistencia verificada en la base de datos de pruebas (total elementos = 3) y cuerpo de respuesta: `{"success": true, "message": "Área creada correctamente.", "data": {"id_area": 3, "nombre_area": "Ciencias Naturales", "descripcion": "Biología y Física"}}` |

---

## 3. Automatización con Pipeline (CI) - GitHub Actions

Archivo: `.github/workflows/ci.yml`

- **Disparadores (Triggers):** Activación automática en cada `push` sobre `main`, `master` y `Norman-Pruebas`, y en cada `pull_request` hacia `main` o `master`.
- **Estrategia Matrix:** Ejecución cruzada en versiones de Node.js `18.x`, `20.x`, `22.x` en runner `ubuntu-latest`.
- **Pasos:**
  1. Descarga del código (`actions/checkout@v4`).
  2. Configuración del runtime de Node.js con caché de npm (`actions/setup-node@v4`).
  3. Instalación de dependencias (`npm ci || npm install`).
  4. Ejecución automatizada de la suite completa con cálculo de cobertura (`npm run test:coverage`).

---

## 4. Evidencias Gráficas

### 4.1. Ejecución de Pruebas en Local (Consola)
```bash
npm test
```
**Salida obtenida:**
```text
PASS tests/integration/AreaIntegration.test.js
PASS tests/unit/AreaController.test.js
PASS tests/unit/authMiddleware.test.js
PASS tests/unit/AreaService.test.js
PASS tests/unit/AreaRepository.test.js

Test Suites: 5 passed, 5 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        1.204 s
Ran all test suites.
```

### 4.2. Reporte de Cobertura de Código
```bash
npm run test:coverage
```
**Salida de tabla de cobertura:**
```text
--------------------|---------|----------|---------|---------|------------------------------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                        
--------------------|---------|----------|---------|---------|------------------------------------------
All files           |   45.86 |    41.26 |   44.82 |   47.28 |                                          
 controllers        |   38.46 |    36.36 |    37.5 |   38.46 |                                          
  AreaController.js |   38.46 |    36.36 |    37.5 |   38.46 | 7-14,18-29,62-64,104-138,146-173,181-192 
 middlewares        |   71.42 |    53.84 |      60 |   78.94 |                                          
  auth.js           |   71.42 |    53.84 |      60 |   78.94 | 28-31                                    
 repositories       |   38.88 |        0 |      50 |   41.17 |                                          
  AreaRepository.js |   38.88 |        0 |      50 |   41.17 | 6,25-32,41-73                            
 services           |   48.27 |    45.83 |    37.5 |      50 |                                          
  AreaService.js    |   48.27 |    45.83 |    37.5 |      50 | 7-13,52-79                               
--------------------|---------|----------|---------|---------|------------------------------------------
```

---

## 5. Guía del Flujo de Trabajo en Git

1. **Crear rama individual de trabajo:**
   ```bash
   git checkout -b Norman-Pruebas
   ```
2. **Añadir archivos modificados y nuevos:**
   ```bash
   git add package.json package-lock.json .gitignore .github/ tests/ INFORME_ENTREGABLE_PRUEBAS.html INFORME_ENTREGABLE_PRUEBAS.md Ficha_Tecnica_Pruebas_Norman.pdf
   ```
3. **Realizar commit individual:**
   ```bash
   git commit -m "feat(testing): agregar pruebas unitarias, prueba de integracion y pipeline CI"
   ```
4. **Subir rama a GitHub:**
   ```bash
   git push -u origin Norman-Pruebas
   ```
5. **Abrir Pull Request en GitHub:**
   - Navega al repositorio en GitHub: `https://github.com/simulador-icfes-equipo/simulador-icfes`.
   - Selecciona `Compare & pull request` desde la rama `Norman-Pruebas` hacia `main`.
   - Observa la ejecución automática del Action "CI Pipeline - Simulador ICFES" en la pestaña de verificaciones del PR.
6. **Aprobación y Merge:**
   - Tras validar que el pipeline esté en verde, se aprueba el PR y se integra a la rama `main`.
