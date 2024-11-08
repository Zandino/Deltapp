interface WelcomeEmailParams {
  to: string;
  name: string;
  company: string;
  password: string;
}

export async function sendWelcomeEmail({ to, name, company, password }: WelcomeEmailParams): Promise<void> {
  const emailData = {
    to,
    subject: 'Bienvenue sur DeltAPP - Vos identifiants de connexion',
    html: `
      <h1>Bienvenue sur DeltAPP</h1>
      <p>Bonjour ${name},</p>
      <p>Votre compte pour ${company} a été créé avec succès. Voici vos identifiants de connexion :</p>
      <div style="background-color: #f3f4f6; padding: 16px; margin: 16px 0; border-radius: 8px;">
        <p><strong>Email :</strong> ${to}</p>
        <p><strong>Mot de passe :</strong> ${password}</p>
      </div>
      <p>Pour des raisons de sécurité, nous vous recommandons de changer votre mot de passe lors de votre première connexion.</p>
      <p>Vous pouvez accéder à votre compte en cliquant sur le lien suivant :</p>
      <p><a href="https://app.deltapp.fr" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Accéder à DeltAPP</a></p>
      <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
      <p>Cordialement,<br>L'équipe DeltAPP</p>
    `
  };

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
}