import React from 'react';
import { X, Download } from 'lucide-react';
import { useComptabilite } from '../hooks/useComptabilite';

interface DocumentPreviewProps {
  documentId: string;
  onClose: () => void;
}

export default function DocumentPreview({ documentId, onClose }: DocumentPreviewProps) {
  const { adminDocuments } = useComptabilite();
  const document = adminDocuments.find(doc => doc.id === documentId);

  if (!document) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-4xl w-full mx-4 h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">{document.name}</h2>
            <p className="text-sm text-gray-500">{document.type}</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.open(`/api/documents/${document.file}`, '_blank')}
              className="flex items-center px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
            >
              <Download className="h-4 w-4 mr-1" />
              Télécharger
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
          {document.file?.toLowerCase().endsWith('.pdf') ? (
            <iframe
              src={`/api/documents/${document.file}`}
              className="w-full h-full"
              title={document.name}
            />
          ) : (
            <img
              src={`/api/documents/${document.file}`}
              alt={document.name}
              className="w-full h-full object-contain"
            />
          )}
        </div>
      </div>
    </div>
  );
}