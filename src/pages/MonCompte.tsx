import React, { useState } from 'react';
import { User, Mail, Phone, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/Modal';
import ResetPasswordForm from '../components/ResetPasswordForm';

export default function MonCompte() {
  const { user } = useAuth();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mon Compte</h1>
      
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-gray-500">
                {user?.role === 'ADMIN' ? 'Administrateur' : 
                 user?.role === 'DISPATCHER' ? 'Dispatcher' :
                 user?.role === 'TECHNICIAN' ? 'Technicien' : 'Sous-traitant'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informations personnelles */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p className="font-medium">{user?.phone || 'Non renseigné'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Rôle</p>
                  <p className="font-medium">
                    {user?.role === 'ADMIN' ? 'Administrateur' : 
                     user?.role === 'DISPATCHER' ? 'Dispatcher' :
                     user?.role === 'TECHNICIAN' ? 'Technicien' : 'Sous-traitant'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={() => setShowEmailModal(true)}
                className="w-full px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
              >
                Modifier mes informations
              </button>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
              >
                Changer mon mot de passe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Changement de mot de passe */}
      {showPasswordModal && (
        <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
          <ResetPasswordForm onClose={() => setShowPasswordModal(false)} />
        </Modal>
      )}

      {/* Modal Modification des informations */}
      {showEmailModal && (
        <Modal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)}>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Modifier mes informations</h2>
            <p className="text-gray-500">Cette fonctionnalité sera bientôt disponible.</p>
            <button
              onClick={() => setShowEmailModal(false)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Fermer
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}