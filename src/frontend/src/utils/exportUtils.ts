export async function exportToPDF(
  content: string,
  title: string,
  fontFamily: string,
): Promise<void> {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ]);

  const container = document.createElement("div");
  container.style.cssText =
    "position:fixed;top:-9999px;left:-9999px;width:794px;padding:60px;background:#fff;color:#1a1a1a;font-size:14px;line-height:1.8;";
  container.style.fontFamily = `'${fontFamily}', 'Noto Sans Devanagari', sans-serif`;
  container.innerHTML = `<h2 style="margin-bottom:20px;font-size:18px;font-weight:600;border-bottom:2px solid #f2a23a;padding-bottom:8px">${title}</h2><div style="white-space:pre-wrap">${content}</div>`;
  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
    const imgX = (pdfWidth - canvas.width * ratio) / 2;
    pdf.addImage(
      imgData,
      "PNG",
      imgX,
      0,
      canvas.width * ratio,
      canvas.height * ratio,
    );
    const totalPages = Math.ceil((canvas.height * ratio) / pdfHeight);
    for (let i = 1; i < totalPages; i++) {
      pdf.addPage();
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        -(pdfHeight * i),
        canvas.width * ratio,
        canvas.height * ratio,
      );
    }
    const safeName = title.replace(/[^\w\u0900-\u097F\s]/g, "").trim() || "पत्र";
    pdf.save(`${safeName}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}

export function printLetter(
  content: string,
  title: string,
  fontFamily: string,
): void {
  const w = window.open("", "_blank");
  if (!w) {
    alert("कृपया पॉपअप विंडोव परवानगी द्या.");
    return;
  }
  w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;500&family=Noto+Sans+Devanagari:wght@400;500&display=swap" rel="stylesheet">
  <style>@page{margin:2cm}body{font-family:'${fontFamily}','Noto Sans Devanagari',sans-serif;font-size:14pt;line-height:1.8;color:#1a1a1a}h1{font-size:16pt;margin-bottom:16pt;border-bottom:1.5pt solid #f2a23a;padding-bottom:6pt}pre{white-space:pre-wrap;font-family:inherit}</style>
  </head><body><h1>${title}</h1><pre>${content}</pre></body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => {
    w.print();
    w.close();
  }, 500);
}

export async function exportToWord(
  content: string,
  title: string,
  fontFamily: string,
): Promise<void> {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import(
    "docx"
  );

  const paragraphs = content.split("\n").map((line) =>
    line.trim() === ""
      ? new Paragraph({ text: " ", spacing: { after: 80 } })
      : new Paragraph({
          children: [new TextRun({ text: line, font: fontFamily, size: 28 })],
          spacing: { after: 120 },
        }),
  );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: title,
                font: fontFamily,
                bold: true,
                size: 36,
              }),
            ],
            spacing: { after: 200 },
          }),
          ...paragraphs,
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([new Uint8Array(buffer as unknown as ArrayBuffer)], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/[^\w\u0900-\u097F\s]/g, "").trim() || "पत्र"}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
