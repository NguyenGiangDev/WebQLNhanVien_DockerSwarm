# Mô tả về hệ thống.
Tổng quan về hệ thống: Hệ thống này được xây dựng nhằm mục đích triển khai
ứng dụng microservices lên các node bằng cách phân phối các service đã được đóng
gói thành các container đến các node (được mô phỏng bằng các container chạy image
Docker:latest) để chạy trên các node đó nhằm mô phỏng một hệ thống thực tế mà
nhiều doanh nghiệp hiện nay đang sử dụng đó là triển khai một dự án microservice
lên nhiều máy chủ khác nhau nhằm mục đích nâng cao hiểu quả phục vụ người dùng
như tính sẵn sàng, khả năng phân tán, hiệu suất tối ưu. Để nâng cao khả năng mô
phỏng thực tế hệ thống còn được tích hợp thêm CI/CD để tự động hóa việc build,
push các image và Grafana, Prometheus để có thể theo dõi hiệu suất hệ thống cũng
như tình trạng truy cập của ứng dụng.

# Kiến trúc hệ thống.
![image](https://github.com/user-attachments/assets/b7d03f95-25d7-4777-b75d-85088f743b87)

