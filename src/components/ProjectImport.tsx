import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';

export default function ProjectImport() {
  const { importFromExcel } = useProjects();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      try {
        await importFromExcel(file);
      } catch (error) {
        console.error('Error importing project:', error);
      }
    }
  }, [importFromExcel]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        {isDragActive
          ? 'Déposez le fichier ici...'
          : 'Glissez et déposez un fichier Excel, ou cliquez pour sélectionner'}
      </p>
      <p className="text-xs text-gray-500 mt-1">
        Format accepté : Excel (.xlsx, .xls)
      </p>
    </div>
  );
}