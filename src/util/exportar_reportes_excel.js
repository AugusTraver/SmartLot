// src/utils/exportarReporteExcel.js

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const aplicarEstiloTitulo = (celda) => {
  celda.font = {
    bold: true,
    size: 17,
    color: { argb: "FFFFFFFF" },
  };

  celda.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0F172A" },
  };

  celda.alignment = {
    vertical: "middle",
    horizontal: "center",
  };
};

const aplicarEstiloHeader = (fila) => {
  fila.height = 24;

  fila.eachCell((celda) => {
    celda.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
    };

    celda.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E293B" },
    };

    celda.alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    celda.border = {
      top: { style: "thin", color: { argb: "FFCBD5E1" } },
      left: { style: "thin", color: { argb: "FFCBD5E1" } },
      bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
      right: { style: "thin", color: { argb: "FFCBD5E1" } },
    };
  });
};

const aplicarBordes = (worksheet) => {
  worksheet.eachRow((fila) => {
    fila.height = Math.max(fila.height || 0, 21);

    fila.eachCell((celda) => {
      celda.border = {
        top: { style: "thin", color: { argb: "FFE2E8F0" } },
        left: { style: "thin", color: { argb: "FFE2E8F0" } },
        bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
        right: { style: "thin", color: { argb: "FFE2E8F0" } },
      };

      celda.alignment = {
        ...(celda.alignment || {}),
        vertical: "middle",
      };
    });
  });
};

const aplicarFilasAlternadas = (worksheet, desdeFila) => {
  for (let rowNumber = desdeFila; rowNumber <= worksheet.rowCount; rowNumber += 1) {
    if ((rowNumber - desdeFila) % 2 !== 0) continue;

    worksheet.getRow(rowNumber).eachCell((celda) => {
      celda.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF8FAFC" },
      };
    });
  }
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
    fgColor: { argb: "FF1E293B" },
  };
  tituloGrafico.alignment = {
    vertical: "middle",
    horizontal: "center",
  };
  tituloGrafico.border = {
    top: { style: "thin", color: { argb: "FFCBD5E1" } },
    left: { style: "thin", color: { argb: "FFCBD5E1" } },
    bottom: { style: "thin", color: { argb: "FFCBD5E1" } },
    right: { style: "thin", color: { argb: "FFCBD5E1" } },
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
  const { graficoTendencia } = opciones;
  const granularidadLabel = datosReporte.granularidadLabel ?? "Periodo";
  const etiquetaDimension = datosReporte.etiquetaDimension ?? "Periodo";
  const periodo = datosReporte.periodo ?? "-";

  workbook.creator = "SmartLot";
  workbook.created = new Date();

  // =========================
  // HOJA 1: RESUMEN
  // =========================

  const hojaResumen = workbook.addWorksheet("Resumen");
  hojaResumen.properties.tabColor = { argb: "FF2563EB" };
  hojaResumen.views = [{ state: "frozen", ySplit: 4 }];

  hojaResumen.mergeCells("A1:J1");
  hojaResumen.getCell("A1").value = "Reporte de datos - SmartLot";
  aplicarEstiloTitulo(hojaResumen.getCell("A1"));
  hojaResumen.getRow(1).height = 28;

  hojaResumen.getCell("A2").value = `Generado el: ${obtenerFechaActual()}`;
  hojaResumen.getCell("A2").font = { italic: true, color: { argb: "FF475569" } };
  hojaResumen.getCell("A2").alignment = { vertical: "middle" };

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

  aplicarFilasAlternadas(hojaResumen, 5);
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
  hojaTendencia.properties.tabColor = { argb: "FF0F766E" };
  hojaTendencia.views = [{ state: "frozen", ySplit: 4 }];

  hojaTendencia.mergeCells("A1:J1");
  hojaTendencia.getCell("A1").value = `Tendencia por ${granularidadLabel.toLowerCase()} - ${periodo}`;
  aplicarEstiloTitulo(hojaTendencia.getCell("A1"));
  hojaTendencia.getRow(1).height = 28;

  hojaTendencia.getCell("A2").value = `Generado el: ${obtenerFechaActual()}`;
  hojaTendencia.getCell("A2").font = { italic: true, color: { argb: "FF475569" } };
  hojaTendencia.getCell("A2").alignment = { vertical: "middle" };

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

  aplicarFilasAlternadas(hojaTendencia, 5);
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
