import jwt from 'jsonwebtoken'
import {User} from '../models/user.model.js' // adjust path if needed
import asyncHandler from '../utils/asynchandler.js'

const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Now fetch the full user from DB (without password)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user; // now req.user has full user info
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
});

export default verifyToken;
