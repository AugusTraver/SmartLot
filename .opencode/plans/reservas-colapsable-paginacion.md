# Plan: Tabla de Reservas Colapsable con Paginación Real

## Archivos a modificar

### 1. `src/componentesAdmin/tabla_reservas_panelControl.jsx`

#### 1.1 Imports
- Agregar `useCallback` a import de React
- Agregar `ChevronDown, ChevronUp` a import de lucide-react

#### 1.2 Constantes y estado
```jsx
const ITEMS_PER_PAGE = 3;

// Dentro del componente, después de los estados existentes:
const [isOpen, setIsOpen] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
```

#### 1.3 Resetear página al cambiar búsqueda o filtro
Agregar un `useEffect` que resetea `currentPage` a 1 cuando cambia `searchTerm` o `activeChip`:
```jsx
useEffect(() => {
  setCurrentPage(1);
}, [searchTerm, activeChip]);
```

Agregar después de `filteredData`:
```jsx
const totalPages = useMemo(() => {
  return Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
}, [filteredData]);

const paginatedData = useMemo(() => {
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  return filteredData.slice(start, start + ITEMS_PER_PAGE);
}, [filteredData, currentPage]);

const currentPageData = useMemo(() => {
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
    return [];
  }
  return paginatedData;
}, [paginatedData, currentPage, totalPages]);
```

Mejor evitar setState dentro de useMemo. Usar un clamp más simple:

```jsx
const totalPages = useMemo(() => {
  return Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
}, [filteredData]);

const paginatedData = useMemo(() => {
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  return filteredData.slice(start, start + ITEMS_PER_PAGE);
}, [filteredData, currentPage]);
```

Y un useEffect para clamp de página:
```jsx
useEffect(() => {
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }
}, [currentPage, totalPages]);
```

#### 1.4 Navegación
```jsx
const goToPrevPage = useCallback(() => {
  setCurrentPage(p => Math.max(p - 1, 1));
}, []);

const goToNextPage = useCallback(() => {
  setCurrentPage(p => Math.min(p + 1, totalPages));
}, [totalPages]);

const goToPage = useCallback((page) => {
  setCurrentPage(page);
}, []);
```

#### 1.5 Generar botones de página
```jsx
const pageButtons = useMemo(() => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  return pages;
}, [totalPages]);
```

#### 1.6 Render - Estructura del desplegable

Envolver TODO el contenido (filter-bar, chips, tabla, paginación) dentro de:

```jsx
<div className="reservations-container">
  {/* HEADER COLABSABLE */}
  <button
    className="reservations-toggle"
    onClick={() => setIsOpen(o => !o)}
    aria-expanded={isOpen}
  >
    <span className="reservations-toggle__left">
      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      <span className="reservations-toggle__title">Reservas</span>
    </span>
    <span className="reservations-toggle__count">
      {reservasNormalizadas.length} reserva{reservasNormalizadas.length !== 1 ? 's' : ''}
    </span>
  </button>

  {/* CONTENIDO COLABSABLE */}
  {isOpen && (
    <div className="reservations-collapse">
      {/* filter-bar, chips, tabla, paginación (todo lo que ya existe) */}
    </div>
  )}
</div>
```

#### 1.7 Render - Tabla: usar `paginatedData` en vez de `filteredData`

Cambiar:
```jsx
{filteredData.length === 0 ? (
  ...
) : (
  filteredData.map(...)
)}
```
a:
```jsx
{paginatedData.length === 0 ? (
  ...
) : (
  paginatedData.map(...)
)}
```

#### 1.8 Render - Paginación funcional

Reemplazar el footer de paginación con:

```jsx
<footer className="pagination">
  <span className="pagination__info">
    {loading
      ? "Cargando..."
      : totalPages <= 1
        ? `Mostrando ${filteredData.length} de ${reservasNormalizadas.length} reservas`
        : `Página ${currentPage} de ${totalPages} (${filteredData.length} reservas)`
    }
  </span>
  {totalPages > 1 && (
    <div className="pagination__controls">
      <button
        className="pagination__btn"
        onClick={goToPrevPage}
        disabled={currentPage <= 1}
        aria-label="Página anterior"
      >
        <ChevronLeft size={18} />
      </button>
      {pageButtons.map(page => (
        <button
          key={page}
          className={`pagination__btn ${currentPage === page ? "pagination__btn--active" : ""}`}
          onClick={() => goToPage(page)}
        >
          {page}
        </button>
      ))}
      <button
        className="pagination__btn"
        onClick={goToNextPage}
        disabled={currentPage >= totalPages}
        aria-label="Siguiente página"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )}
</footer>
```

---

### 2. `src/componentesAdmin/tabla_reservas_panelControl.css`

Agregar ANTES de `/* --- Control de Paginación --- */` (después de línea 228):

```css
/* --- Header Desplegable --- */
.reservations-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 1rem 1.25rem;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  cursor: pointer;
  font-family: inherit;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  margin-bottom: 1rem;
}

.reservations-toggle:hover {
  background-color: #f8fafc;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.reservations-toggle__left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #0f172a;
}

.reservations-toggle__title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
}

.reservations-toggle__count {
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  background-color: #f1f5f9;
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
}

.reservations-collapse {
  animation: fadeSlideDown 0.25s ease-out both;
}

@keyframes fadeSlideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### 2.1 Paginación - Estilo para botón disabled

```css
.pagination__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination__btn:disabled:hover {
  background-color: #e2e8f0;
}
```

---

## Resumen de cambios

| Archivo | Cambio |
|---------|--------|
| JSX (imports) | +`useCallback`, +`ChevronDown`, +`ChevronUp` |
| JSX (state) | +`isOpen`, +`currentPage` |
| JSX (effects) | +reset page on filter/search change, +clamp page |
| JSX (memo) | +`totalPages`, +`paginatedData`, +`pageButtons` |
| JSX (callbacks) | +`goToPrevPage`, +`goToNextPage`, +`goToPage` |
| JSX (render) | Envolver en header colapsable + toggle; usar `paginatedData`; paginación funcional |
| CSS | +`.reservations-toggle`, +`.reservations-collapse`, +keyframes, +disabled state |
