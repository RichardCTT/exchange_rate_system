const User = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/bcryptUtils');
const { registerSchema, updateSchema } = require('../validations/userValidation');

// 注册
exports.register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { username, email, password } = req.body;
    const passwordHash = await hashPassword(password);
    const userId = await User.create(username, email, passwordHash);

    res.status(201).json({ message: 'User created', user_id: userId });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// 登录
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) return res.status(400).json({ error: 'Invalid email or password' });

    req.session.user = user; // 保存用户信息到 session
    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// 查看资料
exports.getProfile = (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not authenticated' });
  res.json(req.session.user);
};

// 更新资料
exports.updateProfile = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const { error } = updateSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { username, email } = req.body;
    const userId = req.session.user.user_id;

    await User.update(userId, username, email);
    req.session.user = await User.findById(userId); // 更新 session

    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};