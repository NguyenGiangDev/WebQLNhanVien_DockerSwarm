# Sử dụng Node.js cho production
FROM node:18

# Đặt thư mục làm việc
WORKDIR /usr/src/app

# Sao chép file package.json và cài đặt dependencies
COPY package*.json ./
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Mở cổng ứng dụng (thay số 3000 bằng cổng ứng dụng nếu khác)
EXPOSE 3000

# Khởi động ứng dụng
CMD ["npm", "start"]

