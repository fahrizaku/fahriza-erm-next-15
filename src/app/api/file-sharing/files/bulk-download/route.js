// app/api/file-sharing/files/bulk-download/route.js
import { NextResponse } from "next/server";
import { readFile, access } from "fs/promises";
import { join } from "path";
import archiver from "archiver";

export async function GET() {
  try {
    const dbPath = join(process.cwd(), "uploads", "db.json");
    const uploadsDir = join(process.cwd(), "uploads");
    
    let db = { files: [] };
    
    try {
      const dbContent = await readFile(dbPath, "utf-8");
      db = JSON.parse(dbContent);
    } catch (error) {
      return NextResponse.json({ message: "Database tidak ditemukan" }, { status: 404 });
    }

    if (db.files.length === 0) {
      return NextResponse.json({ message: "Tidak ada file untuk diunduh" }, { status: 400 });
    }

    // Debug: Log struktur file untuk troubleshooting
    console.log("Files structure:", JSON.stringify(db.files[0], null, 2));

    // Validasi file yang ada
    const validFiles = [];
    for (const file of db.files) {
      const filename = file.filename || file.fileName || file.path || file.id;
      
      if (!filename) {
        console.error("File object missing filename:", file);
        continue;
      }

      // Cek apakah filename sudah full path atau hanya nama file
      let filePath;
      if (filename.startsWith('/') || filename.includes(process.cwd())) {
        // Sudah full path
        filePath = filename;
      } else {
        // Hanya nama file, tambahkan uploads directory
        filePath = join(uploadsDir, filename);
      }

      console.log(`Checking file path: ${filePath}`);
      
      try {
        await access(filePath);
        validFiles.push({
          filePath,
          displayName: file.name || file.originalName || filename
        });
        console.log(`Valid file found: ${filePath}`);
      } catch (error) {
        console.error(`File not accessible: ${filePath}`, error);
      }
    }
    
    if (validFiles.length === 0) {
      return NextResponse.json({ 
        message: "Tidak ada file yang valid untuk diunduh" 
      }, { status: 404 });
    }

    console.log(`Found ${validFiles.length} valid files for archive`);

    // Setup response headers
    const headers = new Headers();
    headers.set("Content-Type", "application/zip");
    headers.set("Content-Disposition", `attachment; filename="all-files-${new Date().toISOString().split('T')[0]}.zip"`);

    // Buat archive menggunakan Promise-based approach
    return new Promise((resolve) => {
      const archive = archiver("zip", { 
        zlib: { level: 9 }
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
        resolve(NextResponse.json(
          { message: "Error creating archive: " + err.message },
          { status: 500 }
        ));
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
  }
}