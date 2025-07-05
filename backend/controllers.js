const db = require("./models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const generateToken = (id, userType) => {
    return jwt.sign({ id, userType }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Student Read/Delete Operations (for admin use)
exports.getAllStudents = async (req, res) => {
    try {
        const students = await db.Student.findAll({
            attributes: { exclude: ['password'] } // Don't return passwords
        });
        res.status(200).json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.getStudentById = async (req, res) => {
    const studentId = req.params.id;
    try {
        const studentData = await db.Student.findByPk(studentId, {
            attributes: { exclude: ['password'] }
        });
        if (!studentData) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json(studentData);
    } catch (error) {
        console.error("Error fetching student:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// Admin can update student profile (not password)
exports.updateStudent = async (req, res) => {
    try {
        const { password, ...updateData } = req.body; // Remove password from updates
        const student = await db.Student.findByPk(req.params.id);
        if (!student) return res.status(404).json({ error: 'Student not found' });

        await student.update(updateData);
        res.json({ message: 'Student updated successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Error updating student' });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const student = await db.Student.findByPk(req.params.id);
        if (!student) return res.status(404).json({ error: 'Student not found' });

        await student.destroy();
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting student' });
    }
};

// Teacher Read/Delete Operations (for admin use)
exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await db.Teacher.findAll({
            attributes: { exclude: ['password'] }
        });
        res.status(200).json(teachers);
    } catch (error) {
        console.error("Error fetching teachers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.getTeacherById = async (req, res) => {
    const teacherId = req.params.id;
    try {
        const teacher = await db.Teacher.findByPk(teacherId, {
            attributes: { exclude: ['password'] }
        });
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        res.status(200).json(teacher);
    } catch (error) {
        console.error("Error fetching teacher:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.updateTeacher = async (req, res) => {
    try {
        const { password, ...updateData } = req.body;
        const teacher = await db.Teacher.findByPk(req.params.id);
        if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

        await teacher.update(updateData);
        res.json({ message: 'Teacher updated successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Error updating teacher' });
    }
};

exports.deleteTeacher = async (req, res) => {
    try {
        const teacher = await db.Teacher.findByPk(req.params.id);
        if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

        await teacher.destroy();
        res.json({ message: 'Teacher deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Error deleting teacher' });
    }
};

// Authentication Controllers (User self-registration)
exports.registerStudent = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        const existingStudent = await db.Student.findOne({
            where: {
                [Op.or]: [{ username }, { email }]
            }
        });

        if (existingStudent) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = await db.Student.create({
            username,
            email,
            password: hashedPassword,
            status: 'active'
        });

        res.status(201).json({ message: 'Student registered successfully' });
    } catch (error) {
        console.error('Student registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

exports.loginStudent = async (req, res) => {
    try {
        const { username, password } = req.body;

        const student = await db.Student.findOne({ where: { username } });

        if (!student || !(await bcrypt.compare(password, student.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(student.id, 'student');

        res.json({
            token,
            user: {
                id: student.id,
                username: student.username,
                email: student.email,
                userType: 'student'
            }
        });
    } catch (error) {
        console.error('Student login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

exports.registerTeacher = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        const existingTeacher = await db.Teacher.findOne({
            where: {
                [Op.or]: [{ username }, { email }]
            }
        });

        if (existingTeacher) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const teacher = await db.Teacher.create({
            username,
            email,
            password: hashedPassword
        });

        res.status(201).json({ message: 'Teacher registered successfully' });
    } catch (error) {
        console.error('Teacher registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

exports.loginTeacher = async (req, res) => {
    try {
        const { username, password } = req.body;

        const teacher = await db.Teacher.findOne({ where: { username } });

        if (!teacher || !(await bcrypt.compare(password, teacher.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(teacher.id, 'teacher');

        res.json({
            token,
            user: {
                id: teacher.id,
                username: teacher.username,
                email: teacher.email,
                userType: 'teacher'
            }
        });
    } catch (error) {
        console.error('Teacher login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await db.Course.findAll();
        res.status(200).json(courses);
    }
    catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.createCourse = async (req, res) => {
    const { name, code, credits, description, departmentId, teacherId } = req.body;
    const course = await db.Course.create({ name, code, credits, description, departmentId, teacherId });
    res.status(201).json(course);
};

exports.getStudentEnrollments = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Get enrollments with course information
        const enrollments = await db.Enrollment.findAll({
            where: { studentId },
            include: [{
                model: db.Course,
                attributes: ['id', 'name', 'description', 'credits', 'code']
            }],
            attributes: ['id', 'semester', 'year', 'grade', 'enrollmentDate', 'courseId']
        });

        if (!enrollments) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(enrollments);
    } catch (error) {
        console.error('Error fetching student enrollments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.enrollStudent = async (req, res) => {
    try {
        const { studentId, courseId, semester, year } = req.body;
        const enrollment = await db.Enrollment.create({ studentId, courseId, semester, year, enrollmentDate: new Date() });
        res.status(201).json(enrollment);
    } catch (error) {
        console.error('Error enrolling student:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.createDepartment = async (req, res) => {
    try {
        const { name, description, headOfDepartment } = req.body;

        // Check if department already exists
        const existingDepartment = await db.Department.findOne({
            where: { name }
        });

        if (existingDepartment) {
            return res.status(400).json({ error: 'Department already exists' });
        }

        const department = await db.Department.create({
            name,
            description,
            headOfDepartment
        });

        res.status(201).json({
            message: 'Department created successfully',
            department: {
                id: department.id,
                name: department.name,
                description: department.description,
                headOfDepartment: department.headOfDepartment
            }
        });
    } catch (error) {
        console.error('Department creation error:', error);
        res.status(500).json({ error: 'Failed to create department' });
    }
};

exports.getAllDepartments = async (req, res) => {
    try {
        const departments = await db.Department.findAll({
            attributes: ['id', 'name', 'description', 'headOfDepartment', 'createdAt'],
            include: [
                {
                    model: db.Course,
                    attributes: ['id', 'name', 'code'],
                    required: false
                },
                {
                    model: db.Teacher,
                    attributes: ['id', 'firstName', 'lastName', 'username'],
                    required: false
                }
            ]
        });

        res.json(departments);
    } catch (error) {
        console.error('Error fetching departments:', error);
        res.status(500).json({ error: 'Failed to fetch departments' });
    }
};

exports.getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;

        const department = await db.Department.findByPk(id, {
            include: [
                {
                    model: db.Course,
                    attributes: ['id', 'name', 'code', 'credits'],
                    required: false
                },
                {
                    model: db.Teacher,
                    attributes: ['id', 'firstName', 'lastName', 'username', 'email'],
                    required: false
                }
            ]
        });

        if (!department) {
            return res.status(404).json({ error: 'Department not found' });
        }

        res.json(department);
    } catch (error) {
        console.error('Error fetching department:', error);
        res.status(500).json({ error: 'Failed to fetch department' });
    }
};

exports.updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, headOfDepartment } = req.body;

        const department = await db.Department.findByPk(id);
        if (!department) {
            return res.status(404).json({ error: 'Department not found' });
        }

        // Check if name is being changed and if it already exists
        if (name !== department.name) {
            const existingDepartment = await db.Department.findOne({
                where: { name }
            });
            if (existingDepartment) {
                return res.status(400).json({ error: 'Department name already exists' });
            }
        }

        await department.update({
            name: name || department.name,
            description: description || department.description,
            headOfDepartment: headOfDepartment || department.headOfDepartment
        });

        res.json({
            message: 'Department updated successfully',
            department: {
                id: department.id,
                name: department.name,
                description: department.description,
                headOfDepartment: department.headOfDepartment
            }
        });
    } catch (error) {
        console.error('Error updating department:', error);
        res.status(500).json({ error: 'Failed to update department' });
    }
};

exports.deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;

        const department = await db.Department.findByPk(id);
        if (!department) {
            return res.status(404).json({ error: 'Department not found' });
        }

        // Check if department has courses or teachers
        const coursesCount = await db.Course.count({ where: { departmentId: id } });
        const teachersCount = await db.Teacher.count({ where: { departmentId: id } });

        if (coursesCount > 0 || teachersCount > 0) {
            return res.status(400).json({
                error: 'Cannot delete department. It has associated courses or teachers.'
            });
        }

        await department.destroy();
        res.json({ message: 'Department deleted successfully' });
    } catch (error) {
        console.error('Error deleting department:', error);
        res.status(500).json({ error: 'Failed to delete department' });
    }
};


