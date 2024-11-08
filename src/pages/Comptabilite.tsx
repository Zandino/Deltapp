import React, { useState, useEffect } from 'react';
import { Euro, TrendingUp, Calendar, Download, Upload, Plus, Eye } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useComptabilite } from '../hooks/useComptabilite';
import StatCard from '../components/StatCard';
import Modal from '../components/Modal';
import NewInvoiceForm from '../components/NewInvoiceForm';
import NewDocumentForm from '../components/NewDocumentForm';
import DocumentPreview from '../components/DocumentPreview';

export default function Comptabilite() {
  const [showNewInvoice, setShowNewInvoice] = useState(false);
  const [showNewDocument, setShowNewDocument] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const { stats, monthlyInvoices, adminDocuments, fetchMonthlyInvoices, updateInvoiceStatus } = useComptabilite();

  useEffect(() => {
    fetchMonthlyInvoices();
  }, [fetchMonthlyInvoices]);

  const handleFileUpload = async (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await updateInvoiceStatus(id, 'Envoyé', file.name);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  const formatMonth = (dateStr: string) => {
    const date = parseISO(dateStr + '-01');
    return format(date, 'MMMM yyyy', { locale: fr })
      .split(' ')
      .map((part, index) => 
        index === 0 
          ? part.charAt(0).toUpperCase() + part.slice(1) 
          : part
      )
      .join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Chiffre d'affaires mensuel"
          value={`${stats.monthlyRevenue.toLocaleString('fr-FR')} €`}
          icon={Euro}
          description={`+${stats.monthlyGrowth}% vs mois précédent`}
        />
        <StatCard
          title="Interventions facturées"
          value={stats.paidInterventions.toString()}
          icon={Calendar}
        />
        <StatCard
          title="Factures en attente"
          value={stats.pendingInvoices.toString()}
          icon={Calendar}
        />
        <StatCard
          title="Taux de recouvrement"
          value={`${stats.recoveryRate}%`}
          icon={TrendingUp}
        />
      </div>

      {/* Factures mensuelles */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Factures mensuelles</h2>
          <button
            onClick={() => setShowNewInvoice(true)}
            className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouvelle facture
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Mois</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Interventions</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">Montant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date d'envoi</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {monthlyInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatMonth(invoice.period)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.interventionsCount} intervention(s)
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-medium">
                    {invoice.amount.toLocaleString('fr-FR')} €
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      invoice.status === 'Payé' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'Envoyé' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {invoice.uploadDate ? format(parseISO(invoice.uploadDate), 'dd/MM/yyyy') : '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                      {invoice.status === 'En attente' && (
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf"
                            onChange={(e) => handleFileUpload(invoice.id, e)}
                          />
                          <Upload className="h-5 w-5 text-blue-600 hover:text-blue-800" />
                        </label>
                      )}
                      {invoice.attachment && (
                        <button
                          onClick={() => {/* Logique de téléchargement */}}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showNewInvoice && (
        <Modal isOpen={showNewInvoice} onClose={() => setShowNewInvoice(false)}>
          <NewInvoiceForm
            onSubmit={async (data) => {
              try {
                await updateInvoiceStatus(data.id, data.status);
                await fetchMonthlyInvoices();
                setShowNewInvoice(false);
              } catch (error) {
                console.error('Error creating invoice:', error);
              }
            }}
            onCancel={() => setShowNewInvoice(false)}
            monthlyTransactions={[]}
          />
        </Modal>
      )}

      {showNewDocument && (
        <Modal isOpen={showNewDocument} onClose={() => setShowNewDocument(false)}>
          <NewDocumentForm
            onSubmit={(data) => {
              setShowNewDocument(false);
            }}
            onCancel={() => setShowNewDocument(false)}
          />
        </Modal>
      )}

      {selectedDocument && (
        <DocumentPreview
          documentId={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
}