const express = require('express');
const router = express.Router();
const controllers = require('./controllers');

router.get('/student', controllers.getAllStudents);
router.get('/student/:id', controllers.getStudentById);
router.put('/student/:id', controllers.updateStudent);
router.delete('/student/:id', controllers.deleteStudent);
router.post('/student/login', controllers.loginStudent); // Fixed: was studentLogin
router.post('/student/register', controllers.registerStudent);
router.get('/teacher', controllers.getAllTeachers);
router.get('/teacher/:id', controllers.getTeacherById);
router.put('/teacher/:id', controllers.updateTeacher);
router.delete('/teacher/:id', controllers.deleteTeacher);
router.post('/teacher/login', controllers.loginTeacher); // Fixed: was teacherLogin
router.post('/teacher/register', controllers.registerTeacher);
router.get('/course', controllers.getAllCourses);
router.post('/course', controllers.createCourse);
router.get('/department', controllers.getAllDepartments);
router.post('/department', controllers.createDepartment);
router.get('/enrollment/:studentId', controllers.getStudentEnrollments);
router.post('/enrollment', controllers.enrollStudent);

module.exports = router;
