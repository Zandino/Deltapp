import express from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { auth } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all technicians
router.get('/technicians', auth, async (req, res) => {
  try {
    const technicians = await prisma.user.findMany({
      where: { role: 'TECH' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true
      }
    });
    res.json(technicians);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Create user
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        phone
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true
      }
    });
    
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;