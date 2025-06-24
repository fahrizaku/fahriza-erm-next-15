// /api/generate-docx/route.js - Updated with new receipt format
import { NextResponse } from "next/server";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import jsPDF from "jspdf";
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

    // **2. Simpan data vaksin ke database**
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
          // Tambahan fields vaksin
          jenisVaksin: formData.jenisVaksin || "",
          ppTest: formData.ppTest || false,
          totalHarga: formData.totalHarga || 0,
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

    // **3. Generate DOCX (kode yang sudah ada)**
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

    // Format jenis vaksin untuk tampilan
    const jenisVaksinDisplay = formatVaccineType(formData.jenisVaksin);
    const ppTestDisplay = formData.ppTest ? "Ya" : "Tidak";

    try {
      doc.render({
        nama: formData.nama || "",
        no_telp: formData.no_telp || "",
        alamat: formData.alamat || "",
        kotaKelahiran: formData.kotaKelahiran || "",
        tanggalLahir: formData.tanggalLahir || "",
        umur: formData.umur || "",
        jenisKelamin: formData.jenisKelamin || "",
        namaTravel: formData.namaTravel || "",
        tanggalKeberangkatan: formData.tanggalKeberangkatan || "",
        asalTravel: formData.asalTravel || "",
        // Tambahan fields vaksin
        jenisVaksin: jenisVaksinDisplay,
        ppTest: ppTestDisplay,
        totalHarga: formatCurrency(formData.totalHarga || 0),
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

    // **4. Generate PDF Kwitansi**
    const receiptBuffer = generateReceiptJsPDF({
      nama: formData.nama || "",
      jumlah: formData.totalHarga || 0,
      penggunaan: `Vaksin ${jenisVaksinDisplay}${
        formData.ppTest ? " + PP Test" : ""
      }`,
      tanggal: formatIndonesianDate(new Date()),
      nomorAntrian: queueInfo.formattedNumber,
    });

    // Buat direktori uploads jika belum ada
    const uploadDir = path.join(process.cwd(), "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Direktori mungkin sudah ada
    }

    // **5. Simpan file DOCX**
    const fileId = uuidv4();
    const docxFileName = `${queueInfo.formattedNumber}_${
      formData.nama || "Dokumen"
    }_vaksin_${formData.jenisVaksin || "default"}.docx`;
    const docxFilePath = path.join(uploadDir, fileId + "_" + docxFileName);
    await writeFile(docxFilePath, docBuffer);

    // **6. Simpan file PDF Kwitansi**
    const receiptFileName = `${queueInfo.formattedNumber}_${
      formData.nama || "Kwitansi"
    }_kwitansi.pdf`;
    const receiptFilePath = path.join(
      uploadDir,
      fileId + "_receipt_" + receiptFileName
    );
    await writeFile(receiptFilePath, receiptBuffer);

    // **7. Simpan metadata dokumen ke database**
    try {
      // Simpan metadata DOCX
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

      // Simpan metadata PDF Kwitansi sebagai record terpisah
      await db.generatedDocument.create({
        data: {
          id: fileId + "_receipt",
          fileName: receiptFileName,
          filePath: receiptFilePath,
          fileType: "receipt",
          queueNumber: queueInfo.queueNumber,
          formattedQueueNumber: queueInfo.formattedNumber,
          queueDate: queueInfo.date,
          vaksinDataId: vaksinRecord.id,
        },
      });
    } catch (error) {
      console.error("Error saving document metadata:", error);
    }

    // Return response dengan informasi kedua file
    return NextResponse.json({
      success: true,
      message: `Dokumen dan kwitansi berhasil dibuat dengan nomor antrian ${queueInfo.formattedNumber}`,
      fileId: fileId,
      // Info DOCX
      docxFileName: docxFileName,
      docxFilePath: docxFilePath.replace(process.cwd(), ""),
      // Info PDF Kwitansi
      receiptFileName: receiptFileName,
      receiptFilePath: receiptFilePath.replace(process.cwd(), ""),
      // Info umum
      queueNumber: queueInfo.queueNumber,
      formattedQueueNumber: queueInfo.formattedNumber,
      queueDate: queueInfo.date,
      vaksinDataId: vaksinRecord.id,
      // Info vaksin
      jenisVaksin: formData.jenisVaksin,
      ppTest: formData.ppTest,
      totalHarga: formData.totalHarga,
      createdAt: vaksinRecord.createdAt,
    });
  } catch (error) {
    console.error("Error generating document:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await db.$disconnect();
  }
}

// **Helper function untuk format jenis vaksin**
function formatVaccineType(jenisVaksin) {
  if (!jenisVaksin) return "";

  const vaccineTypes = {
    meningitis: "Meningitis",
    polio: "Polio",
    influenza: "Influenza",
  };

  // Handle combination vaccines (e.g., "meningitis+influenza")
  if (jenisVaksin.includes("+")) {
    const vaccines = jenisVaksin.split("+").map((vaccine) => {
      return vaccineTypes[vaccine.trim()] || vaccine.trim();
    });
    return vaccines.join(" + ");
  }

  return vaccineTypes[jenisVaksin] || jenisVaksin;
}

// **Helper function untuk format currency**
function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// **Fungsi untuk generate PDF Kwitansi dengan jsPDF - Format Baru**
function generateReceiptJsPDF(data) {
  // Ukuran kertas baru: 20.83 x 10.8 cm (landscape)
  const widthMM = 208.3; // 20.83 cm
  const heightMM = 108; // 10.8 cm

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [widthMM, heightMM],
  });

  // Set font size
  pdf.setFontSize(10);

  // Koordinat sesuai spesifikasi (konversi cm ke mm):
  // 1. Nama: x=6.64 cm, y=4.3 cm → x=66.4 mm, y=43 mm
  pdf.text(data.nama, 66.4, 43);

  // 2. Jumlah dalam huruf: x=6.85 cm, y=5.1 cm → x=68.5 mm, y=51 mm
  const jumlahHuruf = numberToWords(data.jumlah);
  pdf.text(`${jumlahHuruf} rupiah`, 68.5, 51);

  // 3. Untuk (penggunaan): x=10.4 cm, y=5.8 cm → x=104 mm, y=58 mm
  pdf.text(data.penggunaan, 104, 58);

  // 4. Sebesar (jumlah angka): x=5 cm, y=9.5 cm → x=50 mm, y=95 mm
  const jumlahAngka = formatCurrency(data.jumlah);
  pdf.text(jumlahAngka, 50, 95);

  // 5. Tanggal: x=15.6 cm, y=8.3 cm → x=156 mm, y=83 mm
  pdf.text(data.tanggal, 156, 83);

  // Return sebagai Buffer
  const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));
  return pdfBuffer;
}

