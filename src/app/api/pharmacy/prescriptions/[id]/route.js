// /app/api/pharmacy/prescriptions/[id]/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request, { params }) {
  try {
    const medicalRecordId = parseInt(params.id);
    
    // Get pharmacy queue and prescription details
    const queueItem = await db.pharmacyQueue.findUnique({
      where: { medicalRecordId },
      include: {
        medicalRecord: {
          include: {
            patient: true,
            prescriptions: {
              include: {
                items: true
              }
            }
          }
        }
      }
    });
    
    if (!queueItem) {
      return NextResponse.json(
        { success: false, message: "Prescription not found" },
        { status: 404 }
      );
    }
    
    // Format data for the frontend
    const prescription = {
      id: queueItem.id,
      medicalRecordId: queueItem.medicalRecordId,
      queueNumber: queueItem.queueNumber,
      status: queueItem.status,
      patientId: queueItem.medicalRecord.patient.id,
      patientName: queueItem.medicalRecord.patient.name,
      gender: queueItem.medicalRecord.patient.gender,
      birthDate: queueItem.medicalRecord.patient.birthDate,
      visitDate: queueItem.medicalRecord.visitDate,
      diagnosis: queueItem.medicalRecord.diagnosis,
      icdCode: queueItem.medicalRecord.icdCode,
      doctorName: queueItem.medicalRecord.doctorName,
      pharmacistName: queueItem.pharmacistName,
      notes: queueItem.notes,
      createdAt: queueItem.createdAt,
      updatedAt: queueItem.updatedAt,
      isBPJSActive: queueItem.medicalRecord.patient.isBPJS,
      prescriptions: queueItem.medicalRecord.prescriptions.map(rx => ({
        id: rx.id,
        prescriptionType: rx.prescriptionType,
        notes: rx.notes,
        dosage: rx.dosage, // For racikan prescriptions
        items: rx.items.map(item => ({
          id: item.id,
          manualDrugName: item.manualDrugName,
          dosage: item.dosage, // For regular prescriptions
          quantity: item.quantity
        }))
      }))
    };
    
    return NextResponse.json({
      success: true,
      prescription
    });
    
  } catch (error) {
    console.error("Error fetching prescription details:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch prescription details" },
      { status: 500 }
    );
  }
}