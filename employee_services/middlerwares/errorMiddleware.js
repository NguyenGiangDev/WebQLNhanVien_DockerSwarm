// /middlewares/errorMiddleware.js

const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack); // In lỗi ra console
  
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? err.stack : {} // Hiển thị stack trace trong môi trường development
    });
  };
  
  module.exports = errorMiddleware;
  