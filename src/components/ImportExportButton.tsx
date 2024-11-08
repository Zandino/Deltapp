import React, { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ImportExportButtonProps {
  onImport: (data: any[]) => void;
  data: any[];
  filename: string;
  template: Record<string, string>;
}

export default function ImportExportButton({ onImport, data, filename, template }: ImportExportButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        onImport(jsonData);
      };
      reader.readAsBinaryString(file);
    }
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([template]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, `${filename}_template.xlsx`);
  };

  return (
    <div className="flex space-x-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        accept=".xlsx,.xls"
        className="hidden"
      />
      
      <div className="relative">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
        >
          <Upload className="h-5 w-5 mr-2" />
          Importer
        </button>
        <button
          onClick={downloadTemplate}
          className="absolute -top-10 left-0 text-xs text-blue-600 hover:text-blue-800"
        >
          Télécharger le modèle
        </button>
      </div>

      <button
        onClick={handleExport}
        className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
      >
        <Download className="h-5 w-5 mr-2" />
        Exporter
      </button>
    </div>
  );
}