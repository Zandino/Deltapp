import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/Modal';
import TechnicianForm from '../components/TechnicianForm';
import TechnicianList from '../components/TechnicianList';
import type { User } from '../types/user';

export default function Entreprise() {
  const { user } = useAuth();
  const { users, addUser, updateUser } = useUsers();
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: any) => {
    setFormError(null);
    setIsSubmitting(true);

    try {
      const userData = {
        ...formData,
        role: 'TECHNICIAN' as const,
        company: 'DeltAPP'
      };

      await addUser(userData);
      setShowNewUserForm(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Erreur lors de la création du compte');
      console.error('Error creating user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (formData: any) => {
    if (!selectedUser) return;
    setFormError(null);
    setIsSubmitting(true);

    try {
      await updateUser(selectedUser.id, {
        ...formData,
        role: 'TECHNICIAN'
      });
      setSelectedUser(null);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Erreur lors de la mise à jour');
      console.error('Error updating user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const technicians = users.filter(u => u.role === 'TECHNICIAN');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des techniciens</h1>
        <button
          onClick={() => setShowNewUserForm(true)}
          className="flex items-center px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter un technicien
        </button>
      </div>

      <TechnicianList
        technicians={technicians}
        onEdit={setSelectedUser}
      />

      <Modal
        isOpen={showNewUserForm || selectedUser !== null}
        onClose={() => {
          setShowNewUserForm(false);
          setSelectedUser(null);
          setFormError(null);
        }}
      >
        <TechnicianForm
          onSubmit={selectedUser ? handleUpdate : handleSubmit}
          onCancel={() => {
            setShowNewUserForm(false);
            setSelectedUser(null);
            setFormError(null);
          }}
          initialData={selectedUser || undefined}
          isSubmitting={isSubmitting}
          error={formError}
        />
      </Modal>
    </div>
  );
}