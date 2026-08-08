import { getDatabase } from '../db';

export const PatientService = {
  // Tüm hastaları getir
  getAllPatients: async () => {
    const db = getDatabase();
    const [results] = await db.getAllAsync(
      'SELECT * FROM patients ORDER BY created_at DESC'
    );
    return results;
  },

  // ID ile hasta getir
  getPatientById: async (id) => {
    const db = getDatabase();
    const [results] = await db.getAllAsync(
      'SELECT * FROM patients WHERE id = ?',
      [id]
    );
    return results[0];
  },

  // Hasta ara
  searchPatients: async (query) => {
    const db = getDatabase();
    const [results] = await db.getAllAsync(
      'SELECT * FROM patients WHERE name LIKE ? OR phone LIKE ? OR email LIKE ? ORDER BY name',
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    return results;
  },

  // Yeni hasta ekle
  addPatient: async (patient) => {
    const db = getDatabase();
    const [result] = await db.getAllAsync(
      `INSERT INTO patients (name, phone, email, birthdate, gender, weight, height, target_weight, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        patient.name,
        patient.phone || null,
        patient.email || null,
        patient.birthdate || null,
        patient.gender || null,
        patient.weight || null,
        patient.height || null,
        patient.target_weight || null,
        patient.notes || null
      ]
    );
    return result.lastInsertRowId;
  },

  // Hasta güncelle
  updatePatient: async (id, patient) => {
    const db = getDatabase();
    await db.getAllAsync(
      `UPDATE patients SET name = ?, phone = ?, email = ?, birthdate = ?,
       gender = ?, weight = ?, height = ?, target_weight = ?, notes = ?
       WHERE id = ?`,
      [
        patient.name,
        patient.phone || null,
        patient.email || null,
        patient.birthdate || null,
        patient.gender || null,
        patient.weight || null,
        patient.height || null,
        patient.target_weight || null,
        patient.notes || null,
        id
      ]
    );
  },

  // Hasta sil
  deletePatient: async (id) => {
    const db = getDatabase();
    await db.getAllAsync('DELETE FROM patients WHERE id = ?', [id]);
  },

  // Hasta istatistikleri
  getPatientStats: async (patientId) => {
    const db = getDatabase();
    
    // Toplam randevu sayısı
    const [appointmentResults] = await db.getAllAsync(
      'SELECT COUNT(*) as count FROM appointments WHERE patient_id = ?',
      [patientId]
    );
    
    // Son 30 gün kilo değişimi
    const [weightResults] = await db.getAllAsync(
      `SELECT weight, date FROM weight_history 
       WHERE patient_id = ? 
       ORDER BY date DESC LIMIT 30`,
      [patientId]
    );
    
    return {
      totalAppointments: appointmentResults.rows.item(0).count,
      weightHistory: weightResults)
    };
  }
};

export default PatientService;
