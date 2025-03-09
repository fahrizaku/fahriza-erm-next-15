import { NextResponse } from "next/server";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { mkdir, writeFile } from "fs/promises";

export async function POST(req) {
  console.log("API /api/generate-word dipanggil");

  try {
    const formData = await req.json();
    console.log("Received form data:", formData);

    // **Pastikan file template ada**
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
      // Render template dengan data dari form
      doc.render({
        nama: formData.nama || "", // String kosong jika tidak ada data
        alamat: formData.alamat || "",
        kotaKelahiran: formData.kotaKelahiran || "",
        tanggalLahir: formData.tanggalLahir || "",
        umur: formData.umur || "",
        jenisKelamin: formData.jenisKelamin || "", // String kosong jika tidak ada data
        namaTravel: formData.namaTravel || "",
        tanggalKeberangkatan: formData.tanggalKeberangkatan || "",
        asalTravel: formData.asalTravel || "",
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

    // Buat ID unik untuk file
    const id = uuidv4();
    const fileName = `${formData.nama || "Dokumen"}_vaksin_meningitis.docx`;
    const filePath = path.join(uploadDir, id + "_" + fileName);

    // Simpan file
    await writeFile(filePath, docBuffer);

    // Simpan metadata file ke JSON (sebagai contoh, bisa diganti dengan database)
    const dbPath = path.join(process.cwd(), "uploads", "db.json");
    let db = { files: [] };

    try {
      const dbContent = fs.readFileSync(dbPath, "utf-8");
      db = JSON.parse(dbContent);
    } catch (error) {
      // File db.json mungkin belum ada
    }

    // Tambahkan file baru
    db.files.push({
      id,
      name: fileName,
      path: filePath,
      type: "document",
      createdAt: new Date().toISOString(),
    });

    // Simpan kembali ke JSON
    await writeFile(dbPath, JSON.stringify(db, null, 2));

    // Hanya mengembalikan informasi bahwa dokumen berhasil disimpan
    return NextResponse.json({
      success: true,
      message: "Dokumen berhasil dibuat dan disimpan",
      fileId: id,
      fileName: fileName,
      filePath: filePath.replace(process.cwd(), ""),
    });
  } catch (error) {
    console.error("Error generating document:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
