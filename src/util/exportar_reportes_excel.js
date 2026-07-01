// src/utils/exportarReporteExcel.js

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const aplicarEstiloTitulo = (celda) => {
  celda.font = {
    bold: true,
    size: 18,
    color: { argb: "FFFFFFFF" },
  };

  celda.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF4F46E5" },
  };

  celda.alignment = {
    vertical: "middle",
    horizontal: "center",
  };
};

const aplicarEstiloHeader = (fila) => {
  fila.eachCell((celda) => {
    celda.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
    };

    celda.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF111827" },
    };

    celda.alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    celda.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });
};

const aplicarBordes = (worksheet) => {
  worksheet.eachRow((fila) => {
    fila.eachCell((celda) => {
      celda.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      celda.alignment = {
        vertical: "middle",
      };
    });
  });
};

const ajustarColumnas = (worksheet) => {
  worksheet.columns.forEach((columna) => {
    let maxLength = 12;

    columna.eachCell({ includeEmpty: true }, (celda) => {
      const valor = celda.value ? celda.value.toString() : "";
      maxLength = Math.max(maxLength, valor.length);
    });

    columna.width = maxLength + 4;
  });
};

const obtenerFechaActual = () => {
  return new Date().toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });
};

const insertarLogoSmartLot = (workbook, worksheet, logoBase64) => {
  if (!logoBase64) return;

  const logoId = workbook.addImage({
    base64: logoBase64,
    extension: "png",
  });

  worksheet.addImage(logoId, {
    tl: { col: 3, row: 0 },
    ext: { width: 210, height: 62 },
  });

  for (let fila = 1; fila <= 3; fila += 1) {
    worksheet.getRow(fila).height = Math.max(worksheet.getRow(fila).height || 15, 22);
  }
};

const insertarGraficoTendencia = (workbook, worksheet, graficoTendencia) => {
  const tituloGrafico = worksheet.getCell("D4");

  worksheet.mergeCells("D4:J4");
  tituloGrafico.value = "Grafico de tendencia de ocupacion";
  tituloGrafico.font = {
    bold: true,
    size: 14,
    color: { argb: "FFFFFFFF" },
  };
  tituloGrafico.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF111827" },
  };
  tituloGrafico.alignment = {
    vertical: "middle",
    horizontal: "center",
  };
  tituloGrafico.border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  const imagenId = workbook.addImage({
    base64: graficoTendencia,
    extension: "png",
  });

  worksheet.addImage(imagenId, {
    tl: { col: 3, row: 4 },
    ext: { width: 560, height: 240 },
  });

  for (let columna = 4; columna <= 10; columna += 1) {
    worksheet.getColumn(columna).width = 12;
  }

  worksheet.getRow(4).height = 24;

  for (let fila = 5; fila <= 17; fila += 1) {
    worksheet.getRow(fila).height = 18;
  }
};

export const exportarReporteExcel = async (datosReporte, opciones = {}) => {
  const workbook = new ExcelJS.Workbook();
  const { graficoTendencia, logoBase64 } = opciones;
  const granularidadLabel = datosReporte.granularidadLabel ?? "Periodo";
  const etiquetaDimension = datosReporte.etiquetaDimension ?? "Periodo";
  const periodo = datosReporte.periodo ?? "-";

  workbook.creator = "SmartLot";
  workbook.created = new Date();

  // =========================
  // HOJA 1: RESUMEN
  // =========================

  const hojaResumen = workbook.addWorksheet("Resumen");

  hojaResumen.mergeCells("A1:B1");
  hojaResumen.getCell("A1").value = "Reporte de datos - SmartLot";
  aplicarEstiloTitulo(hojaResumen.getCell("A1"));

  hojaResumen.getCell("A2").value = `Generado el: ${obtenerFechaActual()}`;
  hojaResumen.getCell("A2").font = { italic: true };
  insertarLogoSmartLot(workbook, hojaResumen, logoBase64);

  hojaResumen.addRow([]);

  const headerResumen = hojaResumen.addRow(["Indicador", "Valor"]);
  aplicarEstiloHeader(headerResumen);

  hojaResumen.addRow(["Ocupación media", `${datosReporte.ocupacionMedia}%`]);
  hojaResumen.addRow(["Usuarios activos", datosReporte.usuariosActivos]);
  hojaResumen.addRow(["Tiempo promedio", datosReporte.tiempoPromedio]);
  hojaResumen.addRow(["Horas pico", datosReporte.horasPico]);
  hojaResumen.addRow(["Periodo", periodo]);
  hojaResumen.addRow(["Vista", granularidadLabel]);
  hojaResumen.addRow(["Reservas totales", datosReporte.reservasTotales ?? "-"]);

  hojaResumen.autoFilter = {
    from: "A4",
    to: "B4",
  };

  aplicarBordes(hojaResumen);
  ajustarColumnas(hojaResumen);

  hojaResumen.getColumn(2).alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  if (graficoTendencia) {
    insertarGraficoTendencia(workbook, hojaResumen, graficoTendencia);
  }

  // =========================
  // HOJA 2: TENDENCIA SEMANAL
  // =========================

  const hojaTendencia = workbook.addWorksheet(`Tendencia ${granularidadLabel}`);

  hojaTendencia.mergeCells("A1:C1");
  hojaTendencia.getCell("A1").value = `Tendencia por ${granularidadLabel.toLowerCase()} - ${periodo}`;
  aplicarEstiloTitulo(hojaTendencia.getCell("A1"));

  hojaTendencia.getCell("A2").value = `Generado el: ${obtenerFechaActual()}`;
  hojaTendencia.getCell("A2").font = { italic: true };
  insertarLogoSmartLot(workbook, hojaTendencia, logoBase64);

  hojaTendencia.addRow([]);

  const headerTendencia = hojaTendencia.addRow([etiquetaDimension, "Reservas", "Ocupación (%)"]);
  aplicarEstiloHeader(headerTendencia);

  datosReporte.tendencia.forEach((item) => {
    hojaTendencia.addRow([item.dia, item.count ?? 0, item.valor]);
  });

  hojaTendencia.autoFilter = {
    from: "A4",
    to: "C4",
  };

  aplicarBordes(hojaTendencia);
  ajustarColumnas(hojaTendencia);

  hojaTendencia.getColumn(3).numFmt = '0"%"';
  hojaTendencia.getColumn(2).alignment = {
    horizontal: "center",
    vertical: "middle",
  };
  hojaTendencia.getColumn(3).alignment = {
    horizontal: "center",
    vertical: "middle",
  };

  if (graficoTendencia) {
    insertarGraficoTendencia(workbook, hojaTendencia, graficoTendencia);
  }

  // =========================
  // DESCARGA DEL ARCHIVO
  // =========================

  const fechaArchivo = new Date().toISOString().split("T")[0];
  const nombreArchivo = `smartlot_reporte_datos_${fechaArchivo}.xlsx`;

  const buffer = await workbook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, nombreArchivo);
};  
