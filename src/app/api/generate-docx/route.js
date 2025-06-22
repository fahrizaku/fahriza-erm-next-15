// /api/generate-docx/route.js
import { NextResponse } from "next/server";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
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

    // **3. Pastikan file template ada**
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
      nullGetter: () => "", // Menghindari error jika ada variabel kosong
    });

    try {
      // **4. Render template dengan data dari form + nomor antrian**
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
        // Tambahan field nomor antrian
        nomorAntrian: queueInfo.formattedNumber,
        tanggalAntrian: formatIndonesianDate(queueInfo.date),
        // Tambahan field untuk template
        waktuDaftar: formatIndonesianDateTime(new Date()),
      });
    } catch (error) {
      console.error("Template rendering error:", error);
      return NextResponse.json(
        { error: "Template error: " + error.message },
        { status: 500 }
      );
    }

    // Generate dokumen Word
    const docBuffer = doc.getZip().generate({ type: "nodebuffer" });

    // Buat direktori uploads jika belum ada
    const uploadDir = path.join(process.cwd(), "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Direktori mungkin sudah ada
    }

    // Buat ID unik untuk file dengan nomor antrian
    const fileId = uuidv4();
    const fileName = `${queueInfo.formattedNumber}_${
      formData.nama || "Dokumen"
    }_vaksin_meningitis.docx`;
    const filePath = path.join(uploadDir, fileId + "_" + fileName);

    // Simpan file
    await writeFile(filePath, docBuffer);

    // **5. Simpan metadata dokumen ke database**
    try {
      await db.generatedDocument.create({
        data: {
          id: fileId,
          fileName: fileName,
          filePath: filePath,
          fileType: "document",
          queueNumber: queueInfo.queueNumber,
          formattedQueueNumber: queueInfo.formattedNumber,
          queueDate: queueInfo.date,
          vaksinDataId: vaksinRecord.id,
        },
      });
    } catch (error) {
      console.error("Error saving document metadata:", error);
      // Lanjutkan proses meski gagal simpan metadata
    }

    // Return response dengan informasi nomor antrian
    return NextResponse.json({
      success: true,
      message: `Dokumen berhasil dibuat dan disimpan dengan nomor antrian ${queueInfo.formattedNumber}`,
      fileId: fileId,
      fileName: fileName,
      filePath: filePath.replace(process.cwd(), ""),
      queueNumber: queueInfo.queueNumber,
      formattedQueueNumber: queueInfo.formattedNumber,
      queueDate: queueInfo.date,
      vaksinDataId: vaksinRecord.id,
      createdAt: vaksinRecord.createdAt,
    });
  } catch (error) {
    console.error("Error generating document:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    await db.$disconnect();
  }
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
