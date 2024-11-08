import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';

interface AttachmentViewerProps {
  fileName: string;
  onClose: () => void;
}

export default function AttachmentViewer({ fileName, onClose }: AttachmentViewerProps) {
  const getFileType = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension;
  };

  const fileType = getFileType(fileName);
  const isPDF = fileType === 'pdf';
  const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(fileType || '');

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">{fileName}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="flex items-center px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
            onClick={() => window.open(`/api/attachments/${fileName}`, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Ouvrir
          </button>
          <button
            className="flex items-center px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
          >
            <Download className="h-4 w-4 mr-1" />
            Télécharger
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 bg-gray-50">
        {isPDF ? (
          <iframe
            src={`/api/attachments/${fileName}`}
            className="w-full h-full rounded-lg"
            title={fileName}
          />
        ) : isImage ? (
          <img
            src={`/api/attachments/${fileName}`}
            alt={fileName}
            className="max-w-full max-h-full mx-auto rounded-lg"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                L'aperçu n'est pas disponible pour ce type de fichier
              </p>
              <button
                className="mt-4 flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 mx-auto"
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger le fichier
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}