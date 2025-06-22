// utils/queueManager.js
import { db } from "@/lib/db";

// Fungsi untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD
function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
}

// Fungsi untuk mendapatkan nomor antrian berikutnya
export async function getNextQueueNumber() {
  const today = getTodayDateString();

  try {
    // Gunakan transaction untuk memastikan atomicity
    const result = await db.$transaction(async (tx) => {
      // Cari nomor antrian terakhir untuk hari ini
      const lastQueue = await tx.queueTracker.findFirst({
        where: {
          date: today,
        },
        orderBy: {
          queueNumber: "desc",
        },
      });

      // Tentukan nomor antrian berikutnya
      const nextQueueNumber = lastQueue ? lastQueue.queueNumber + 1 : 1;
      const formattedNumber = String(nextQueueNumber).padStart(3, "0");

      // Simpan nomor antrian baru
      const newQueue = await tx.queueTracker.create({
        data: {
          queueNumber: nextQueueNumber,
          formattedNumber: formattedNumber,
          date: today,
        },
      });

      return {
        queueNumber: newQueue.queueNumber,
        date: newQueue.date,
        formattedNumber: newQueue.formattedNumber,
      };
    });

    return result;
  } catch (error) {
    console.error("Error getting next queue number:", error);
    throw error;
  }
}

// Fungsi untuk mendapatkan statistik antrian hari ini
export async function getTodayQueueStats() {
  const today = getTodayDateString();

  try {
    const stats = await db.queueTracker.aggregate({
      where: {
        date: today,
      },
      _count: {
        id: true,
      },
      _max: {
        queueNumber: true,
      },
    });

    return {
      date: today,
      totalQueue: stats._count.id || 0,
      lastNumber: stats._max.queueNumber || 0,
    };
  } catch (error) {
    console.error("Error getting queue stats:", error);
    return {
      date: today,
      totalQueue: 0,
      lastNumber: 0,
    };
  }
}

// Cleanup function untuk menutup koneksi db
export async function closeQueueManager() {
  await db.$disconnect();
}
