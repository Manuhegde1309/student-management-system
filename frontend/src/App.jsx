import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import StartPage from './components/StartPage'
import DepartmentManagement from './components/DepartmentManagement'
import StudentLogin from './components/StudentLogin'
import StudentRegister from './components/StudentRegister'
import TeacherLogin from './components/TeacherLogin'
import TeacherRegister from './components/TeacherRegister'
import StudentDashboard from './components/StudentDashboard'
import TeacherDashboard from './components/TeacherDashboard'
import ProtectedRoute from './components/ProtectedRoute'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/register" element={<StudentRegister />} />
          <Route path="/teacher/login" element={<TeacherLogin />} />
          <Route path="/teacher/register" element={<TeacherRegister />} />
          <Route path="/department/manage" element={<DepartmentManagement />} />
          <Route path="/student/dashboard" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/teacher/dashboard" element={<ProtectedRoute allowedRole="teacher"><TeacherDashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App