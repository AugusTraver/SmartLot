

import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

const obtenerFechaArchivo = () => {
  return new Date().toISOString().split("T")[0];
};

const agregarTitulo = (doc, titulo) => {
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, 210, 25, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(titulo, 105, 16, { align: "center" });
};

const agregarFooter = (doc) => {
  const cantidadPaginas = doc.internal.getNumberOfPages();

  for (let i = 1; i <= cantidadPaginas; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(`Página ${i} de ${cantidadPaginas}`, 105, 290, {
      align: "center",
    });
  }
};

export const exportarReportePDF = (reporte = {}, opciones = {}) => {
  const metricasBase = reporte.metricas ?? reporte;
  const metricas = {
    ...metricasBase,
    ocupacionMedia: metricasBase.ocupacionMedia != null ? `${metricasBase.ocupacionMedia}%` : undefined,
    horaPico: metricasBase.horaPico ?? metricasBase.horasPico,
  };
  const tendenciaBase = reporte.tendenciaSemanal ?? reporte.tendencia ?? [];
  const tendenciaSemanal = tendenciaBase.map((item) => ({
    ...item,
    ocupacion: item.ocupacion ?? (item.valor != null ? `${item.valor}%` : undefined),
  }));
  const graficoBase64 = reporte.graficoBase64 ?? opciones.graficoBase64 ?? opciones.graficoTendencia ?? null;
  const doc = new jsPDF("p", "mm", "a4");

  agregarTitulo(doc, "Reporte de SmartLot");

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.text(`Fecha de generación: ${obtenerFechaArchivo()}`, 14, 35);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Resumen general", 14, 50);

  autoTable(doc, {
    startY: 55,
    head: [["Métrica", "Valor"]],
    body: [
      ["Ocupación media", metricas.ocupacionMedia ?? "-"],
      ["Usuarios activos", metricas.usuariosActivos ?? "-"],
      ["Tiempo promedio", metricas.tiempoPromedio ?? "-"],
      ["Hora pico", metricas.horaPico ?? "-"],
      ["Reservas totales", metricas.reservasTotales ?? "-"],
    ],
    styles: {
      halign: "center",
      valign: "middle",
      fontSize: 9,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [17, 24, 39],
      textColor: [255, 255, 255],
    },
  });

  let posicionY = doc.lastAutoTable.finalY + 9;

  if (graficoBase64) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Gráfico de tendencia", 14, posicionY);

    doc.addImage(graficoBase64, "PNG", 14, posicionY + 5, 180, 60);

    posicionY += 72;
  }

  if (posicionY > 238) {
    doc.addPage();
    posicionY = 25;
  }

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Tendencia semanal", 14, posicionY);

  autoTable(doc, {
    startY: posicionY + 5,
    head: [["Día", "Ocupación"]],
    body: tendenciaSemanal.map((item) => [
      item.dia ?? "-",
      item.ocupacion ?? "-",
    ]),
    styles: {
      halign: "center",
      valign: "middle",
      fontSize: 9,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [17, 24, 39],
      textColor: [255, 255, 255],
    },
  });

  agregarFooter(doc);

  doc.save(`smartlot_reporte_datos_${obtenerFechaArchivo()}.pdf`);
};
