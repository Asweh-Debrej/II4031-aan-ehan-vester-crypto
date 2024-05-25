"use client";

import React, { useState } from "react";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import autoTable from "jspdf-autotable";

export default function GeneratePDF({ student }) {
  const alignCenter = (text) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) / doc.internal.scaleFactor;
    const textX = (pageWidth - textWidth) / 2;
    return textX;
  };

  const generate = (student) => {
    const doc = new jsPDF();
    doc.setFont("Times New Roman");
    doc.setFontSize(12);
    doc.text("Program Studi Sistem dan Teknologi Informasi", 10, 10);
    doc.text("Sekolah Teknik Elektro dan Informatika", 10, 15);
    doc.text("Institut Teknologi Bandung", 10, 20);
    doc.text("--------------------------------------------", 10, 25);

    doc.text("Transkrip Akademik", alignCenter("Transkrip Akademik"), 40);
    doc.text(`Nama: ${student.name}`, alignCenter(`Nama: ${student.name}`), 50);
    doc.text(`NIM: ${student.nim}`, alignCenter(`NIM: ${student.nim}`), 55);

    const body = Array.isArray(student.courses) ? student.courses.map((course, index) => [index + 1, course.code, course.name, course.grade, course.credit]) : [];

    let totalSKS = 0;
    const uhuy = Array.isArray(student.courses)
      ? student.courses.map((course) => {
          totalSKS += course.credit;
        })
      : {};

    autoTable(doc, {
      theme: "grid",
      startY: 70,
      fillColor: "white",
      headStyles: {
        fillColor: 0,
        textColor: [255, 255, 255],
      },
      styles: {
        font: "times",
      },
      head: [["No", "Code", "Name", "Grade", "Credit"]],
      body: body,
    });

    doc.text(`Total Jumlah SKS = ${totalSKS}`, alignCenter(`Total Jumlah SKS = ${totalSKS}`), 180);
    doc.text(`IPK = ${student.gpa}`, alignCenter(`IPK = ${student.gpa}`), 185);

    doc.text("Ketua Program Studi", 10, 210);
    doc.text("--Begin signature--", 10, 220);
    doc.text(`${student.signature}`, 10, 225);
    doc.text("--End signature--", 10, 230);
    doc.text("(Dr. I Gusti Bagus Baskara)", 10, 240);

    const pdfBlob = doc.output("blob");
    saveAs(pdfBlob, `Transkrip ${student.name}.pdf`);
  };

  return (
    <div className="bg-red-500 rounded-md py-2 px-4">
      <button onClick={() => generate(student)}>Download Transkrip</button>
    </div>
  );
}
