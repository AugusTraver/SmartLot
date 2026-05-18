# React + Vite

## Principios
- Construir interfaces con componentes pequenos, composables y faciles de probar.
- Usar JavaScript moderno con imports claros, `const` por defecto y funciones puras cuando sea posible.
- Mantener Vite simple: evitar configuraciones personalizadas si no resuelven un problema real.
- Separar componentes de UI, hooks, servicios y utilidades.

## Buenas Practicas
- Crear componentes funcionales con nombres descriptivos: `ParkingTable`, `OccupancyCard`, `RevenueChart`.
- Mantener estado local cerca de donde se usa.
- Extraer hooks cuando una logica se reutiliza o mezcla efectos, eventos y transformaciones.
- Usar `useMemo` y `useCallback` solo cuando haya costo real o estabilidad necesaria para hijos memoizados.
- Centralizar llamadas HTTP en una capa de servicios.

## Ejemplo
```jsx
function OccupancyCard({ label, occupied, total }) {
  const percent = total === 0 ? 0 : Math.round((occupied / total) * 100)

  return (
    <section className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
      <p className="text-sm text-zinc-400">{label}</p>
      <strong className="text-2xl text-zinc-50">{percent}%</strong>
    </section>
  )
}
```

## Patrones a Evitar
- Componentes grandes que mezclan fetch, transformacion de datos y layout.
- Estados globales para datos que solo usa una pantalla.
- Efectos sin dependencias claras.
- Configuracion de Vite innecesaria o dificil de mantener.
