import express from 'express';
import nodemailer from 'nodemailer';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Create transporter with environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Test email configuration
router.post('/test', auth, async (req, res) => {
  try {
    const { settings } = req.body;
    
    // Create test transporter with provided settings
    const testTransporter = nodemailer.createTransport({
      host: settings.smtpHost,
      port: settings.smtpPort,
      secure: settings.smtpPort === 465,
      auth: {
        user: settings.smtpUser,
        pass: settings.smtpPass,
      },
    });

    // Verify connection configuration
    await testTransporter.verify();
    
    // Send test email
    await testTransporter.sendMail({
      from: settings.smtpFrom,
      to: req.body.to,
      subject: 'Test de configuration email DeltAPP',
      html: `
        <h1>Test de configuration email</h1>
        <p>Si vous recevez cet email, la configuration de votre messagerie est correcte.</p>
      `
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error testing email configuration:', error);
    res.status(500).json({ error: 'Failed to test email configuration' });
  }
});

// Send welcome email to new client
router.post('/welcome', auth, async (req, res) => {
  try {
    const { to, name, company, password } = req.body;
    
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: 'Bienvenue sur DeltAPP - Vos identifiants de connexion',
      html: `
        <h1>Bienvenue sur DeltAPP</h1>
        <p>Bonjour ${name},</p>
        <p>Votre compte client pour ${company} a été créé avec succès.</p>
        <p>Voici vos identifiants de connexion pour le portail client :</p>
        <div style="background-color: #f3f4f6; padding: 16px; margin: 16px 0; border-radius: 8px;">
          <p><strong>Email :</strong> ${to}</p>
          <p><strong>Mot de passe :</strong> ${password}</p>
        </div>
        <p>Pour des raisons de sécurité, nous vous recommandons de changer votre mot de passe lors de votre première connexion.</p>
        <p>Vous pouvez accéder au portail client à l'adresse suivante :</p>
        <p><a href="${process.env.CLIENT_PORTAL_URL}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Accéder au portail client</a></p>
        <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
        <p>Cordialement,<br>L'équipe DeltAPP</p>
      `
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    res.status(500).json({ error: 'Failed to send welcome email' });
  }
});

export default router;