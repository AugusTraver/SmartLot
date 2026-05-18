# Componentes Reutilizables

## Principios
- Crear componentes reutilizables cuando reduzcan duplicacion real o estandaricen comportamiento.
- Separar componentes base, componentes de dominio y pantallas.
- Un componente debe tener una API simple y predecible.
- La composicion debe ser preferida sobre props excesivas.

## Estructura Recomendada
- `components/ui`: botones, inputs, modales, tabs, badges, tablas base.
- `components/dashboard`: cards metricas, charts, paneles de actividad.
- `components/parking`: componentes especificos de estacionamientos.
- `hooks`: logica reutilizable de estado, datos y eventos.
- `services`: comunicacion con APIs.

## Buenas Practicas
- Usar props explicitas: `variant`, `size`, `disabled`, `isLoading`.
- Mantener accesibilidad: labels, roles, foco visible y navegacion por teclado.
- Crear estados visuales consistentes para success, warning, danger, neutral e info.
- Documentar con ejemplos breves si el componente tiene variantes.

## Patrones a Evitar
- Componentes genericos con demasiadas responsabilidades.
- Props booleanas multiples que generan combinaciones ambiguas.
- Estilos duplicados entre botones, inputs o badges.
- Componentes que hacen fetch interno sin necesidad.
