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
        technician: true
      }
    });
    
    const formattedInterventions = interventions.map(intervention => ({
      ...intervention,
      client: intervention.client.company,
      technicianName: intervention.technician?.name,
      trackingNumbers: JSON.parse(intervention.trackingNumbers || '[]'),
      attachments: JSON.parse(intervention.attachments || '[]')
    }));

    res.json(formattedInterventions);
  } catch (error) {
    console.error('Error fetching interventions:', error);
    res.status(500).json({ error: 'Failed to fetch interventions' });
  }
});

// Create intervention
router.post('/', auth, async (req, res) => {
  try {
    const intervention = await prisma.intervention.create({
      data: {
        ...req.body,
        status: 'pending',
        isSubcontracted: false,
        trackingNumbers: JSON.stringify(req.body.trackingNumbers || []),
        attachments: JSON.stringify(req.body.attachments || [])
      },
      include: {
        client: true,
        technician: true
      }
    });

    const formattedIntervention = {
      ...intervention,
      client: intervention.client.company,
      technicianName: intervention.technician?.name,
      trackingNumbers: JSON.parse(intervention.trackingNumbers || '[]'),
      attachments: JSON.parse(intervention.attachments || '[]')
    };

    res.status(201).json(formattedIntervention);
  } catch (error) {
    console.error('Error creating intervention:', error);
    res.status(500).json({ error: 'Failed to create intervention' });
  }
});

// Update intervention
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const intervention = await prisma.intervention.update({
      where: { id },
      data: {
        ...req.body,
        trackingNumbers: req.body.trackingNumbers ? JSON.stringify(req.body.trackingNumbers) : undefined,
        attachments: req.body.attachments ? JSON.stringify(req.body.attachments) : undefined
      },
      include: {
        client: true,
        technician: true
      }
    });

    const formattedIntervention = {
      ...intervention,
      client: intervention.client.company,
      technicianName: intervention.technician?.name,
      trackingNumbers: JSON.parse(intervention.trackingNumbers || '[]'),
      attachments: JSON.parse(intervention.attachments || '[]')
    };

    res.json(formattedIntervention);
  } catch (error) {
    console.error('Error updating intervention:', error);
    res.status(500).json({ error: 'Failed to update intervention' });
  }
});

// Delete intervention
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.intervention.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting intervention:', error);
    res.status(500).json({ error: 'Failed to delete intervention' });
  }
});

// Duplicate intervention
router.post('/:id/duplicate', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const existingIntervention = await prisma.intervention.findUnique({
      where: { id },
      include: {
        client: true,
        technician: true
      }
    });

    if (!existingIntervention) {
      return res.status(404).json({ error: 'Intervention not found' });
    }

    const { id: oldId, createdAt, updatedAt, ...interventionData } = existingIntervention;

    const newIntervention = await prisma.intervention.create({
      data: {
        ...interventionData,
        title: `${interventionData.title} (Copie)`,
        date: new Date().toISOString(),
        status: 'pending',
        technicianId: null
      },
      include: {
        client: true,
        technician: true
      }
    });

    const formattedIntervention = {
      ...newIntervention,
      client: newIntervention.client.company,
      technicianName: undefined,
      trackingNumbers: JSON.parse(newIntervention.trackingNumbers || '[]'),
      attachments: JSON.parse(newIntervention.attachments || '[]')
    };

    res.status(201).json(formattedIntervention);
  } catch (error) {
    console.error('Error duplicating intervention:', error);
    res.status(500).json({ error: 'Failed to duplicate intervention' });
  }
});

// Assign technician
router.put('/:id/assign', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { technicianId } = req.body;

    const intervention = await prisma.intervention.update({
      where: { id },
      data: {
        technicianId,
        status: 'in_progress'
      },
      include: {
        client: true,
        technician: true
      }
    });

    const formattedIntervention = {
      ...intervention,
      client: intervention.client.company,
      technicianName: intervention.technician?.name,
      trackingNumbers: JSON.parse(intervention.trackingNumbers || '[]'),
      attachments: JSON.parse(intervention.attachments || '[]')
    };

    res.json(formattedIntervention);
  } catch (error) {
    console.error('Error assigning technician:', error);
    res.status(500).json({ error: 'Failed to assign technician' });
  }
});

// Update invoice status
router.put('/:id/invoice-status', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, invoiceNumber } = req.body;

    const intervention = await prisma.intervention.update({
      where: { id },
      data: {
        invoiceStatus: status,
        invoiceNumber
      },
      include: {
        client: true,
        technician: true
      }
    });

    const formattedIntervention = {
      ...intervention,
      client: intervention.client.company,
      technicianName: intervention.technician?.name,
      trackingNumbers: JSON.parse(intervention.trackingNumbers || '[]'),
      attachments: JSON.parse(intervention.attachments || '[]')
    };

    res.json(formattedIntervention);
  } catch (error) {
    console.error('Error updating invoice status:', error);
    res.status(500).json({ error: 'Failed to update invoice status' });
  }
});

export default router;