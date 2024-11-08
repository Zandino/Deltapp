import React from 'react';
import { HelpCircle, Book, MessageCircle, Phone, Mail, FileText, ExternalLink } from 'lucide-react';

const faqs = [
  {
    question: "Comment créer une nouvelle intervention ?",
    answer: "Pour créer une nouvelle intervention, cliquez sur le bouton 'Nouvelle intervention' dans la page Interventions. Remplissez ensuite le formulaire avec les détails nécessaires."
  },
  {
    question: "Comment assigner un technicien à une intervention ?",
    answer: "Dans la liste des interventions, cliquez sur l'icône d'assignation (personne avec un plus) à côté de l'intervention concernée. Sélectionnez ensuite le technicien dans la liste déroulante."
  },
  {
    question: "Comment gérer les pièces jointes ?",
    answer: "Vous pouvez ajouter des pièces jointes lors de la création ou de la modification d'une intervention. Les fichiers acceptés sont : PDF, DOC, DOCX, XLS, XLSX et images."
  },
  {
    question: "Comment suivre le statut d'une intervention ?",
    answer: "Le statut de chaque intervention est visible dans la liste des interventions. Les statuts possibles sont : En attente, En cours, et Terminé."
  }
];

const guides = [
  {
    title: "Guide de démarrage rapide",
    description: "Apprenez les bases de l'utilisation de DeltAPP",
    icon: Book,
  },
  {
    title: "Documentation complète",
    description: "Consultez la documentation détaillée de toutes les fonctionnalités",
    icon: FileText,
  },
  {
    title: "Tutoriels vidéo",
    description: "Regardez nos tutoriels pour maîtriser l'application",
    icon: ExternalLink,
  }
];

export default function Aide() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Centre d'aide</h1>

      {/* Section Contact */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <MessageCircle className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Besoin d'aide ?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-4">
            <Phone className="h-5 w-5 text-blue-600 mt-1" />
            <div>
              <h3 className="font-medium">Support téléphonique</h3>
              <p className="text-gray-600">Du lundi au vendredi, 9h-18h</p>
              <p className="text-blue-600 font-medium">02 31 00 00 00</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Mail className="h-5 w-5 text-blue-600 mt-1" />
            <div>
              <h3 className="font-medium">Support par email</h3>
              <p className="text-gray-600">Réponse sous 24h ouvrées</p>
              <p className="text-blue-600 font-medium">support@deltapp.fr</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section FAQ */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <HelpCircle className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Questions fréquentes</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Section Guides */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Book className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Guides et ressources</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((guide, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
            >
              <guide.icon className="h-6 w-6 text-blue-600 mb-3" />
              <h3 className="font-medium mb-2">{guide.title}</h3>
              <p className="text-sm text-gray-600">{guide.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}