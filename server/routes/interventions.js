import express from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all interventions
router.get('/', auth, async (req, res) => {
  try {
    const interventions = await prisma.intervention.findMany({
      include: {
        client: true,
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });
    res.json(interventions);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Create intervention
router.post('/', auth, async (req, res) => {
  try {
    const { type, clientId, date, price, description, assignedToId } = req.body;
    
    const intervention = await prisma.intervention.create({
      data: {
        type,
        date: new Date(date),
        price,
        description,
        client: { connect: { id: clientId } },
        createdBy: { connect: { id: req.user.id } },
        ...(assignedToId && {
          assignedTo: { connect: { id: assignedToId } }
        })
      },
      include: {
        client: true,
        assignedTo: true
      }
    });
    
    res.status(201).json(intervention);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Update intervention status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const intervention = await prisma.intervention.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
      include: {
        client: true,
        assignedTo: true
      }
    });
    
    res.json(intervention);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;