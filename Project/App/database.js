const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath);

// Create tables if they don't exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Account (
      AccountID INTEGER PRIMARY KEY AUTOINCREMENT,
      Email VARCHAR(255) NOT NULL,
      Password VARCHAR(255) NOT NULL,
      IsMedicalProvider BOOLEAN 
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS User (
      UserID INTEGER PRIMARY KEY AUTOINCREMENT,
      AccountID INTEGER,
      Name VARCHAR(255),
      Address VARCHAR(255),
      ContactNumber VARCHAR(255),
      City VARCHAR(255),
      State VARCHAR(255),
      FOREIGN KEY (AccountID) REFERENCES Account(AccountID)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Clinic (
      ClinicID INTEGER PRIMARY KEY AUTOINCREMENT,
      Location VARCHAR(255),
      Name VARCHAR(255)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS MedicalProvider (
      MedicalProviderID INTEGER PRIMARY KEY AUTOINCREMENT,
      AccountID INTEGER,
      ClinicID INTEGER,
      Certificate VARCHAR(255),
      IsAuthenticated BOOLEAN,
      Address VARCHAR(255),
      ContactNumber VARCHAR(255),
      City VARCHAR(255),
      State VARCHAR(255),
      FOREIGN KEY (AccountID) REFERENCES Account(AccountID),
      FOREIGN KEY (ClinicID) REFERENCES Clinic(ClinicID)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Appointment (
      AppointmentID INTEGER PRIMARY KEY AUTOINCREMENT,
      UserID INTEGER,
      MedicalProviderID INTEGER,
      Date DATE,
      FOREIGN KEY (UserID) REFERENCES User(UserID),
      FOREIGN KEY (MedicalProviderID) REFERENCES MedicalProvider(MedicalProviderID)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Service (
      ServiceID INTEGER PRIMARY KEY AUTOINCREMENT,
      Name VARCHAR(255),
      Cost DECIMAL(10, 2),
      Description TEXT,
      MedicalProviderID INTEGER,
      FOREIGN KEY (MedicalProviderID) REFERENCES MedicalProvider(MedicalProviderID)
    )
  `);
});

module.exports = db;