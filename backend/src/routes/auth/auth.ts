import { Router } from 'express';
import {
  loginUser,
  registerUser,
} from '../../services/auth-services/AuthServices';

const router = Router();

router.post('/register', async (_req, res) => {
  const { name, email, password } = _req.body;
  const user = await registerUser(name, email, password);
  if (!user) {
    return res.status(400).json({ message: 'User already exists' });
  } else {
    const { email, id, name, googleId } = user;
    return res.status(200).json({ email, id, name, googleId });
  }
});

router.post('/login', async (_req, res) => {
  const { email, password } = _req.body;
  const token = await loginUser(email, password);
  if (!token) {
    return res.status(400).json({ message: 'Invalid credentials' });
  } else {
    return res.status(200).json({ token });
  }
});

export default router;
