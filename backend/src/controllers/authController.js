const bcrypt = require('bcryptjs');
const Joi = require('joi');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const { signAccessToken } = require('../utils/jwt');
const env = require('../config/env');

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

async function register(req, res) {
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const existing = await User.findOne({
    $or: [{ email: value.email }, { username: value.username }]
  });

  if (existing) {
    throw new ApiError(409, 'User already exists with this email or username');
  }

  const passwordHash = await bcrypt.hash(value.password, 12);
  const user = await User.create({
    username: value.username,
    email: value.email,
    passwordHash
  });

  const token = signAccessToken(
    { sub: user.id, email: user.email, username: user.username },
    env.jwtSecret,
    env.jwtExpiresIn
  );

  return res.status(201).json({
    success: true,
    message: 'User registered',
    data: {
      token,
      user: { id: user.id, username: user.username, email: user.email }
    }
  });
}

async function login(req, res) {
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const user = await User.findOne({ email: value.email });
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await user.comparePassword(value.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = signAccessToken(
    { sub: user.id, email: user.email, username: user.username },
    env.jwtSecret,
    env.jwtExpiresIn
  );

  return res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      token,
      user: { id: user.id, username: user.username, email: user.email }
    }
  });
}

module.exports = { register, login };
