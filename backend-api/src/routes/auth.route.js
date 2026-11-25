import express from 'express';
import { register, login, logout, me } from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import validateRequest from '../middleware/validateRequest.js';
import { loginSchema, registerSchema } from '../validators/auth.validators.js';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), register);

router.post('/login', validateRequest(loginSchema), login);

router.post('/logout', logout);

router.get('/me', authMiddleware, me);

export default router;
