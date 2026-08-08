import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(false);
SQLite.enablePromise(true);

const database_name = 'diyetisyen.db';
const database_version = '1.0';
const database_displayname = 'Diyetisyen Veritabanı';
const database_size = 200000;

let db;

export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabase(
      database_name,
      database_version,
      database_displayname,
      database_size
    );
    console.log('Veritabanı açıldı');
    await createTables();
    return db;
  } catch (error) {
    console.error('Veritabanı hatası:', error);
    throw error;
  }
};

const createTables = async () => {
  const tables = [
    // Hastalar tablosu
    `CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      birthdate TEXT,
      gender TEXT,
      weight REAL,
      height REAL,
      target_weight REAL,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Kilo takip tablosu
    `CREATE TABLE IF NOT EXISTS weight_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      weight REAL NOT NULL,
      date TEXT NOT NULL,
      notes TEXT,
      FOREIGN KEY (patient_id) REFERENCES patients (id) ON DELETE CASCADE
    )`,
    
    // Vücut ölçüleri tablosu
    `CREATE TABLE IF NOT EXISTS body_measurements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      chest REAL,
      waist REAL,
      hip REAL,
      arm REAL,
      leg REAL,
      date TEXT NOT NULL,
      FOREIGN KEY (patient_id) REFERENCES patients (id) ON DELETE CASCADE
    )`,
    
    // Yemekler tablosu
    `CREATE TABLE IF NOT EXISTS meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      recipe TEXT,
      calories REAL NOT NULL DEFAULT 0,
      protein REAL NOT NULL DEFAULT 0,
      carbs REAL NOT NULL DEFAULT 0,
      fat REAL NOT NULL DEFAULT 0,
      fiber REAL DEFAULT 0,
      serving_size TEXT,
      serving_unit TEXT,
      category TEXT,
      preparation_time INTEGER,
      cooking_time INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )`,
    
    // Malzemeler tablosu
    `CREATE TABLE IF NOT EXISTS ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      meal_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      quantity REAL NOT NULL,
      unit TEXT NOT NULL,
      calories REAL DEFAULT 0,
      protein REAL DEFAULT 0,
      carbs REAL DEFAULT 0,
      fat REAL DEFAULT 0,
      FOREIGN KEY (meal_id) REFERENCES meals (id) ON DELETE CASCADE
    )`,
    
    // Randevular tablosu
    `CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      duration INTEGER DEFAULT 30,
      status TEXT DEFAULT 'planned',
      notes TEXT,
      reminder_sent INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients (id) ON DELETE CASCADE
    )`,
    
    // Muhasebe tablosu
    `CREATE TABLE IF NOT EXISTS accounting (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT,
      category TEXT,
      date TEXT NOT NULL,
      patient_id INTEGER,
      appointment_id INTEGER,
      payment_method TEXT,
      invoice_number TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients (id) ON DELETE SET NULL,
      FOREIGN KEY (appointment_id) REFERENCES appointments (id) ON DELETE SET NULL
    )`,
    
    // Diet planları tablosu
    `CREATE TABLE IF NOT EXISTS diet_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patient_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT,
      target_calories REAL,
      target_protein REAL,
      target_carbs REAL,
      target_fat REAL,
      notes TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patient_id) REFERENCES patients (id) ON DELETE CASCADE
    )`,
    
    // Diet plan günlük yemekler
    `CREATE TABLE IF NOT EXISTS diet_plan_meals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      diet_plan_id INTEGER NOT NULL,
      meal_id INTEGER NOT NULL,
      day_of_week INTEGER NOT NULL,
      meal_time TEXT NOT NULL,
      portion REAL DEFAULT 1,
      notes TEXT,
      FOREIGN KEY (diet_plan_id) REFERENCES diet_plans (id) ON DELETE CASCADE,
      FOREIGN KEY (meal_id) REFERENCES meals (id) ON DELETE CASCADE
    )`
  ];

  for (const table of tables) {
    try {
      await db.executeSql(table);
      console.log('Tablo oluşturuldu');
    } catch (error) {
      console.error('Tablo oluşturma hatası:', error);
    }
  }
};

export const getDatabase = () => {
  if (!db) {
    throw new Error('Veritabanı başlatılmadı. initDatabase() fonksiyonunu çağırın.');
  }
  return db;
};

export const closeDatabase = async () => {
  if (db) {
    await db.close();
    console.log('Veritabanı kapatıldı');
  }
};

export default {
  initDatabase,
  getDatabase,
  closeDatabase
};
