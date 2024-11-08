import express from 'express';
import { PrismaClient } from '@prisma/client';
import { auth } from '../middleware/auth.js';
import nodemailer from 'nodemailer';
import { generatePassword } from '../utils/passwords.js';

const router = express.Router();
const prisma = new PrismaClient();

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Get all clients
router.get('/', auth, async (req, res) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// Create client
router.post('/', auth, async (req, res) => {
  try {
    const { name, company, email, phone, address, city, postalCode } = req.body;
    
    // Generate password for client portal
    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create client with portal access
    const client = await prisma.client.create({
      data: {
        name,
        company,
        email,
        phone,
        address,
        city,
        postalCode,
        portalAccess: {
          create: {
            email,
            password: hashedPassword,
            isActive: true
          }
        }
      }
    });
    
    res.status(201).json(client);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// Send welcome email with credentials
router.post('/welcome-email', auth, async (req, res) => {
  try {
    const { email, name, company, password } = req.body;
    
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Bienvenue sur le portail client DeltAPP',
      html: `
        <h1>Bienvenue sur DeltAPP</h1>
        <p>Cher(e) ${name},</p>
        <p>Votre compte client pour ${company} a été créé avec succès.</p>
        <p>Voici vos identifiants de connexion pour le portail client :</p>
        <ul>
          <li>Email : ${email}</li>
          <li>Mot de passe : ${password}</li>
        </ul>
        <p>Nous vous recommandons de changer votre mot de passe lors de votre première connexion.</p>
        <p>Vous pouvez accéder au portail client à l'adresse suivante : <a href="${process.env.CLIENT_PORTAL_URL}">Portail Client DeltAPP</a></p>
        <p>Cordialement,<br>L'équipe DeltAPP</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Welcome email sent successfully' });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    res.status(500).json({ error: 'Failed to send welcome email' });
  }
});

// Update client
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const client = await prisma.client.update({
      where: { id },
      data: updates
    });
    
    res.json(client);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// Delete client
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.client.delete({
      where: { id }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

export default router;