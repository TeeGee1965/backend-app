import bcrypt from 'bcryptjs';
import { User } from '../models/user.model.js';
import { generateToken } from '../utils/generatetoken.js';

const SALT_ROUNDS = 10;

// req.body is already validated and normalised (email trimmed + lower-cased)
// by validateRequest(registerSchema) – see routes/auth.route.js
const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.exists({ email });

    if (userExists) {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({ name, email, password: hashedPassword });

    // generate JWT Token
    const token = generateToken(user._id, res);

    // Don't send the password (hash) back to the client
    res.status(201).json({
      status: 'success',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    // Two requests with the same email at the same moment: the unique index catches it
    if (error.code === 11000) {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    console.error('Register failed:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// req.body is already validated by validateRequest(loginSchema)
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // findOne (not exists): we need the stored password hash to compare with
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    // Same message as above, so nobody can find out which emails are registered
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // generate JWT Token
    const token = generateToken(user._id, res);

    res.status(200).json({
      status: 'success',
      data: {
        id: user._id,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

const logout = async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({
    status: 'success',
    message: 'logged out successfully',
  });
};

// Returns the currently logged-in user (req.user is set by authMiddleware)
const me = async (req, res) => {
  const { _id, name, email, createdAt } = req.user;

  res.status(200).json({
    status: 'success',
    data: {
      id: _id,
      name,
      email,
      createdAt,
    },
  });
};

export { register, login, logout, me };