// **Fungsi konversi angka ke huruf (Indonesia)**
function numberToWords(num) {
  const ones = [
    "",
    "satu",
    "dua",
    "tiga",
    "empat",
    "lima",
    "enam",
    "tujuh",
    "delapan",
    "sembilan",
  ];
  const teens = [
    "sepuluh",
    "sebelas",
    "dua belas",
    "tiga belas",
    "empat belas",
    "lima belas",
    "enam belas",
    "tujuh belas",
    "delapan belas",
    "sembilan belas",
  ];
  const tens = [
    "",
    "",
    "dua puluh",
    "tiga puluh",
    "empat puluh",
    "lima puluh",
    "enam puluh",
    "tujuh puluh",
    "delapan puluh",
    "sembilan puluh",
  ];

  if (num === 0) return "nol";

  // Handle millions
  if (num >= 1000000) {
    const millions = Math.floor(num / 1000000);
    const remainder = num % 1000000;
    let result = ones[millions] + " juta";
    if (remainder > 0) {
      result += " " + numberToWords(remainder);
    }
    return result;
  }

  // Handle hundred thousands
  if (num >= 100000) {
    const hundreds = Math.floor(num / 100000);
    const remainder = num % 100000;
    let result = "";

    if (hundreds === 1) {
      result = "seratus ribu";
    } else {
      result = ones[hundreds] + " ratus ribu";
    }

    if (remainder > 0) {
      result += " " + numberToWords(remainder);
    }

    return result;
  }

  // Handle ten thousands
  if (num >= 10000) {
    const tenThousands = Math.floor(num / 10000);
    const remainder = num % 10000;
    let result = ones[tenThousands] + " puluh ribu";
    if (remainder > 0) {
      result += " " + numberToWords(remainder);
    }
    return result;
  }

  // Handle thousands
  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    let result = "";

    if (thousands === 1) {
      result = "seribu";
    } else {
      result = ones[thousands] + " ribu";
    }

    if (remainder > 0) {
      result += " " + numberToWords(remainder);
    }

    return result;
  }

  // Handle hundreds
  if (num >= 100) {
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    let result = "";

    if (hundreds === 1) {
      result = "seratus";
    } else {
      result = ones[hundreds] + " ratus";
    }

    if (remainder > 0) {
      result += " " + numberToWords(remainder);
    }

    return result;
  }

  // Handle tens
  if (num >= 20) {
    const tensDigit = Math.floor(num / 10);
    const remainder = num % 10;
    let result = tens[tensDigit];
    if (remainder > 0) {
      result += " " + ones[remainder];
    }
    return result;
  }

  // Handle teens
  if (num >= 10) {
    return teens[num - 10];
  }

  // Handle ones
  return ones[num];
}

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
