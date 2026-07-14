import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const dashboardPath = new URL("./garagista_dashboard.jsx", import.meta.url);

test("el dashboard no muestra ni mapea una plaza", async () => {
  const source = await readFile(dashboardPath, "utf8");
  assert.doesNotMatch(source, /nro_plaza|reserva\.plaza|>Plaza</i);
});

test("Autos dentro abre la verificación de salida sin mostrar la patente", async () => {
  const source = await readFile(dashboardPath, "utf8");
  assert.match(source, /abrirVerificacionSalida\(reserva\)/);
  assert.match(source, />\s*Verificar salida\s*</);
  assert.match(source, /tipoVerificacion === "ingreso" \? <small>Patente/);
});

test("la salida contempla patente incorrecta, confirmación y error del servidor", async () => {
  const source = await readFile(dashboardPath, "utf8");
  assert.match(source, /La patente ingresada no coincide con el vehículo registrado/);
  assert.match(source, /ReservasCheckOut\(reservaSeleccionada\.id\)/);
  assert.match(source, /Confirmar salida/);
  assert.match(source, /No se pudo registrar la salida en el servidor/);
});

test("mapea la hora real de entrada tanto en snake_case como camelCase", async () => {
  const source = await readFile(dashboardPath, "utf8");
  assert.match(source, /reserva\.fecha_entrada_real/);
  assert.match(source, /reserva\.fechaEntradaReal/);
  assert.match(source, /reserva\.hora_entrada_real/);
  assert.match(source, /reserva\.horaEntradaReal/);
  assert.match(source, /reserva\.hora_ingreso/);
  assert.match(source, /horaEntrada: obtenerHoraEntradaReal\(r\)/);
});

test("Últimos movimientos muestra la hora real de salida", async () => {
  const source = await readFile(dashboardPath, "utf8");
  assert.match(source, /reserva\.fecha_salida_real/);
  assert.match(source, /reserva\.fechaSalidaReal/);
  assert.match(source, /reserva\.salida/);
  assert.match(source, /reserva\.hora_egreso/);
  assert.match(source, /reserva\.horaSalida \? <span>Salida real/);
  assert.doesNotMatch(source, /Salida real \{reserva\.horaSalida \|\| "--:--"\}/);
});
