const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Nạp biến môi trường từ .env
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 3000; // Cổng frontend

// Middleware để parse dữ liệu từ biểu mẫu
app.use(express.json()); // Để xử lý các yêu cầu có body dưới dạng JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Phục vụ các tệp tĩnh (HTML, CSS, JS)
app.use(cookieParser()); // Sử dụng cookie-parser

// URL của các dịch vụ khác (lấy từ biến môi trường hoặc mặc định)
const EMPLOYEE_API_URL = process.env.EMPLOYEE_API_URL || 'http://employee_services:3001';
const DEPARTMENT_API_URL = process.env.DEPARTMENT_API_URL || 'http://department_services:3002';
const AUTHENTICATION_API_URL = process.env.AUTHENTICATION_API_URL || 'http://authentication_services:3003';

// Route để lấy danh sách nhân viên
app.get('/api/employees', (req, res) => {
  axios.get(`${EMPLOYEE_API_URL}/employees`)
    .then(response => {
      res.json(response.data); // Trả về dữ liệu danh sách nhân viên
    })
    .catch(error => {
      console.error('Error fetching employee data:', error);
      res.status(500).send('Error fetching employee data');
    });
});

// Thêm nhân viên
app.post('/api/employees', (req, res) => {
  const employeeData = req.body; // Lấy dữ liệu từ biểu mẫu nhân viên

  axios.post(`${EMPLOYEE_API_URL}/employees`, employeeData)
    .then(response => {
      const successMessage = 'Employee added successfully!';
      if (response.data.message === 'Department exists.') {
        res.redirect('/add_employ.html?message=' + encodeURIComponent(successMessage));
      } else if (response.data.message === 'Department does not exist.') {
        const errorMessage = 'Phòng ban không tồn tại';
        res.redirect('/add_employ.html?error=' + encodeURIComponent(errorMessage));
      } else {
        const unexpectedMessage = 'Unexpected server response';
        res.redirect('/add_employ.html?message=' + encodeURIComponent(unexpectedMessage));
      }
    })
    .catch(error => {
      console.error('Error adding employee:', error);
      const generalErrorMessage = error.response?.data?.message === 'Department does not exist.'
        ? 'Phòng ban không tồn tại'
        : 'Failed to connect to the employee service';
      res.redirect('/add_employ.html?error=' + encodeURIComponent(generalErrorMessage));
    });
});

// Route để thêm phòng ban
app.post('/api/department', (req, res) => {
  const departmentData = req.body;

  axios.post(`${DEPARTMENT_API_URL}/department`, departmentData)
    .then(response => {
      const successMessage = 'Department added successfully!';
      res.redirect('/Department_add.html?message=' + encodeURIComponent(successMessage));
    })
    .catch(error => {
      console.error('Error adding department:', error);
      res.status(500).json({ error: 'Failed to add department' });
    });
});

// Route để lấy danh sách phòng ban
app.get('/api/department', (req, res) => {
  axios.get(`${DEPARTMENT_API_URL}/department`)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.error('Error fetching department data:', error);
      res.status(500).send('Error fetching department data');
    });
});

// Route cho trang chính, hiển thị form thêm phòng ban
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/Authentication.html');
});

// Route để lấy nhân viên theo phòng ban
app.post('/api/department/employee', (req, res) => {
  const departmentName = req.body.loaiPhong;

  axios.get(`${DEPARTMENT_API_URL}/department/employees?department=${departmentName}`)
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.error('Error fetching employees for department:', error);
      res.status(500).send('Error fetching employees for department');
    });
});

// Xóa nhân viên
app.post('/api/employees/delete', (req, res) => {
  const { name } = req.body;

  axios.post(`${EMPLOYEE_API_URL}/employees/delete`, { name })
    .then(response => {
      res.json({ message: 'Employee deleted successfully!' });
    })
    .catch(error => {
      console.error('Error deleting employee:', error);
      res.status(500).send('Error deleting employee');
    });
});

// Route xử lý form đăng nhập
app.post('/api/auth/login', (req, res) => {
  const { id, password } = req.body;

  axios.post(`${AUTHENTICATION_API_URL}/authentication/login`, { id, password })
    .then(response => {
      if (response.status === 200) {
        const { token, role } = response.data;
        res.cookie('authToken', token, { httpOnly: true, maxAge: 3600000 });
        res.cookie('userRole', role, { maxAge: 3600000, path: '/' });
        const successMessage = 'Login successful!';
        res.redirect('/add_employ.html?message=' + encodeURIComponent(successMessage));
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    })
    .catch(error => {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Failed to log in' });
    });
});

// Chạy server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Frontend service running on port ${PORT}`);
});

