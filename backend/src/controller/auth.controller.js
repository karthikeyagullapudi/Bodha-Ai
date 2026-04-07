import userModel from '../model/auth.model.js';
import { sendMail } from '../services/mail.service.js';
import { welcomeEmailTemplate } from '../utils/emailTemplate.js';

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

    await sendMail(
      email,
      `Welcome to Bodha AI, ${username}`,
      welcomeEmailTemplate(username),
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

const loginUser = (req, res) => {};

const logoutUser = (req, res) => {};

export { registerUser, loginUser, logoutUser };
