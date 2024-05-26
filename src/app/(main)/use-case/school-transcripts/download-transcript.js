"use client";

import { useState, useEffect } from "react";

import { Button, Input } from "@nextui-org/react";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import autoTable from "jspdf-autotable";
import aesjs from "aes-js";
import { studentToGPA, totalCredit } from "@/lib/utils/cipher";

export default function DownloadTranscript({ studentData = null }) {
  const [key, setKey] = useState("");

  function blobToArrayBuffer(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  }

  function arrayBufferToBlob(arrayBuffer, type) {
    return new Blob([arrayBuffer], { type });
  }

  async function encryptPDFBlob(pdfBlob, key) {
    try {
      const arrayBuffer = await blobToArrayBuffer(pdfBlob);
      const bytes = new Uint8Array(arrayBuffer);
      if (key.length !== 16 && key.length !== 24 && key.length !== 32) {
        throw new Error("Invalid key length. Key must be 16, 24, or 32 bytes long.");
      }
      const paddedBytes = aesjs.padding.pkcs7.pad(bytes);
      const aesEcb = new aesjs.ModeOfOperation.ecb(key);
      const encryptedBytes = aesEcb.encrypt(paddedBytes);
      const encryptedArrayBuffer = encryptedBytes.buffer;
      const encryptedBlob = arrayBufferToBlob(encryptedArrayBuffer, pdfBlob.type);
      return encryptedBlob;
    } catch (error) {
      console.error("PDF encryption failed:", error);
      throw error;
    }
  }

  async function decryptPDFBlob(encryptedBlob, key) {
    try {
      const arrayBuffer = await blobToArrayBuffer(encryptedBlob);
      const bytes = new Uint8Array(arrayBuffer);
      if (key.length !== 16 && key.length !== 24 && key.length !== 32) {
        throw new Error("Invalid key length. Key must be 16, 24, or 32 bytes long.");
      }
      const aesEcb = new aesjs.ModeOfOperation.ecb(key);
      const decryptedBytes = aesEcb.decrypt(bytes);
      const unpaddedBytes = aesjs.padding.pkcs7.strip(decryptedBytes);
      const decryptedArrayBuffer = unpaddedBytes.buffer;
      const decryptedBlob = arrayBufferToBlob(decryptedArrayBuffer, encryptedBlob.type);
      return decryptedBlob;
    } catch (error) {
      console.error("PDF decryption failed:", error);
      throw error;
    }
  }

  const alignCenter = (text) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    const pageWidth = doc.internal.pageSize.getWidth();
    const textWidth = (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) / doc.internal.scaleFactor;
    const textX = (pageWidth - textWidth) / 2;
    return textX;
  };

  const generatePDF = (student) => {
    try {
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

      doc.text(`Total Jumlah SKS = ${totalCredit(student)}`, alignCenter(`Total Jumlah SKS = ${totalCredit(student)}`), 180);
      doc.text(`IPK = ${studentToGPA(student)}`, alignCenter(`IPK = ${studentToGPA(student)}`), 185);

      doc.text("Ketua Program Studi", 10, 210);
      doc.text("--Begin signature--", 10, 220);
      doc.text(`${student.hash}`, 10, 225);
      doc.text("--End signature--", 10, 230);
      doc.text("(Dr. I Gusti Bagus Baskara)", 10, 240);

      const pdfBlob = doc.output("blob");
      return pdfBlob;
    } catch (error) {
      alert("error pdf");
      console.error("PDF generation and encryption failed:", error);
    }
  };

  const padKey = (key) => {
    const paddingChar = "x"; // You can use any character you prefer
    const keyLength = key.length;
    const padLength = 16 - (keyLength % 16);
    const paddedKey = key + paddingChar.repeat(padLength);
    return paddedKey;
  };

  const encryptAES = async (pdfBlob, student, key) => {
    try {
      const paddedKey = aesjs.utils.utf8.toBytes(padKey(key));
      const encryptedBlob = await encryptPDFBlob(pdfBlob, paddedKey);
      saveAs(encryptedBlob, `Encrypted_Transkrip_${student.name}.pdf`);
    } catch (error) {
      console.error("PDF generation and encryption failed:", error);
      alert("error bawah");
    }
  };

  const onSubmitHandler = () => {
    if (!key) {
      alert("Key is required");
      return;
    }

    if (!studentData) {
      alert("Student data is required");
      return;
    }

    const pdfBlob = generatePDF(studentData);
    encryptAES(pdfBlob, studentData, key);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-fit max-w-full">
      <p>{`Using AES decryption, you can download encrypted transcript file`}</p>
      <div className="flex flex-row gap-4 items-center mx-auto">
        <Input label="Key" className="w-[200px]" onValueChange={(val) => setKey(val)} />
        <Button color="primary" className="w-[160px]" onClick={onSubmitHandler}>
          Download Transcript
        </Button>
      </div>
      <p>{`The PDF file will be downloaded automaticaly`}</p>
    </div>
  );
}
