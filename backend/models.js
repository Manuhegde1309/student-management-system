const { DataTypes } = require('sequelize');
const Sequelize = require('./db');

const db = {};

db.sequelize = Sequelize;
db.Student = Sequelize.define('student', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phone: DataTypes.STRING,
    gender: DataTypes.ENUM('Male', 'Female', 'Other'),
    dateOfBirth: DataTypes.DATEONLY,
    enrollmentDate: DataTypes.DATEONLY,
    status: DataTypes.ENUM('active', 'inactive', 'graduated', 'expelled'),
})

db.Course = Sequelize.define('course', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    code: { type: DataTypes.STRING, unique: true },
    credits: DataTypes.INTEGER,
    description: DataTypes.TEXT
})

db.Enrollment = Sequelize.define('enrollment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    semester: DataTypes.STRING,
    year: DataTypes.INTEGER,
    enrollmentDate: DataTypes.DATEONLY,
    grade: DataTypes.STRING
})

db.Teacher = Sequelize.define('teacher', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phone: DataTypes.STRING,
    hireDate: DataTypes.DATEONLY,
    designation: DataTypes.STRING
})

db.Department = Sequelize.define('department', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING
})

db.Attendance = Sequelize.define('attendance', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    attendanceDate: DataTypes.DATEONLY,
    status: DataTypes.ENUM('Present', 'Absent', 'Late', 'Excused')
})

db.Student.belongsToMany(db.Course, { through: db.Enrollment, foreignKey: 'studentId' });
db.Course.belongsToMany(db.Student, { through: db.Enrollment, foreignKey: 'courseId' });

db.Department.hasMany(db.Teacher);
db.Teacher.belongsTo(db.Department);

db.Department.hasMany(db.Course);
db.Course.belongsTo(db.Department);

db.Teacher.hasMany(db.Course);
db.Course.belongsTo(db.Teacher);

db.Student.hasMany(db.Attendance);
db.Attendance.belongsTo(db.Student);

db.Course.hasMany(db.Attendance);
db.Attendance.belongsTo(db.Course);

module.exports = db;