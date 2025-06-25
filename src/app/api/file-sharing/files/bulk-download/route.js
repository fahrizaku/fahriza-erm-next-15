// app/api/file-sharing/files/bulk-download/route.js - Updated for Auto Increment
import { NextResponse } from "next/server";
import { access } from "fs/promises";
import { join } from "path";
import archiver from "archiver";
import { db } from "@/lib/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 1000; // Batasi jumlah file untuk performa
    const offset = parseInt(searchParams.get("offset")) || 0;
    const dateFrom = searchParams.get("dateFrom"); // Format: YYYY-MM-DD
    const dateTo = searchParams.get("dateTo"); // Format: YYYY-MM-DD

    const uploadsDir = join(process.cwd(), "uploads");

    // Build where condition untuk filter
    const whereCondition = {};

    if (dateFrom || dateTo) {
      whereCondition.createdAt = {};
      if (dateFrom) {
        whereCondition.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        // Tambah 1 hari untuk include seluruh hari
        const endDate = new Date(dateTo);
        endDate.setDate(endDate.getDate() + 1);
        whereCondition.createdAt.lt = endDate;
      }
    }

    // Ambil file dari database dengan pagination dan filter
    const dbFiles = await db.generatedDocument.findMany({
      where: whereCondition,
      select: {
        id: true, // Sekarang integer
        fileName: true,
        filePath: true,
        createdAt: true,
        queueNumber: true,
        formattedQueueNumber: true,
        queueDate: true,
      },
      orderBy: {
        id: "asc", // Sort berdasarkan ID integer (lebih cepat)
      },
      take: limit,
      skip: offset,
    });

    if (dbFiles.length === 0) {
      return NextResponse.json(
        { message: "Tidak ada file untuk diunduh dalam rentang yang dipilih" },
        { status: 400 }
      );
    }

    // Debug: Log info singkat
    console.log(`Processing ${dbFiles.length} files for bulk download`);

    // Validasi file yang ada
    const validFiles = [];
    const invalidFiles = [];

    for (const file of dbFiles) {
      // Gunakan filePath dari database terlebih dahulu
      let filePath = file.filePath;

      // Jika filePath tidak ada, coba buat dari fileName
      if (!filePath && file.fileName) {
        filePath = join(uploadsDir, file.fileName);
      }

      // Jika masih tidak ada, skip file ini
      if (!filePath) {
        console.error(`File ID ${file.id} missing filePath and fileName`);
        invalidFiles.push({ id: file.id, reason: "Missing path and filename" });
        continue;
      }

      try {
        await access(filePath);

        // Buat nama file unik dalam ZIP untuk avoid conflict
        const fileExtension = file.fileName.split(".").pop();
        const uniqueFileName = `${file.formattedQueueNumber || file.id}_${
          file.fileName
        }`;

        validFiles.push({
          id: file.id, // Integer ID
          filePath,
          displayName: uniqueFileName,
          originalName: file.fileName,
          queueDate: file.queueDate,
        });
      } catch (error) {
        console.error(`File ID ${file.id} not accessible: ${filePath}`);
        invalidFiles.push({
          id: file.id,
          path: filePath,
          reason: "File not found",
        });
      }
    }

    if (validFiles.length === 0) {
      return NextResponse.json(
        {
          message: "Tidak ada file yang valid untuk diunduh",
          invalidFiles: invalidFiles.length,
          details: invalidFiles,
        },
        { status: 404 }
      );
    }

    console.log(
      `Found ${validFiles.length} valid files, ${invalidFiles.length} invalid files`
    );

    // Generate ZIP filename dengan timestamp
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, "-").split("T")[0];
    const zipFileName = `dokumen-vaksin-${timestamp}-${validFiles.length}files.zip`;

    // Setup response headers
    const headers = new Headers();
    headers.set("Content-Type", "application/zip");
    headers.set("Content-Disposition", `attachment; filename="${zipFileName}"`);
    headers.set("X-Total-Files", validFiles.length.toString());
    headers.set("X-Invalid-Files", invalidFiles.length.toString());

    // Buat archive menggunakan Promise-based approach
    return new Promise((resolve) => {
      const archive = archiver("zip", {
        zlib: { level: 6 }, // Balance antara speed dan compression
        gzip: false,
      });

      const chunks = [];
      let totalSize = 0;

      archive.on("data", (chunk) => {
        chunks.push(chunk);
        totalSize += chunk.length;
      });

      archive.on("progress", (progress) => {
        console.log(
          `Archive progress: ${progress.entries.processed}/${progress.entries.total} files`
        );
      });

      archive.on("end", () => {
        console.log(
          `Archive creation completed. Total size: ${totalSize} bytes`
        );
        const buffer = Buffer.concat(chunks);

        resolve(new Response(buffer, { headers }));
      });

      archive.on("error", (err) => {
        console.error("Archive error:", err);
        resolve(
          NextResponse.json(
            {
              message: "Error creating archive: " + err.message,
              validFiles: validFiles.length,
              invalidFiles: invalidFiles.length,
            },
            { status: 500 }
          )
        );
      });

      archive.on("warning", (err) => {
        console.warn("Archive warning:", err);
      });

      // Kelompokkan file berdasarkan tanggal untuk struktur folder yang rapi
      const filesByDate = validFiles.reduce((acc, file) => {
        const date = file.queueDate || "unknown-date";
        if (!acc[date]) acc[date] = [];
        acc[date].push(file);
        return acc;
      }, {});

      // Tambahkan file ke archive dengan struktur folder berdasarkan tanggal
      Object.entries(filesByDate).forEach(([date, files]) => {
        files.forEach(({ filePath, displayName, id }) => {
          const archivePath = `${date}/${displayName}`;
          archive.file(filePath, { name: archivePath });
          console.log(`Added to archive: ID ${id} -> ${archivePath}`);
        });
      });

      // Tambahkan file info sebagai text file
      const fileList = validFiles
        .map(
          (file) =>
            `ID: ${file.id} | Queue: ${file.displayName} | Date: ${file.queueDate} | Original: ${file.originalName}`
        )
        .join("\n");

      archive.append(fileList, { name: "file-list.txt" });

      // Log ringkasan
      console.log(`Finalizing archive with ${validFiles.length} files...`);
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
