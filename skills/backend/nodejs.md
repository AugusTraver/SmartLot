# Node.js

## Principios
- Usar JavaScript moderno, asincronia clara y modulos organizados por responsabilidad.
- Mantener controladores delgados y mover reglas de negocio a servicios.
- Validar datos de entrada antes de ejecutar logica de dominio.
- Manejar errores de forma consistente y observable.

## Buenas Practicas
- Separar rutas, controladores, servicios, repositorios y middlewares.
- Usar `async/await` con manejo explicito de errores.
- Centralizar configuracion en variables de entorno validadas.
- Evitar dependencias pesadas si una solucion simple del stack alcanza.
- Escribir funciones pequenas para calculos de tarifas, ocupacion y disponibilidad.

## Ejemplo
```js
export async function getParkingOccupancy(req, res, next) {
  try {
    const result = await parkingService.getOccupancy(req.params.parkingId)
    res.json({ data: result })
  } catch (error) {
    next(error)
  }
}
```

## Patrones a Evitar
- Logica de negocio dentro de rutas.
- Respuestas de error con formatos distintos.
- Acceso directo a base de datos desde componentes de UI.
- Variables de entorno leidas en cualquier parte del codigo.
