export const DIAS_SEMANA = [
  { display: 'Lunes', api: 'Lunes' },
  { display: 'Martes', api: 'Martes' },
  { display: 'Miércoles', api: 'Miercoles' },
  { display: 'Jueves', api: 'Jueves' },
  { display: 'Viernes', api: 'Viernes' },
  { display: 'Sábado', api: 'Sabado' },
  { display: 'Domingo', api: 'Domingo' },
];

export const getDiaDisplay = (apiDay) => {
  const found = DIAS_SEMANA.find(d => d.api === apiDay);
  return found ? found.display : apiDay;
};

export const getDiaDesdeFecha = (fechaStr) => {
  if (!fechaStr) return '';
  const date = new Date(fechaStr + 'T12:00:00');
  const dayIndex = date.getDay();
  const idx = dayIndex === 0 ? 6 : dayIndex - 1;
  return DIAS_SEMANA[idx].api;
};
