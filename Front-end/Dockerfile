# Sử dụng hình ảnh Node.js chính thức, phiên bản 18
FROM node:18 as build

# Đặt thư mục làm việc
WORKDIR /usr/src/app

# Sao chép file package.json và package-lock.json và cài đặt phụ thuộc
COPY package*.json ./
RUN npm install

# Sao chép toàn bộ mã nguồn và build ứng dụng
COPY . .
RUN npm run build

# Sử dụng một Nginx image để phục vụ ứng dụng
FROM nginx:alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# Expose cổng Nginx
EXPOSE 3000

# Khởi động Nginx
CMD ["npm", "start"]

