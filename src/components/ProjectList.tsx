import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Edit, Trash2, Copy, FileText } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { useModal } from '../hooks/useModal';
import ProjectForm from './ProjectForm';

interface Project {
  id: string;
  name: string;
  description: string;
  clientName: string;
  startDate: string;
  endDate?: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  interventions: any[];
}

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  const { deleteProject, duplicateProject } = useProjects();
  const { openModal } = useModal();

  const handleEdit = (project: Project) => {
    openModal(
      <ProjectForm
        mode="edit"
        initialData={project}
        onClose={() => {}}
      />
    );
  };

  const handleDuplicate = async (project: Project) => {
    const newStartDate = prompt('Entrez la nouvelle date de début (YYYY-MM-DD):', 
      format(new Date(), 'yyyy-MM-dd'));
    if (newStartDate) {
      await duplicateProject(project.id, newStartDate);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      await deleteProject(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'PLANNED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Terminé';
      case 'IN_PROGRESS':
        return 'En cours';
      case 'PLANNED':
        return 'Planifié';
      case 'CANCELLED':
        return 'Annulé';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <div key={project.id} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <p className="text-sm text-gray-500">{project.clientName}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(project)}
                className="text-blue-600 hover:text-blue-800"
                title="Modifier"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDuplicate(project)}
                className="text-green-600 hover:text-green-800"
                title="Dupliquer"
              >
                <Copy className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="text-red-600 hover:text-red-800"
                title="Supprimer"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Date de début</p>
              <p className="font-medium">
                {format(new Date(project.startDate), 'dd MMMM yyyy', { locale: fr })}
              </p>
            </div>
            {project.endDate && (
              <div>
                <p className="text-sm text-gray-500">Date de fin</p>
                <p className="font-medium">
                  {format(new Date(project.endDate), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Statut</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {getStatusText(project.status)}
              </span>
            </div>
          </div>

          <p className="text-gray-600 mb-4">{project.description}</p>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">Interventions</h4>
              <span className="text-sm text-gray-500">
                {project.interventions.length} intervention(s)
              </span>
            </div>
            <div className="space-y-2">
              {project.interventions.map((intervention) => (
                <div
                  key={intervention.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{intervention.title}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(intervention.date), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}