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
router.get('/department/:id', controllers.getDepartmentById);
router.put('/department/:id', controllers.updateDepartment);
router.delete('/department/:id', controllers.deleteDepartment);
router.get('/enrollment/:studentId', controllers.getStudentEnrollments);
router.post('/enrollment', controllers.enrollStudent);
router.post('/course-room', controllers.createCourseRoom);
router.get('/course-room/teacher', controllers.getTeacherRooms);
router.get('/course-room/student', controllers.getStudentRooms);
module.exports = router;
