// utils/queueManager.js - SIMPLE FIX
import { db } from "@/lib/db";

// Fungsi untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD (Indonesia timezone)
function getTodayDateString() {
  // Set timezone ke Asia/Jakarta
  const today = new Date();
  const indonesianDate = new Date(
    today.toLocaleString("en-US", {
      timeZone: "Asia/Jakarta",
    })
  );

  const year = indonesianDate.getFullYear();
  const month = String(indonesianDate.getMonth() + 1).padStart(2, "0");
  const day = String(indonesianDate.getDate()).padStart(2, "0");

  const dateString = `${year}-${month}-${day}`;

  // Log untuk debugging
  console.log("Timezone debug:", {
    utc: today.toISOString(),
    indonesia: indonesianDate.toString(),
    dateUsed: dateString,
  });

  return dateString;
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
