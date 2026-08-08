import { getDatabase } from '../db';

export const AppointmentService = {
  // Tüm randevuları getir
  getAllAppointments: async () => {
    const db = getDatabase();
    const [results] = await db.getAllAsync(
      `SELECT a.*, p.name as patient_name, p.phone as patient_phone
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       ORDER BY a.date DESC, a.time DESC`
    );
    return results;
  },

  // Tarih aralığına göre randevuları getir
  getAppointmentsByDateRange: async (startDate, endDate) => {
    const db = getDatabase();
    const [results] = await db.getAllAsync(
      `SELECT a.*, p.name as patient_name, p.phone as patient_phone
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       WHERE a.date BETWEEN ? AND ?
       ORDER BY a.date, a.time`,
      [startDate, endDate]
    );
    return results;
  },

  // Bugünün randevularını getir
  getTodayAppointments: async () => {
    const db = getDatabase();
    const today = new Date().toISOString().split('T')[0];
    const [results] = await db.getAllAsync(
      `SELECT a.*, p.name as patient_name, p.phone as patient_phone
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       WHERE a.date = ?
       ORDER BY a.time`,
      [today]
    );
    return results;
  },

  // Hastanın randevularını getir
  getAppointmentsByPatient: async (patientId) => {
    const db = getDatabase();
    const [results] = await db.getAllAsync(
      `SELECT a.*, p.name as patient_name
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       WHERE a.patient_id = ?
       ORDER BY a.date DESC, a.time DESC`,
      [patientId]
    );
    return results;
  },

  // ID ile randevu getir
  getAppointmentById: async (id) => {
    const db = getDatabase();
    const [results] = await db.getAllAsync(
      `SELECT a.*, p.name as patient_name, p.phone as patient_phone
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       WHERE a.id = ?`,
      [id]
    );
    return results[0];
  },

  // Yeni randevu ekle
  addAppointment: async (appointment) => {
    const db = getDatabase();
    const [result] = await db.getAllAsync(
      `INSERT INTO appointments (patient_id, date, time, duration, status, notes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        appointment.patient_id,
        appointment.date,
        appointment.time,
        appointment.duration || 30,
        appointment.status || 'planned',
        appointment.notes || null
      ]
    );
    return result.lastInsertRowId;
  },

  // Randevu güncelle
  updateAppointment: async (id, appointment) => {
    const db = getDatabase();
    await db.getAllAsync(
      `UPDATE appointments SET patient_id = ?, date = ?, time = ?,
       duration = ?, status = ?, notes = ?
       WHERE id = ?`,
      [
        appointment.patient_id,
        appointment.date,
        appointment.time,
        appointment.duration || 30,
        appointment.status || 'planned',
        appointment.notes || null,
        id
      ]
    );
  },

  // Randevu durumunu güncelle
  updateAppointmentStatus: async (id, status) => {
    const db = getDatabase();
    await db.getAllAsync(
      'UPDATE appointments SET status = ? WHERE id = ?',
      [status, id]
    );
  },

  // Randevu sil
  deleteAppointment: async (id) => {
    const db = getDatabase();
    await db.getAllAsync('DELETE FROM appointments WHERE id = ?', [id]);
  },

  // Yaklaşan randevular (sonraki 7 gün)
  getUpcomingAppointments: async (days = 7) => {
    const db = getDatabase();
    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    const future = futureDate.toISOString().split('T')[0];
    
    const [results] = await db.getAllAsync(
      `SELECT a.*, p.name as patient_name, p.phone as patient_phone
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       WHERE a.date BETWEEN ? AND ? AND a.status != 'cancelled'
       ORDER BY a.date, a.time`,
      [today, future]
    );
    return results;
  }
};

export default AppointmentService;
