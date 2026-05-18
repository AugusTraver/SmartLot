# Tailwind

## Principios
- Usar Tailwind como sistema de diseno aplicado, no como coleccion arbitraria de clases.
- Favorecer consistencia en spacing, color, bordes, sombras y estados interactivos.
- Mantener estilos cerca del componente salvo que exista una abstraccion repetida.
- El dark mode es requisito base para SmartLot.

## Buenas Practicas
- Usar escalas consistentes: `p-4`, `gap-4`, `rounded-lg`, `border-zinc-800`, `bg-zinc-950`.
- Definir componentes reutilizables para botones, inputs, badges, cards y tablas.
- Usar `focus-visible` para accesibilidad en controles interactivos.
- Tratar estados hover, active, disabled y selected.
- Preferir clases legibles antes que composiciones demasiado largas.

## Ejemplo
```jsx
<button className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm font-medium text-zinc-100 hover:bg-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-50">
  Guardar
</button>
```

## Patrones a Evitar
- Valores arbitrarios sin necesidad: `mt-[17px]`, `text-[13.5px]`.
- Repetir largas cadenas de clases en muchos componentes.
- Contrastes bajos en dark mode.
- Usar color solo para comunicar estado sin texto, icono o forma.
