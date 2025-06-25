// /api/generate-docx/route.js - Disabled receipt, vaccine pricing, and name titles
import { NextResponse } from "next/server";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
// import jsPDF from "jspdf"; // DISABLED - No longer needed for receipt
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { mkdir, writeFile } from "fs/promises";

// Import fungsi queue manager
import { getNextQueueNumber, addToQueue } from "@/utils/queueManager";

import { db } from "@/lib/db"; // Pastikan db sudah di-setup

export async function POST(req) {
  console.log("API /api/generate-docx dipanggil");

  try {
    const formData = await req.json();
    console.log("Received form data:", formData);

    // **1. Generate nomor antrian**
    const queueInfo = await getNextQueueNumber();
    console.log("Generated queue info:", queueInfo);

    // **2. Simpan data vaksin ke database (without vaccine/pricing fields)**
    let vaksinRecord;
    try {
      vaksinRecord = await db.vaksinData.create({
        data: {
          nama: formData.nama || "",
          noTelp: formData.no_telp || "",
          alamat: formData.alamat || "",
          kotaKelahiran: formData.kotaKelahiran || "",
          tanggalLahir: formData.tanggalLahir || "",
          umur: formData.umur || "",
          jenisKelamin: formData.jenisKelamin || "",
          namaTravel: formData.namaTravel || "",
          tanggalKeberangkatan: formData.tanggalKeberangkatan || "",
          asalTravel: formData.asalTravel || "",
          // Vaccine fields disabled
          // jenisVaksin: formData.jenisVaksin || "",
          // ppTest: formData.ppTest || false,
          // totalHarga: formData.totalHarga || 0,
          jenisVaksin: "", // Set to empty
          ppTest: false, // Set to false
          totalHarga: 0, // Set to 0
          nomorAntrian: queueInfo.formattedNumber,
          tanggalAntrian: queueInfo.date,
        },
      });
      console.log("Data berhasil disimpan ke database:", vaksinRecord.id);
    } catch (error) {
      console.error("Error saving to database:", error);
      return NextResponse.json(
        { error: "Gagal menyimpan data ke database: " + error.message },
        { status: 500 }
      );
    }

    // **3. Generate DOCX only (no receipt)**
    const templatePath = path.join(
      process.cwd(),
      "src",
      "assets",
      "templates",
      "template.docx"
    );
    if (!fs.existsSync(templatePath)) {
      console.error("File template.docx tidak ditemukan!");
      return NextResponse.json(
        { error: "Template file missing" },
        { status: 500 }
      );
    }

    const templateBuffer = fs.readFileSync(templatePath);
    const zip = new PizZip(templateBuffer);
    const doc = new Docxtemplater(zip, {
      nullGetter: () => "",
    });

    // Disabled vaccine formatting
    // const jenisVaksinDisplay = formatVaccineType(formData.jenisVaksin);
    // const ppTestDisplay = formData.ppTest ? "Ya" : "Tidak";
    const jenisVaksinDisplay = ""; // Empty
    const ppTestDisplay = "Tidak"; // Default to No

    // Name titles disabled - use original name without any title formatting
    // const namaWithTitle = formatNameWithTitle(
    //   formData.nama || "",
    //   formData.jenisKelamin || "",
    //   parseInt(formData.umur) || 0
    // );
    const namaWithTitle = formData.nama || ""; // Use original name without titles

    try {
      doc.render({
        nama: namaWithTitle,
        no_telp: formData.no_telp || "",
        alamat: formData.alamat || "",
        kotaKelahiran: formData.kotaKelahiran || "",
        tanggalLahir: formData.tanggalLahir || "",
        umur: formData.umur || "",
        jenisKelamin: formData.jenisKelamin || "",
        namaTravel: formData.namaTravel || "",
        tanggalKeberangkatan: formData.tanggalKeberangkatan || "",
        asalTravel: formData.asalTravel || "",
        // Vaccine fields disabled/empty
        jenisVaksin: jenisVaksinDisplay,
        ppTest: ppTestDisplay,
        totalHarga: "0", // Set to 0
        nomorAntrian: queueInfo.formattedNumber,
        tanggalAntrian: formatIndonesianDate(queueInfo.date),
        waktuDaftar: formatIndonesianDateTime(new Date()),
      });
    } catch (error) {
      console.error("Template rendering error:", error);
      return NextResponse.json(
        { error: "Template error: " + error.message },
        { status: 500 }
      );
    }

    const docBuffer = doc.getZip().generate({ type: "nodebuffer" });

    // **4. Receipt generation disabled**
    // const receiptBuffer = generateReceiptJsPDF({ ... });

    // Buat direktori uploads jika belum ada
    const uploadDir = path.join(process.cwd(), "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Direktori mungkin sudah ada
    }

    // **5. Simpan file DOCX only**
    const fileId = uuidv4();
    const docxFileName = `${queueInfo.formattedNumber}_${
      formData.nama || "Dokumen"
    }_vaksin.docx`; // Simplified filename
    const docxFilePath = path.join(uploadDir, fileId + "_" + docxFileName);
    await writeFile(docxFilePath, docBuffer);

    // **6. Receipt file saving disabled**

    // **7. Simpan metadata dokumen ke database (DOCX only)**
    try {
      // Simpan metadata DOCX only
      await db.generatedDocument.create({
        data: {
          id: fileId,
          fileName: docxFileName,
          filePath: docxFilePath,
          fileType: "document",
          queueNumber: queueInfo.queueNumber,
          formattedQueueNumber: queueInfo.formattedNumber,
          queueDate: queueInfo.date,
          vaksinDataId: vaksinRecord.id,
        },
      });

      // Receipt metadata saving disabled
    } catch (error) {
      console.error("Error saving document metadata:", error);
    }

    // Return response with document info only (no receipt)
    return NextResponse.json({
      success: true,
      message: `Dokumen berhasil dibuat dengan nomor antrian ${queueInfo.formattedNumber}`,
      fileId: fileId,
      // Info DOCX only
      docxFileName: docxFileName,
      docxFilePath: docxFilePath.replace(process.cwd(), ""),
      // Receipt info disabled
      // Info umum
      queueNumber: queueInfo.queueNumber,
      formattedQueueNumber: queueInfo.formattedNumber,
      queueDate: queueInfo.date,
      vaksinDataId: vaksinRecord.id,
      // Vaccine info disabled
      // jenisVaksin: formData.jenisVaksin,
      // ppTest: formData.ppTest,
      // totalHarga: formData.totalHarga,
      createdAt: vaksinRecord.createdAt,
    });
  } catch (error) {
    console.error("Error generating document:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await db.$disconnect();
  }
}

// **Name title formatting function disabled**
// function formatNameWithTitle(nama, jenisKelamin, umur) {
//   if (!nama) return "";
//
//   let title = "";
//
//   if (
//     jenisKelamin.toLowerCase() === "laki-laki" ||
//     jenisKelamin.toLowerCase() === "pria"
//   ) {
//     if (umur < 30) {
//       title = "Sdr. "; // Saudara
//     } else {
//       title = "Tn. "; // Tuan
//     }
//   } else if (
//     jenisKelamin.toLowerCase() === "perempuan" ||
//     jenisKelamin.toLowerCase() === "wanita"
//   ) {
//     if (umur < 30) {
//       title = "Sdri. "; // Saudari
//     } else {
//       title = "Ny. "; // Nyonya
//     }
//   }
//
//   return title + nama;
// }

// **Vaccine formatting functions disabled**
// function formatVaccineType(jenisVaksin) { ... }
// function formatCurrency(amount) { ... }
// function generateReceiptJsPDF(data) { ... }
// function numberToWords(num) { ... }

// Helper function untuk format tanggal Indonesia
function formatIndonesianDate(dateString) {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const date = new Date(dateString);
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

// Helper function untuk format tanggal dan waktu Indonesia
function formatIndonesianDateTime(date) {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day} ${month} ${year} pukul ${hours}:${minutes} WIB`;
}
