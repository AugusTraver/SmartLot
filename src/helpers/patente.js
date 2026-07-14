export const normalizarPatente = (valor = "") =>
  String(valor).trim().replace(/[\s-]/g, "").toUpperCase();
