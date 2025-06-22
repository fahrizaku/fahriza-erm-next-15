// /api/data-vaksin/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { mkdir, writeFile } from "fs/promises";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "meningitis_data.json");

// Pastikan direktori dan file data ada
async function ensureDataFile() {
  try {
    await mkdir(DATA_DIR, { recursive: true });
    if (!fs.existsSync(DATA_FILE)) {
      await writeFile(DATA_FILE, JSON.stringify({ data: [] }, null, 2));
    }
  } catch (error) {
    console.error("Error creating data file:", error);
  }
}

// Baca data dari file JSON
async function readData() {
  try {
    await ensureDataFile();
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data:", error);
    return { data: [] };
  }
}

// Tulis data ke file JSON
async function writeData(data) {
  try {
    await writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing data:", error);
    return false;
  }
}

// GET - Ambil semua data
export async function GET() {
  try {
    const jsonData = await readData();
    return NextResponse.json(jsonData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Tambah data baru
export async function POST(req) {
  try {
    const formData = await req.json();
    const jsonData = await readData();

    // Cek apakah createdAt sudah ada dari generate-docx API
    const currentTime = new Date().toISOString();

    const newRecord = {
      id: uuidv4(),
      ...formData,
      // Gunakan createdAt dari formData jika ada, jika tidak buat baru
      createdAt: formData.createdAt || currentTime,
      updatedAt: currentTime,
    };

    jsonData.data.push(newRecord);

    const success = await writeData(jsonData);
    if (success) {
      return NextResponse.json({
        success: true,
        message: "Data berhasil disimpan",
        data: newRecord,
      });
    } else {
      throw new Error("Gagal menyimpan data");
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update data
export async function PUT(req) {
  try {
    const { id, ...updateData } = await req.json();
    const jsonData = await readData();

    const index = jsonData.data.findIndex((item) => item.id === id);
    if (index === -1) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    jsonData.data[index] = {
      ...jsonData.data[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    const success = await writeData(jsonData);
    if (success) {
      return NextResponse.json({
        success: true,
        message: "Data berhasil diupdate",
        data: jsonData.data[index],
      });
    } else {
      throw new Error("Gagal mengupdate data");
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Hapus data
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID tidak ditemukan" },
        { status: 400 }
      );
    }

    const jsonData = await readData();
    const initialLength = jsonData.data.length;

    jsonData.data = jsonData.data.filter((item) => item.id !== id);

    if (jsonData.data.length === initialLength) {
      return NextResponse.json(
        { error: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    const success = await writeData(jsonData);
    if (success) {
      return NextResponse.json({
        success: true,
        message: "Data berhasil dihapus",
      });
    } else {
      throw new Error("Gagal menghapus data");
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
