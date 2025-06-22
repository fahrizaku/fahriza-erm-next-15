import { NextResponse } from "next/server";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { mkdir, writeFile } from "fs/promises";
// Import fungsi queue manager
import { getNextQueueNumber, addToQueue } from "@/utils/queueManager";

export async function POST(req) {
  console.log("API /api/generate-docx dipanggil");

  try {
    const formData = await req.json();
    console.log("Received form data:", formData);

    // **1. Generate nomor antrian**
    const queueInfo = getNextQueueNumber();
    console.log("Generated queue info:", queueInfo);

    // **2. Tambahkan nomor antrian dan timestamp ke formData**
    const formDataWithQueueAndTimestamp = {
      ...formData,
      nomorAntrian: queueInfo.formattedNumber, // Format: 001, 002, dst
      tanggalAntrian: queueInfo.date,
      createdAt: new Date().toISOString(),
    };

    // **3. Tambahkan ke tracking antrian**
    try {
      addToQueue(formData, queueInfo);
    } catch (error) {
      console.error("Error adding to queue tracking:", error);
      // Lanjutkan proses meski gagal tracking
    }

    // **4. Simpan data ke JSON terlebih dahulu**
    try {
      const response = await fetch(
        `${req.headers.origin || "http://localhost:3000"}/api/data-vaksin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formDataWithQueueAndTimestamp),
        }
      );

      if (!response.ok) {
        console.error("Gagal menyimpan data ke JSON");
      } else {
        console.log("Data berhasil disimpan ke JSON");
      }
    } catch (error) {
      console.error("Error saving to JSON:", error);
      // Lanjutkan proses meski gagal simpan ke JSON
    }

    // **5. Pastikan file template ada**
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
      // **6. Render template dengan data dari form + nomor antrian**
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
    const id = uuidv4();
    const fileName = `${queueInfo.formattedNumber}_${
      formData.nama || "Dokumen"
    }_vaksin_meningitis.docx`;
    const filePath = path.join(uploadDir, id + "_" + fileName);

    // Simpan file
    await writeFile(filePath, docBuffer);

    // Simpan metadata file ke JSON
    const dbPath = path.join(process.cwd(), "uploads", "db.json");
    let db = { files: [] };

    try {
      const dbContent = fs.readFileSync(dbPath, "utf-8");
      db = JSON.parse(dbContent);
    } catch (error) {
      // File db.json mungkin belum ada
    }

    // Tambahkan file baru dengan nomor antrian
    db.files.push({
      id,
      name: fileName,
      path: filePath,
      type: "document",
      queueNumber: queueInfo.queueNumber,
      formattedQueueNumber: queueInfo.formattedNumber,
      queueDate: queueInfo.date,
      createdAt: new Date().toISOString(),
      formData: formDataWithQueueAndTimestamp,
    });

    // Simpan kembali ke JSON
    await writeFile(dbPath, JSON.stringify(db, null, 2));

    // Return response dengan informasi nomor antrian
    return NextResponse.json({
      success: true,
      message: `Dokumen berhasil dibuat dan disimpan dengan nomor antrian ${queueInfo.formattedNumber}`,
      fileId: id,
      fileName: fileName,
      filePath: filePath.replace(process.cwd(), ""),
      queueNumber: queueInfo.queueNumber,
      formattedQueueNumber: queueInfo.formattedNumber,
      queueDate: queueInfo.date,
      createdAt: formDataWithQueueAndTimestamp.createdAt,
    });
  } catch (error) {
    console.error("Error generating document:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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
