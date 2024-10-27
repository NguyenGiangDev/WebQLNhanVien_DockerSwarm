document.addEventListener('DOMContentLoaded', function() {
    fetchDepartments(); // Gọi hàm để lấy danh sách phòng ban
  });
  
  function fetchDepartments() {
    // Gửi yêu cầu đến dịch vụ department_services trên cổng 3002
    fetch('http://localhost:3002/department') // URL cho API lấy danh sách phòng ban
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const buttonsContainer = document.getElementById('department-buttons');
            buttonsContainer.innerHTML = ''; // Xóa nội dung cũ
  
            data.forEach(department => {
                const button = document.createElement('button');
                button.className = 'department-button';
                button.textContent = department.loaiPhong; // Hiển thị loại phòng ban
                button.onclick = function() {
                    // Thực hiện hành động khi nút được nhấn
                    alert(`Trưởng phòng: ${department.truongPhong}`); // Ví dụ: hiển thị tên trưởng phòng
                };
                buttonsContainer.appendChild(button); // Thêm nút vào container
            });
        })
        .catch(error => console.error('Error fetching departments:', error));
  }
  
  