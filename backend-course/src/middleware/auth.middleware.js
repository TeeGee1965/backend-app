import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

const authMiddleware = async (req, res, next) => {
  let token;

  // 'Bearer ' with a space: "Bearerxyz" is not a Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: `Not authorized, token failed ${error}` });
  }
};

export default authMiddleware;
