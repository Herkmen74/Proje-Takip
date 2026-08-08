import { getDatabase } from '../db';

export const WeightService = {
  // Hastanın kilo geçmişini getir
  getWeightHistory: async (patientId, limit = 30) => {
    const db = getDatabase();
    const [results] = await db.getAllAsync(
      `SELECT * FROM weight_history 
       WHERE patient_id = ? 
       ORDER BY date DESC LIMIT ?`,
      [patientId, limit]
    );
    return results;
  },

  // Kilo kaydı ekle
  addWeightRecord: async (patientId, weight, date, notes = null) => {
    const db = getDatabase();
    
    // Weight history'ye ekle
    const [result] = await db.getAllAsync(
      'INSERT INTO weight_history (patient_id, weight, date, notes) VALUES (?, ?, ?, ?)',
      [patientId, weight, date, notes]
    );
    
    // Hastanın mevcut kilosunu güncelle
    await db.getAllAsync(
      'UPDATE patients SET weight = ? WHERE id = ?',
      [weight, patientId]
    );
    
    return result.lastInsertRowId;
  },

  // Kilo kaydı sil
  deleteWeightRecord: async (id) => {
    const db = getDatabase();
    await db.getAllAsync('DELETE FROM weight_history WHERE id = ?', [id]);
  }
};

export const BodyMeasurementService = {
  // Vücut ölçülerini getir
  getMeasurements: async (patientId, limit = 10) => {
    const db = getDatabase();
    const [results] = await db.getAllAsync(
      `SELECT * FROM body_measurements 
       WHERE patient_id = ? 
       ORDER BY date DESC LIMIT ?`,
      [patientId, limit]
    );
    return results;
  },

  // Ölçü ekle
  addMeasurement: async (patientId, measurements, date) => {
    const db = getDatabase();
    const [result] = await db.getAllAsync(
      `INSERT INTO body_measurements (patient_id, chest, waist, hip, arm, leg, date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        patientId,
        measurements.chest || null,
        measurements.waist || null,
        measurements.hip || null,
        measurements.arm || null,
        measurements.leg || null,
        date
      ]
    );
    return result.lastInsertRowId;
  },

  // Ölçü sil
  deleteMeasurement: async (id) => {
    const db = getDatabase();
    await db.getAllAsync('DELETE FROM body_measurements WHERE id = ?', [id]);
  }
};

export default { WeightService, BodyMeasurementService };
