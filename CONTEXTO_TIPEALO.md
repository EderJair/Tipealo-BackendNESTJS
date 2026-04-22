# Contexto del Proyecto Tipealo — Para Claude

## Quién soy

Me llamo Jair (EderJair en GitHub). Soy ingeniero de software con experiencia en:
- TypeScript, NestJS, React, Next.js
- Java (aprendiendo — hice este backend para ayudar a mi primo)
- Vivo en Perú

Mi email de GitHub: operaciones@hannahlab.com (pero el repo está en cuenta EderJair)

---

## Qué es Tipealo

SaaS para vendedores de mercados informales en Perú. El problema: todos usan cuadernos y papelitos para llevar sus cuentas. Tipealo los reemplaza con el celular.

### Usuarios objetivo
Vendedores de mercados peruanos: especierías, abarrotes, almuerzos, verduras, ropa, ceviche, etc.

### Modelo de negocio
Multi-tenant SaaS — cada vendedor se registra y solo ve su propia data.

### Módulos definidos
1. **Auth** — registro y login con JWT
2. **Clientes** — los compradores del vendedor
3. **Productos** — inventario con alertas de stock bajo
4. **Fiados** — cuentas por cobrar con fechas de vencimiento y registro de pagos parciales
5. **Ventas** — registro de ventas del día (contado o fiado)
6. **Dashboard** — resumen con alertas (stock bajo, fiados vencidos, totales del día/mes)

---

## Lo que ya existe (backend Java - para el primo)

Repositorio: https://github.com/EderJair/Tipealo-Backend

Stack:
- Java 21
- Spring Boot 3.5.13
- Maven
- PostgreSQL en Neon (neon.tech)
- JWT con jjwt 0.12.6
- Lombok
- Spring Security

### Endpoints implementados en Java

| Módulo | Endpoints |
|---|---|
| Auth | POST /api/auth/register, POST /api/auth/login |
| Clientes | GET/POST /api/clientes, GET/PUT/DELETE /api/clientes/{id} |
| Productos | GET/POST /api/productos, GET/PUT/DELETE /api/productos/{id}, GET /api/productos/stock-bajo, PATCH /api/productos/{id}/stock |
| Fiados | GET/POST /api/fiados, GET /api/fiados/pendientes, GET /api/fiados/vencidos, POST /api/fiados/{id}/pagar, DELETE /api/fiados/{id} |
| Ventas | GET/POST /api/ventas, GET /api/ventas/hoy, DELETE /api/ventas/{id} |
| Dashboard | GET /api/dashboard |

### Estructura del proyecto Java
```
src/main/java/com/tipealo/api/
├── controller/
│   ├── AuthController.java
│   ├── ClienteController.java
│   ├── ProductoController.java
│   ├── FiadoController.java
│   ├── VentaController.java
│   ├── DashboardController.java
│   └── TestController.java
├── service/
│   ├── AuthService.java
│   ├── ClienteService.java
│   ├── ProductoService.java
│   ├── FiadoService.java
│   ├── VentaService.java
│   ├── DashboardService.java
│   └── UserService.java
├── entity/
│   ├── User.java
│   ├── Cliente.java
│   ├── Producto.java
│   ├── Fiado.java
│   ├── PagoFiado.java
│   ├── Venta.java
│   ├── VentaDetalle.java
│   └── enums/
│       ├── EstadoFiado.java   (PENDIENTE, PAGADO, VENCIDO)
│       └── TipoVenta.java     (CONTADO, FIADO)
├── repository/
│   ├── UserRepository.java
│   ├── ClienteRepository.java
│   ├── ProductoRepository.java
│   ├── FiadoRepository.java
│   ├── PagoFiadoRepository.java
│   └── VentaRepository.java
├── security/
│   ├── JwtUtil.java
│   ├── JwtFilter.java
│   ├── SecurityConfig.java
│   └── UserDetailsServiceImpl.java
└── dto/
    ├── cliente/
    ├── producto/
    ├── fiado/
    ├── venta/
    └── dashboard/
```

---

## Lo que hay que construir ahora: NestJS Backend

Este es el backend REAL de producción de Tipealo. El Java fue para el primo.

### Stack a usar
- NestJS (TypeScript)
- PostgreSQL en Neon (misma DB o nueva)
- TypeORM o Prisma (a definir)
- JWT con @nestjs/jwt
- Bcrypt para passwords
- class-validator para validaciones

### Mismos módulos, misma lógica
La arquitectura ya está definida en Java. Solo hay que replicar la misma lógica en NestJS:

**Entidades:**
- User (id, email, password, name, createdAt)
- Cliente (id, nombre, telefono, direccion, notas, userId, createdAt)
- Producto (id, nombre, descripcion, precio, stock, stockMinimo, unidad, userId, createdAt)
- Fiado (id, clienteId, userId, monto, montoPagado, fechaVencimiento, estado, notas, createdAt)
- PagoFiado (id, fiadoId, monto, notas, fecha)
- Venta (id, userId, clienteId nullable, total, tipo, notas, fecha)
- VentaDetalle (id, ventaId, productoId, cantidad, precioUnitario, subtotal)

**Reglas de negocio importantes:**
- Multi-tenant: cada vendedor solo ve su data (filtrar siempre por userId)
- Fiados: al registrar un pago, si montoPagado >= monto → estado = PAGADO
- Fiados: auto-detectar vencidos (fechaVencimiento <= hoy && estado = PENDIENTE → VENCIDO)
- Ventas: al crear una venta, descontar stock del producto automáticamente
- Ventas: validar que haya stock suficiente antes de confirmar
- Dashboard: alertas automáticas de stock bajo y fiados vencidos

### Carpeta del proyecto
Crear en: C:\Users\Usuario\Desktop\Tipealo-Backend\nest-api

### Comandos para arrancar
```bash
nest new nest-api
cd nest-api
```

### Dependencias a instalar
```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs
npm install @nestjs/typeorm typeorm pg
npm install class-validator class-transformer
npm install -D @types/bcryptjs @types/passport-jwt
```

---

## Base de datos (Neon)

Ya existe un proyecto en Neon llamado "Tipealo" en AWS US East 2 (Ohio).
El backend Java ya creó las tablas automáticamente con ddl-auto: update.
Para NestJS usar synchronize: true en desarrollo.

---

## Preferencias del desarrollador

- Le gusta que le expliquen qué hace cada cosa mientras se construye
- Viene de NestJS/React/Next.js — explicar Java en términos de NestJS fue útil
- Prefiere respuestas directas y concisas
- No usar emojis
- El proyecto es para lanzar un producto real, no solo aprender

---

## Contexto del equipo

- **Jair** — lead developer, full stack TS
- **Primo** — universitario, curso de Java, ya tiene el backend Java para presentar
- Están en Perú, mercado objetivo: vendedores informales de mercados peruanos
