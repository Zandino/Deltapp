import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
}

export function FileUpload({ onFilesSelected }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesSelected(acceptedFiles);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-blue-500">Déposez les fichiers ici...</p>
      ) : (
        <p className="text-gray-600">
          Glissez et déposez des fichiers ici, ou cliquez pour sélectionner
        </p>
      )}
    </div>
  );
}