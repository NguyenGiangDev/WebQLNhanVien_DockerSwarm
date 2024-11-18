const express = require('express');
const router = express.Router();
const Employee = require('../model/model_employee');
const axios = require('axios');

// GET tất cả nhân viên
router.get('/', async (req, res, next) => {
  try {
    const employees = await Employee.find();
    res.json(employees); // Trả về danh sách nhân viên
  } catch (error) {
    next(error); // Gọi middleware xử lý lỗi
  }
});

// POST thêm nhân viên mới
router.post('/', async (req, res, next) => {
  const { name, position, salary } = req.body;

  if (!name || !position || salary === undefined) {
    return res.status(400).json({ message: 'Name, position, and salary are required.' });
  }

  try {
    // Thay localhost bằng tên service `department-service` từ Docker Compose
    const departmentServiceURL = 'http://department_services:3002';

    // Gửi yêu cầu xác minh phòng ban
    const response = await axios.get(`${departmentServiceURL}/department/check?position=${position}`, { timeout: 5000 });

    if (response.data.exists) {
      const newEmployee = new Employee({ name, position, salary });
      await newEmployee.save();
      return res.status(200).json({ message: 'Employee added successfully.' });
    } else {
      return res.status(404).json({ message: 'Department does not exist.' });
    }

  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      // Lỗi timeout
      return res.status(500).json({ message: 'Request to department service timed out.' });
    } else if (error.response && error.response.status === 404) {
      return res.status(404).json({ message: 'Department service not found.' });
    } else {
      return res.status(500).json({ message: 'Error contacting department service.' });
    }
  }
});

// Xóa nhân viên theo name
router.post('/delete', async (req, res) => {
  const employeeName = req.body.name;

  Employee.findOneAndDelete({ name: employeeName }, (err, employee) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting employee' });
    }
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully' });
  });
});

// Lấy danh sách nhân viên theo phòng ban
router.get('/position', async (req, res) => {
  const { department } = req.query;

  if (!department) {
    return res.status(400).json({ message: 'Phòng ban (department) là bắt buộc.' });
  }

  try {
    const employees = await Employee.find({ position: department });

    if (employees.length === 0) { 
      return res.status(404).json({ message: 'Không có nhân viên nào thuộc phòng ban này.' });
    }

    res.status(200).json(employees);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nhân viên:', error.message);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách nhân viên.' });
  }
});

// Kiểm tra tình trạng của dịch vụ nhân viên
router.get('/message', (req, res) => {
  res.status(200).json({ message: 'Dịch vụ nhân viên đang hoạt động!' });
});

module.exports = router; // Xuất router để sử dụng trong app.js
