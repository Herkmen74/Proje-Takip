import { getDatabase } from '../db';

export const AccountingService = {
  // Tüm kayıtları getir
  getAllRecords: async () => {
    const db = getDatabase();
    const [results] = await db.executeSql(
      `SELECT a.*, p.name as patient_name
       FROM accounting a
       LEFT JOIN patients p ON a.patient_id = p.id
       ORDER BY a.date DESC, a.created_at DESC`
    );
    return results.rows.raw();
  },

  // Tarih aralığına göre kayıtları getir
  getRecordsByDateRange: async (startDate, endDate) => {
    const db = getDatabase();
    const [results] = await db.executeSql(
      `SELECT a.*, p.name as patient_name
       FROM accounting a
       LEFT JOIN patients p ON a.patient_id = p.id
       WHERE a.date BETWEEN ? AND ?
       ORDER BY a.date DESC, a.created_at DESC`,
      [startDate, endDate]
    );
    return results.rows.raw();
  },

  // Tipe göre kayıtları getir (income/expense)
  getRecordsByType: async (type) => {
    const db = getDatabase();
    const [results] = await db.executeSql(
      `SELECT a.*, p.name as patient_name
       FROM accounting a
       LEFT JOIN patients p ON a.patient_id = p.id
       WHERE a.type = ?
       ORDER BY a.date DESC`,
      [type]
    );
    return results.rows.raw();
  },

  // Bugünün kayıtlarını getir
  getTodayRecords: async () => {
    const db = getDatabase();
    const today = new Date().toISOString().split('T')[0];
    const [results] = await db.executeSql(
      `SELECT a.*, p.name as patient_name
       FROM accounting a
       LEFT JOIN patients p ON a.patient_id = p.id
       WHERE a.date = ?
       ORDER BY a.created_at DESC`,
      [today]
    );
    return results.rows.raw();
  },

  // ID ile kayıt getir
  getRecordById: async (id) => {
    const db = getDatabase();
    const [results] = await db.executeSql(
      `SELECT a.*, p.name as patient_name
       FROM accounting a
       LEFT JOIN patients p ON a.patient_id = p.id
       WHERE a.id = ?`,
      [id]
    );
    return results.rows.item(0);
  },

  // Yeni kayıt ekle
  addRecord: async (record) => {
    const db = getDatabase();
    const [result] = await db.executeSql(
      `INSERT INTO accounting (type, amount, description, category, date, 
       patient_id, appointment_id, payment_method, invoice_number)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        record.type,
        record.amount,
        record.description || null,
        record.category || null,
        record.date,
        record.patient_id || null,
        record.appointment_id || null,
        record.payment_method || null,
        record.invoice_number || null
      ]
    );
    return result.insertId;
  },

  // Kayıt güncelle
  updateRecord: async (id, record) => {
    const db = getDatabase();
    await db.executeSql(
      `UPDATE accounting SET type = ?, amount = ?, description = ?,
       category = ?, date = ?, patient_id = ?, payment_method = ?, invoice_number = ?
       WHERE id = ?`,
      [
        record.type,
        record.amount,
        record.description || null,
        record.category || null,
        record.date,
        record.patient_id || null,
        record.payment_method || null,
        record.invoice_number || null,
        id
      ]
    );
  },

  // Kayıt sil
  deleteRecord: async (id) => {
    const db = getDatabase();
    await db.executeSql('DELETE FROM accounting WHERE id = ?', [id]);
  },

  // Özet istatistikler
  getSummary: async (startDate, endDate) => {
    const db = getDatabase();
    
    // Gelirler
    const [incomeResults] = await db.executeSql(
      `SELECT COALESCE(SUM(amount), 0) as total
       FROM accounting
       WHERE type = 'income' AND date BETWEEN ? AND ?`,
      [startDate, endDate]
    );
    
    // Giderler
    const [expenseResults] = await db.executeSql(
      `SELECT COALESCE(SUM(amount), 0) as total
       FROM accounting
       WHERE type = 'expense' AND date BETWEEN ? AND ?`,
      [startDate, endDate]
    );
    
    const income = incomeResults.rows.item(0).total;
    const expense = expenseResults.rows.item(0).total;
    
    return {
      income,
      expense,
      profit: income - expense
    };
  },

  // Kategoriye göre özet
  getSummaryByCategory: async (startDate, endDate) => {
    const db = getDatabase();
    const [results] = await db.executeSql(
      `SELECT category, type, SUM(amount) as total
       FROM accounting
       WHERE date BETWEEN ? AND ? AND category IS NOT NULL
       GROUP BY category, type
       ORDER BY total DESC`,
      [startDate, endDate]
    );
    return results.rows.raw();
  },

  // Aylık özet
  getMonthlySummary: async (year, month) => {
    const db = getDatabase();
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;
    
    return await AccountingService.getSummary(startDate, endDate);
  },

  // Yıllık özet
  getYearlySummary: async (year) => {
    const db = getDatabase();
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;
    
    return await AccountingService.getSummary(startDate, endDate);
  }
};

export default AccountingService;
