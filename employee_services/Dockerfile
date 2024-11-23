# Sử dụng Node.js cho production
FROM node:18

# Đặt thư mục làm việc
WORKDIR /usr/src/app

# Sao chép file package.json và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Tải xuống script wait-for-it
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /usr/src/app/wait-for-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh

# Mở cổng ứng dụng (thay số 3000 bằng cổng ứng dụng nếu khác)
EXPOSE 3001

# Khởi động ứng dụng và chờ MongoDB
CMD ["./wait-for-it.sh", "db:27017", "--", "npm", "start"]

