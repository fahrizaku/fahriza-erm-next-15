// utils/queueManager.js - FIXED VERSION
import { db } from "@/lib/db";

// Fungsi untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD (Indonesia timezone)
function getTodayDateString() {
  const today = new Date();

  // Konversi ke timezone Indonesia (WIB/WITA/WIT)
  const indonesiaTime = new Date(
    today.toLocaleString("en-US", {
      timeZone: "Asia/Jakarta", // WIB timezone
    })
  );

  // Format ke YYYY-MM-DD
  const year = indonesiaTime.getFullYear();
  const month = String(indonesiaTime.getMonth() + 1).padStart(2, "0");
  const day = String(indonesiaTime.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// Alternative: Menggunakan Intl.DateTimeFormat untuk lebih robust
function getTodayDateStringAlt() {
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    // 'sv-SE' menghasilkan format YYYY-MM-DD
    timeZone: "Asia/Jakarta",
  });

  return formatter.format(new Date());
}

// Fungsi untuk mendapatkan nomor antrian berikutnya
export async function getNextQueueNumber() {
  const today = getTodayDateString();

  // Log untuk debugging
  const currentUTC = new Date().toISOString();
  const currentIndonesia = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  console.log(
    `Queue generation - UTC: ${currentUTC}, Indonesia: ${currentIndonesia}, Date used: ${today}`
  );

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

      console.log(`Last queue for ${today}:`, lastQueue);

      // Tentukan nomor antrian berikutnya
      const nextQueueNumber = lastQueue ? lastQueue.queueNumber + 1 : 1;
      const formattedNumber = String(nextQueueNumber).padStart(3, "0");

      console.log(
        `Next queue number: ${nextQueueNumber}, formatted: ${formattedNumber}`
      );

      // Simpan nomor antrian baru
      const newQueue = await tx.queueTracker.create({
        data: {
          queueNumber: nextQueueNumber,
          formattedNumber: formattedNumber,
          date: today,
          createdAt: new Date(), // Tambahkan timestamp untuk tracking
        },
      });

      console.log("New queue created:", newQueue);

      return {
        queueNumber: newQueue.queueNumber,
        date: newQueue.date,
        formattedNumber: newQueue.formattedNumber,
      };
    });

    return result;
  } catch (error) {
    console.error("Error getting next queue number:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
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

// Fungsi untuk reset antrian (opsional - untuk testing atau maintenance)
export async function resetQueueForDate(dateString = null) {
  const targetDate = dateString || getTodayDateString();

  try {
    const result = await db.queueTracker.deleteMany({
      where: {
        date: targetDate,
      },
    });

    console.log(`Reset queue for ${targetDate}:`, result);
    return result;
  } catch (error) {
    console.error("Error resetting queue:", error);
    throw error;
  }
}

// Fungsi untuk mendapatkan semua antrian dalam rentang tanggal
export async function getQueueByDateRange(startDate, endDate) {
  try {
    const queues = await db.queueTracker.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: [{ date: "desc" }, { queueNumber: "desc" }],
    });

    return queues;
  } catch (error) {
    console.error("Error getting queue by date range:", error);
    throw error;
  }
}

// Cleanup function untuk menutup koneksi db
export async function closeQueueManager() {
  await db.$disconnect();
}

// Fungsi utility untuk debugging timezone
export function debugTimezone() {
  const now = new Date();

  return {
    utc: now.toISOString(),
    indonesia: now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
    dateStringOld: now.toISOString().split("T")[0], // Method lama (bermasalah)
    dateStringNew: getTodayDateString(), // Method baru (fixed)
    serverTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}
