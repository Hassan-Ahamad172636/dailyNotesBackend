import asyncHandler from "../utils/asyncHandler.js";
import generateApiResponse from "../utils/generateApiResponse.js";
import generateToken from "../utils/generateToken.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt"
import crypto from "crypto"

const userController = {
  signup: asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, remember } = req.body;

    if(!firstName || !lastName || !email || !password) {
        return generateApiResponse(res, {
            statusCode: 400,
            success: false,
            message:'All fields are required!'
        })
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return generateApiResponse(res, {
        statusCode: 400,
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      remember
    });

    const token = generateToken(user._id);

    generateApiResponse(res, {
      statusCode: 201,
      message: "User registered successfully!",
      data: { user, token },
    });
  }),

  // 👉 Login
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if(!email, !password) {
      return generateApiResponse(res, {
        statusCode:400,
        success: false,
        message:'Email and Password is required!!',
      })
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return generateApiResponse(res, {
        statusCode: 401,
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    generateApiResponse(res, {
      message: "Login successful",
      data: { user, token },
    });
  }),

  // 👉 Forgot Password - Generate OTP
  forgotPassword: asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return generateApiResponse(res, {
        statusCode: 404,
        success: false,
        message: "User not found",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    user.resetOTP = otp;
    user.resetOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // TODO: Send OTP via email or SMS

    generateApiResponse(res, {
      message: "OTP sent to your email",
    });
  }),

  // 👉 Verify OTP
  verifyOtp: asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (
      !user ||
      user.resetOTP !== otp ||
      user.resetOTPExpires < Date.now()
    ) {
      return generateApiResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    user.resetOTP = null;
    user.resetOTPExpires = null;
    user.isOtpVerified = true;
    await user.save();

    generateApiResponse(res, {
      message: "OTP verified successfully",
    });
  }),

  // 👉 Update Password (after OTP verification)
  updatePassword: asyncHandler(async (req, res) => {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.isOtpVerified) {
      return generateApiResponse(res, {
        statusCode: 400,
        success: false,
        message: "OTP not verified",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.isOtpVerified = false;
    await user.save();

    generateApiResponse(res, {
      message: "Password updated successfully",
    });
  }),

  // 👉 Change Password (for logged-in users)
  changePassword: asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return generateApiResponse(res, {
        statusCode: 401,
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    generateApiResponse(res, {
      message: "Password changed successfully",
    });
  }),
};

export default userController;
 
