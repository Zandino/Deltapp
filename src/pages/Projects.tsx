import React, { useState, useEffect } from 'react';
import { Plus, FileSpreadsheet } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import ProjectList from '../components/ProjectList';
import ProjectForm from '../components/ProjectForm';
import ProjectImport from '../components/ProjectImport';
import Modal from '../components/Modal';

export default function Projects() {
  const [showNewProject, setShowNewProject] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const { projects, fetchProjects } = useProjects();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Projets</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
          >
            <FileSpreadsheet className="h-5 w-5 mr-2" />
            Importer
          </button>
          <button
            onClick={() => setShowNewProject(true)}
            className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouveau projet
          </button>
        </div>
      </div>

      <ProjectList projects={projects} />

      <Modal
        isOpen={showNewProject}
        onClose={() => setShowNewProject(false)}
      >
        <ProjectForm
          onClose={() => setShowNewProject(false)}
        />
      </Modal>

      <Modal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Importer des projets</h2>
          <ProjectImport />
        </div>
      </Modal>
    </div>
  );
}