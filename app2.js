const express = require('express');
const session = require('express-session');
const app = express();
const PORT = 3000;

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 会话配置（用于登录状态）
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // 开发环境设为 false，生产可设为 true
}));

// 路由
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});