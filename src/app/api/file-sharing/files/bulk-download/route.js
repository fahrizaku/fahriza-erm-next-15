// app/api/file-sharing/files/bulk-download/route.js
import { NextResponse } from "next/server";
import { access } from "fs/promises";
import { join } from "path";
import archiver from "archiver";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const uploadsDir = join(process.cwd(), "uploads");

    // Ambil semua file dari database
    const dbFiles = await db.generatedDocument.findMany();

    if (dbFiles.length === 0) {
      return NextResponse.json(
        { message: "Tidak ada file untuk diunduh" },
        { status: 400 }
      );
    }

    // Debug: Log struktur file untuk troubleshooting
    console.log("Files structure:", JSON.stringify(dbFiles[0], null, 2));

    // Validasi file yang ada
    const validFiles = [];
    for (const file of dbFiles) {
      console.log("Processing file:", file);

      // Gunakan filePath dari database terlebih dahulu
      let filePath = file.filePath;

      // Jika filePath tidak ada, coba buat dari fileName
      if (!filePath && file.fileName) {
        filePath = join(uploadsDir, file.fileName);
      }

      // Jika masih tidak ada, skip file ini
      if (!filePath) {
        console.error("File object missing filePath and fileName:", file);
        continue;
      }

      console.log(`Checking file path: ${filePath}`);

      try {
        await access(filePath);
        validFiles.push({
          filePath,
          displayName: file.fileName || filePath.split(/[/\\]/).pop(),
        });
        console.log(`Valid file found: ${filePath}`);
      } catch (error) {
        console.error(`File not accessible: ${filePath}`, error);
      }
    }

    if (validFiles.length === 0) {
      return NextResponse.json(
        {
          message: "Tidak ada file yang valid untuk diunduh",
        },
        { status: 404 }
      );
    }

    console.log(`Found ${validFiles.length} valid files for archive`);

    // Setup response headers
    const headers = new Headers();
    headers.set("Content-Type", "application/zip");
    headers.set(
      "Content-Disposition",
      `attachment; filename="all-files-${
        new Date().toISOString().split("T")[0]
      }.zip"`
    );

    // Buat archive menggunakan Promise-based approach
    return new Promise((resolve) => {
      const archive = archiver("zip", {
        zlib: { level: 9 },
      });

      const chunks = [];

      archive.on("data", (chunk) => {
        chunks.push(chunk);
      });

      archive.on("end", () => {
        console.log("Archive creation completed");
        const buffer = Buffer.concat(chunks);
        console.log(`Final archive size: ${buffer.length} bytes`);

        resolve(new Response(buffer, { headers }));
      });

      archive.on("error", (err) => {
        console.error("Archive error:", err);
        resolve(
          NextResponse.json(
            { message: "Error creating archive: " + err.message },
            { status: 500 }
          )
        );
      });

      archive.on("warning", (err) => {
        console.warn("Archive warning:", err);
      });

      // Tambahkan semua file valid ke archive
      validFiles.forEach(({ filePath, displayName }) => {
        archive.file(filePath, { name: displayName });
        console.log(`Added to archive: ${displayName}`);
      });

      // Finalize archive
      console.log("Finalizing archive...");
      archive.finalize();
    });
  } catch (error) {
    console.error("Error creating bulk download:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat membuat file ZIP: " + error.message },
      { status: 500 }
    );
  } finally {
    await db.$disconnect();
  }
}
