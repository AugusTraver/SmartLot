# API Design

## Principios
- Disenar APIs predecibles, versionables y faciles de consumir desde dashboards.
- Usar nombres de recursos claros: `parkings`, `spots`, `tickets`, `payments`, `users`, `reports`.
- Responder siempre con estructuras consistentes.
- Separar errores de validacion, autenticacion, permisos y fallas internas.

## Convenciones
- `GET /api/parkings` lista estacionamientos.
- `GET /api/parkings/:id/occupancy` devuelve ocupacion.
- `POST /api/tickets` crea un ticket de ingreso.
- `PATCH /api/tickets/:id/checkout` registra salida.
- `GET /api/reports/revenue?from=&to=` devuelve ingresos por periodo.

## Buenas Practicas
- Usar paginacion en listados grandes.
- Permitir filtros explicitos para tablas: fecha, estado, playa, zona.
- Devolver fechas en ISO 8601.
- Usar codigos HTTP correctos y mensajes de error accionables.
- Mantener contratos estables para evitar romper el frontend.

## Ejemplo
```json
{
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 25,
    "total": 0
  }
}
```

## Patrones a Evitar
- Endpoints que mezclan multiples responsabilidades.
- Respuestas distintas para recursos similares.
- Filtros implicitos o dependientes del frontend.
- Enviar datos sensibles innecesarios.
