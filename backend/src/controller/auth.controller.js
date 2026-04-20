import userModel from '../model/auth.model.js';
import { sendMail } from '../services/mail.service.js';
import {
  welcomeEmailTemplate,
  emailVerifiedTemplate,
} from '../utils/emailTemplate.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const verifyEmail = async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).json({
      message: 'Token is required',
      success: false,
      error: 'Token is required',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid token or user not found',
        success: false,
        error: 'Invalid token',
      });
    }

    if (user.verified) {
      return res.status(400).json({
        message: 'Email is already verified',
        success: false,
        error: 'Email already verified',
      });
    }

    user.verified = true;
    await user.save();

    // In a real app, you might want to redirect to frontend here with res.redirect(process.env.CLIENT_URL)

    const htmlResponse = emailVerifiedTemplate();

    res.status(200).send(htmlResponse);
  } catch (error) {
    return res.status(400).json({
      message: 'Invalid or expired token',
      success: false,
      error: error.message,
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExist = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (userExist) {
      return res.status(400).json({
        message: `${userExist.username} or ${userExist.email} already exists`,
        success: false,
        error: 'User already exists',
      });
    }

    const user = await userModel.create({
      username,
      email,
      password,
    });

    const createdUser = await userModel.findById(user._id).select('-password');

    const emailVerificationToken = jwt.sign(
      {
        email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    await sendMail(
      email,
      `Welcome to Bodha AI, ${username}`,
      welcomeEmailTemplate(username, emailVerificationToken),
      `Welcome to Bodha AI! We're absolutely thrilled to have you join our community. Your account has been successfully created!`,
    );

    res.status(201).json({
      message: 'User registered successfully',
      success: true,
      data: createdUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'Try after registering',
        success: false,
        error: 'Invalid credentials',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: 'password is incorrect',
        success: false,
        error: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'User logged in successfully',
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Internal Server Error',
      success: false,
      error: error.message,
    });
  }
};

const logoutUser = (req, res) => {};

const getMe = (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      message: 'User fetched successfully',
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error',
    });
  }
};

export { registerUser, loginUser, logoutUser, verifyEmail, getMe };
