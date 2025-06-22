// utils/queueManager.js
import fs from "fs";
import path from "path";

const QUEUE_FILE_PATH = path.join(process.cwd(), "uploads", "queue.json");

// Fungsi untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD
function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
}

// Fungsi untuk membaca data antrian
function readQueueData() {
  try {
    if (!fs.existsSync(QUEUE_FILE_PATH)) {
      return {
        date: getTodayDateString(),
        lastNumber: 0,
        queue: [],
      };
    }

    const data = fs.readFileSync(QUEUE_FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading queue data:", error);
    return {
      date: getTodayDateString(),
      lastNumber: 0,
      queue: [],
    };
  }
}

// Fungsi untuk menyimpan data antrian
function saveQueueData(data) {
  try {
    // Pastikan direktori uploads ada
    const uploadDir = path.dirname(QUEUE_FILE_PATH);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    fs.writeFileSync(QUEUE_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error saving queue data:", error);
    throw error;
  }
}

// Fungsi untuk mendapatkan nomor antrian berikutnya
export function getNextQueueNumber() {
  const today = getTodayDateString();
  let queueData = readQueueData();

  // Jika tanggal berbeda, reset nomor antrian
  if (queueData.date !== today) {
    queueData = {
      date: today,
      lastNumber: 0,
      queue: [],
    };
  }

  // Increment nomor antrian
  queueData.lastNumber += 1;
  const queueNumber = queueData.lastNumber;

  // Simpan data yang sudah diupdate
  saveQueueData(queueData);

  return {
    queueNumber,
    date: today,
    formattedNumber: String(queueNumber).padStart(3, "0"), // Format: 001, 002, dst
  };
}

// Fungsi untuk menambahkan data ke antrian (opsional, untuk tracking)
export function addToQueue(formData, queueInfo) {
  const queueData = readQueueData();

  queueData.queue.push({
    queueNumber: queueInfo.queueNumber,
    nama: formData.nama,
    createdAt: new Date().toISOString(),
    ...queueInfo,
  });

  saveQueueData(queueData);
}

// Fungsi untuk mendapatkan statistik antrian hari ini
export function getTodayQueueStats() {
  const today = getTodayDateString();
  let queueData = readQueueData();

  if (queueData.date !== today) {
    return {
      date: today,
      totalQueue: 0,
      lastNumber: 0,
    };
  }

  return {
    date: queueData.date,
    totalQueue: queueData.lastNumber,
    lastNumber: queueData.lastNumber,
  };
}
