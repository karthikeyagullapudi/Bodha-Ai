import userModel from '../model/auth.model.js';
import { sendMail } from '../services/mail.service.js';
import {
  welcomeEmailTemplate,
  emailVerifiedTemplate,
} from '../utils/emailTemplate.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// The login token and its cookie expire together
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

const authCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
};

// Resolves to true when the email was sent
const sendVerificationEmail = async (req, user) => {
  const emailVerificationToken = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  );

  // APP_URL wins when set; otherwise link back to the site the request came from
  const appUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  const verificationUrl = `${appUrl}/api/auth/verify-email?token=${emailVerificationToken}`;

  return sendMail(
    user.email,
    `Welcome to Bodha AI, ${user.username}`,
    welcomeEmailTemplate(user.username, verificationUrl),
    `Welcome to Bodha AI! Verify your email to get started: ${verificationUrl}`,
  );
};

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
      // Don't echo the existing account's details back
      return res.status(400).json({
        message: 'An account with this username or email already exists',
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

    await sendVerificationEmail(req, createdUser);

    res.status(201).json({
      message: 'User registered successfully',
      success: true,
      data: createdUser,
    });
  } catch (error) {
    console.error('Error in registerUser controller:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    // Same answer for unknown email and wrong password, so the form can't be
    // used to find out who has an account
    const isPasswordValid =
      user && (await bcrypt.compare(password, user.password));

    if (!isPasswordValid) {
      return res.status(400).json({
        message: 'Invalid email or password',
        success: false,
        error: 'Invalid credentials',
      });
    }

    if (!user.verified) {
      return res.status(400).json({
        message: 'Please verify your email before logging in',
        success: false,
        error: 'Email not verified',
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: SESSION_MAX_AGE_MS / 1000 },
    );

    res.cookie('token', token, {
      ...authCookieOptions,
      maxAge: SESSION_MAX_AGE_MS,
    });

    res.status(200).json({
      message: 'User logged in successfully',
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error in loginUser controller:', error);
    res.status(500).json({
      message: 'Login failed. Please try again.',
      success: false,
      error: 'Internal Server Error',
    });
  }
};

const resendVerification = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    if (user && !user.verified && !(await sendVerificationEmail(req, user))) {
      return res.status(503).json({
        message: "We couldn't send the email right now. Please try again later.",
        success: false,
      });
    }

    // Same reply either way, so this can't be used to look up accounts
    res.status(200).json({
      message:
        'If this account still needs verifying, a new link is on its way. It expires in 1 hour.',
      success: true,
    });
  } catch (error) {
    console.error('Error in resendVerification controller:', error);
    res.status(500).json({
      message: 'Could not send the email. Please try again.',
      success: false,
    });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie('token', authCookieOptions);
  res.status(200).json({
    message: 'User logged out successfully',
    success: true,
  });
};

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

export {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  resendVerification,
  getMe,
};
