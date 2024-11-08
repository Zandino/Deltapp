import { create } from 'zustand';
import prisma from '../lib/db';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

interface Project {
  id: string;
  name: string;
  description: string;
  clientId: string;
  clientName: string;
  startDate: string;
  endDate?: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  interventions: any[];
}

interface ProjectsStore {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'interventions'>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  duplicateProject: (id: string, newStartDate: string) => Promise<void>;
  importFromExcel: (file: File) => Promise<void>;
}

export const useProjects = create<ProjectsStore>((set, get) => ({
  projects: [],
  isLoading: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true });
    try {
      const projects = await prisma.project.findMany({
        include: {
          interventions: true
        }
      });
      
      const formattedProjects = projects.map(project => ({
        ...project,
        startDate: format(project.startDate, 'yyyy-MM-dd'),
        endDate: project.endDate ? format(project.endDate, 'yyyy-MM-dd') : undefined
      }));

      set({ projects: formattedProjects, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch projects', isLoading: false });
    }
  },

  addProject: async (projectData) => {
    set({ isLoading: true });
    try {
      const project = await prisma.project.create({
        data: {
          ...projectData,
          startDate: new Date(projectData.startDate),
          endDate: projectData.endDate ? new Date(projectData.endDate) : null
        },
        include: {
          interventions: true
        }
      });

      set(state => ({
        projects: [...state.projects, {
          ...project,
          startDate: format(project.startDate, 'yyyy-MM-dd'),
          endDate: project.endDate ? format(project.endDate, 'yyyy-MM-dd') : undefined
        }],
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to add project', isLoading: false });
    }
  },

  updateProject: async (id, updates) => {
    set({ isLoading: true });
    try {
      const project = await prisma.project.update({
        where: { id },
        data: {
          ...updates,
          startDate: updates.startDate ? new Date(updates.startDate) : undefined,
          endDate: updates.endDate ? new Date(updates.endDate) : undefined
        },
        include: {
          interventions: true
        }
      });

      set(state => ({
        projects: state.projects.map(p => p.id === id ? {
          ...project,
          startDate: format(project.startDate, 'yyyy-MM-dd'),
          endDate: project.endDate ? format(project.endDate, 'yyyy-MM-dd') : undefined
        } : p),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update project', isLoading: false });
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true });
    try {
      await prisma.project.delete({
        where: { id }
      });
      set(state => ({
        projects: state.projects.filter(p => p.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete project', isLoading: false });
    }
  },

  duplicateProject: async (id, newStartDate) => {
    set({ isLoading: true });
    try {
      const existingProject = await prisma.project.findUnique({
        where: { id },
        include: {
          interventions: true
        }
      });

      if (!existingProject) {
        throw new Error('Project not found');
      }

      const { id: oldId, createdAt, updatedAt, interventions, ...projectData } = existingProject;

      const newProject = await prisma.project.create({
        data: {
          ...projectData,
          name: `${projectData.name} (Copy)`,
          startDate: new Date(newStartDate),
          status: 'PLANNED',
          interventions: {
            create: interventions.map(({ id, createdAt, updatedAt, projectId, ...intervention }) => ({
              ...intervention,
              date: new Date(newStartDate)
            }))
          }
        },
        include: {
          interventions: true
        }
      });

      await get().fetchProjects();
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to duplicate project', isLoading: false });
    }
  },

  importFromExcel: async (file: File) => {
    set({ isLoading: true });
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      for (const row of jsonData) {
        const projectData = {
          name: row['Project Name'],
          description: row['Description'],
          clientId: row['Client ID'],
          clientName: row['Client Name'],
          startDate: new Date(row['Start Date']),
          endDate: row['End Date'] ? new Date(row['End Date']) : null,
          status: 'PLANNED',
          interventions: {
            create: [{
              title: row['Intervention Title'],
              description: row['Intervention Description'],
              date: new Date(row['Intervention Date']),
              status: 'pending',
              address: row['Address'],
              city: row['City'],
              postalCode: row['Postal Code'],
              latitude: parseFloat(row['Latitude']),
              longitude: parseFloat(row['Longitude']),
              client: row['Client Name'],
              phone: row['Phone']
            }]
          }
        };

        await prisma.project.create({
          data: projectData
        });
      }

      await get().fetchProjects();
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to import from Excel', isLoading: false });
    }
  }
}));