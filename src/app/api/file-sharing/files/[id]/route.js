// app/api/files/[id]/route.js
import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import fs from "fs";

import { db } from "@/lib/db";

export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    // Cari file di database
    const file = await db.generatedDocument.findUnique({
      where: { id: id },
    });

    if (!file) {
      return NextResponse.json(
        { message: "File tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus file dari sistem
    const filePath = file.filePath;
    try {
      if (fs.existsSync(filePath)) {
        await unlink(filePath);
      }
    } catch (error) {
      console.error("Error deleting file from filesystem:", error);
    }

    // Hapus dari database
    await db.generatedDocument.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "File berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat menghapus file" },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}
