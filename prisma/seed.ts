import { PrismaClient } from '@prisma/client';
import { addMonths, subMonths } from 'date-fns';

const prisma = new PrismaClient();

async function seed() {
  // Clean the database
  await prisma.adminDocument.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.intervention.deleteMany();

  // Create admin documents
  const documents = [
    {
      type: 'KBIS',
      name: 'Extrait KBIS',
      expiryDate: addMonths(new Date(), 12),
      file: 'kbis_2024.pdf',
      status: 'Valide'
    },
    {
      type: 'ASSURANCE',
      name: 'Assurance professionnelle',
      expiryDate: addMonths(new Date(), 9),
      file: 'assurance_2024.pdf',
      status: 'Valide'
    },
    {
      type: 'CONTRAT',
      name: 'Contrat maintenance',
      expiryDate: addMonths(new Date(), 3),
      file: 'contrat_2024.pdf',
      status: 'Valide'
    }
  ];

  for (const doc of documents) {
    await prisma.adminDocument.create({ data: doc });
  }

  // Create interventions for the last 6 months
  const interventionTypes = [
    'Installation serveur',
    'Maintenance réseau',
    'Dépannage informatique',
    'Installation poste de travail',
    'Migration données'
  ];

  const cities = [
    { name: 'Caen', lat: 49.1829, lng: -0.3707 },
    { name: 'Bayeux', lat: 49.2764, lng: -0.7023 },
    { name: 'Lisieux', lat: 49.1446, lng: 0.2267 }
  ];

  for (let i = 0; i < 50; i++) {
    const date = subMonths(new Date(), Math.floor(Math.random() * 6));
    const city = cities[Math.floor(Math.random() * cities.length)];
    const type = interventionTypes[Math.floor(Math.random() * interventionTypes.length)];
    const isSubcontracted = Math.random() > 0.7;
    const sellPrice = Math.floor(Math.random() * 1000) + 500;

    await prisma.intervention.create({
      data: {
        title: type,
        description: `Description de l'intervention ${type}`,
        date,
        status: Math.random() > 0.3 ? 'completed' : 'in_progress',
        address: `${Math.floor(Math.random() * 100)} rue de la Paix`,
        city: city.name,
        postalCode: '14000',
        latitude: city.lat + (Math.random() - 0.5) * 0.1,
        longitude: city.lng + (Math.random() - 0.5) * 0.1,
        client: `Client ${i + 1}`,
        phone: '0231000000',
        isSubcontracted,
        buyPrice: isSubcontracted ? sellPrice * 0.7 : null,
        sellPrice,
        invoiceStatus: isSubcontracted ? (Math.random() > 0.5 ? 'paid' : 'pending') : null
      }
    });
  }

  // Create monthly invoices
  for (let i = 0; i < 6; i++) {
    const date = subMonths(new Date(), i);
    const period = format(date, 'yyyy-MM');
    
    await prisma.invoice.create({
      data: {
        period,
        invoiceNumber: `FACT-${period}`,
        amount: Math.floor(Math.random() * 5000) + 5000,
        status: i === 0 ? 'En attente' : i === 1 ? 'Envoyé' : 'Payé',
        dueDate: addMonths(date, 1)
      }
    });
  }

  console.log('Database seeded successfully!');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });