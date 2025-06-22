// app/api/file-sharing/files/bulk-delete/route.js
import { NextResponse } from "next/server";
import { readFile, writeFile, unlink, readdir, access } from "fs/promises";
import { join } from "path";

export async function DELETE() {
  try {
    const dbPath = join(process.cwd(), "uploads", "db.json");
    const uploadsDir = join(process.cwd(), "uploads");

    let db = { files: [] };

    try {
      const dbContent = await readFile(dbPath, "utf-8");
      db = JSON.parse(dbContent);
    } catch (error) {
      return NextResponse.json(
        { message: "Database tidak ditemukan" },
        { status: 404 }
      );
    }

    if (db.files.length === 0) {
      return NextResponse.json(
        { message: "Tidak ada file untuk dihapus" },
        { status: 400 }
      );
    }

    // Debug: List semua file yang ada di directory uploads
    let existingFiles = [];
    try {
      existingFiles = await readdir(uploadsDir);
      console.log("Files in uploads directory:", existingFiles);
    } catch (error) {
      console.error("Error reading uploads directory:", error);
    }

    // Debug: Log struktur database
    console.log("Database files:", db.files);

    const deleteResults = [];

    // Hapus file satu per satu dengan logging yang detail
    for (const file of db.files) {
      const result = {
        file: file,
        filename: null,
        filePath: null,
        exists: false,
        deleted: false,
        error: null,
      };

      try {
        // Extract filename dari path atau buat dari id + name
        let filename;

        if (file.path) {
          // Extract filename dari absolute path
          filename = file.path.split("\\").pop().split("/").pop();
        } else if (file.id && file.name) {
          // Buat filename dari pattern id_name
          filename = `${file.id}_${file.name}`;
        } else {
          result.error = "Cannot determine filename from file object";
          deleteResults.push(result);
          continue;
        }

        result.filename = filename;
        result.filePath = join(uploadsDir, filename);

        // Cek apakah file benar-benar ada
        try {
          await access(result.filePath);
          result.exists = true;
        } catch {
          result.exists = false;
          result.error = "File does not exist";
        }

        // Hapus file jika ada
        if (result.exists) {
          await unlink(result.filePath);
          result.deleted = true;
          console.log(`✅ Successfully deleted: ${filename}`);
        } else {
          console.log(`❌ File not found: ${filename} at ${result.filePath}`);
        }
      } catch (error) {
        result.error = error.message;
        console.error(`❌ Error deleting ${result.filename}:`, error);
      }

      deleteResults.push(result);
    }

    // Kosongkan database
    db.files = [];
    await writeFile(dbPath, JSON.stringify(db, null, 2));

    // Hitung statistik
    const totalFiles = deleteResults.length;
    const deletedFiles = deleteResults.filter((r) => r.deleted).length;
    const notFoundFiles = deleteResults.filter((r) => !r.exists).length;
    const errorFiles = deleteResults.filter((r) => r.error && r.exists).length;

    console.log(`📊 Delete Summary:
    - Total files in DB: ${totalFiles}
    - Successfully deleted: ${deletedFiles}
    - Files not found: ${notFoundFiles}
    - Files with errors: ${errorFiles}`);

    return NextResponse.json({
      message: `Proses delete selesai: ${deletedFiles}/${totalFiles} file berhasil dihapus`,
      summary: {
        total: totalFiles,
        deleted: deletedFiles,
        notFound: notFoundFiles,
        errors: errorFiles,
      },
      details: deleteResults, // Include detailed results for debugging
    });
  } catch (error) {
    console.error("Error deleting all files:", error);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan saat menghapus file",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
