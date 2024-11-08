import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    path: string;
  }>;
}

export async function sendEmail({ to, subject, html, attachments }: EmailOptions): Promise<void> {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
      attachments,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

export async function sendWelcomeEmail(to: string, name: string, password: string): Promise<void> {
  const html = `
    <h1>Bienvenue sur DeltAPP</h1>
    <p>Bonjour ${name},</p>
    <p>Votre compte a été créé avec succès. Voici vos identifiants de connexion :</p>
    <ul>
      <li>Email : ${to}</li>
      <li>Mot de passe : ${password}</li>
    </ul>
    <p>Pour des raisons de sécurité, nous vous recommandons de changer votre mot de passe lors de votre première connexion.</p>
    <p>Vous pouvez accéder à votre compte en cliquant sur le lien suivant :</p>
    <p><a href="${process.env.CLIENT_PORTAL_URL}">Accéder au portail client</a></p>
    <p>Cordialement,<br>L'équipe DeltAPP</p>
  `;

  await sendEmail({
    to,
    subject: 'Bienvenue sur DeltAPP - Vos identifiants de connexion',
    html,
  });
}

export async function sendInterventionNotification(
  to: string,
  intervention: any,
  type: 'new' | 'update' | 'completed'
): Promise<void> {
  let subject = '';
  let content = '';

  switch (type) {
    case 'new':
      subject = 'Nouvelle intervention créée';
      content = `Une nouvelle intervention a été créée pour le ${intervention.date}`;
      break;
    case 'update':
      subject = 'Mise à jour de l\'intervention';
      content = `L'intervention du ${intervention.date} a été mise à jour`;
      break;
    case 'completed':
      subject = 'Intervention terminée';
      content = `L'intervention du ${intervention.date} a été marquée comme terminée`;
      break;
  }

  const html = `
    <h2>${subject}</h2>
    <p>${content}</p>
    <h3>Détails de l'intervention :</h3>
    <ul>
      <li>Type : ${intervention.title}</li>
      <li>Date : ${intervention.date}</li>
      <li>Adresse : ${intervention.location.address}</li>
      <li>Description : ${intervention.description}</li>
    </ul>
    <p>Cordialement,<br>L'équipe DeltAPP</p>
  `;

  await sendEmail({
    to,
    subject,
    html,
  });
}

export async function sendDailyReport(to: string, interventions: any[]): Promise<void> {
  const html = `
    <h2>Rapport journalier des interventions</h2>
    <p>Voici le récapitulatif des interventions du jour :</p>
    <table style="width:100%; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #f3f4f6;">
          <th style="padding: 8px; border: 1px solid #e5e7eb;">Heure</th>
          <th style="padding: 8px; border: 1px solid #e5e7eb;">Type</th>
          <th style="padding: 8px; border: 1px solid #e5e7eb;">Client</th>
          <th style="padding: 8px; border: 1px solid #e5e7eb;">Statut</th>
        </tr>
      </thead>
      <tbody>
        ${interventions.map(intervention => `
          <tr>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${intervention.time}</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${intervention.title}</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${intervention.client}</td>
            <td style="padding: 8px; border: 1px solid #e5e7eb;">${intervention.status}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <p>Cordialement,<br>L'équipe DeltAPP</p>
  `;

  await sendEmail({
    to,
    subject: 'Rapport journalier des interventions',
    html,
  });
}