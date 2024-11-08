import React from 'react';
import { useInterventionForm } from './useInterventionForm';
import type { InterventionInput } from '../../types/intervention';
import { FileUpload } from '../FileUpload';
import { X, Plus } from 'lucide-react';

interface InterventionFormProps {
  onSubmit: (data: InterventionInput) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<InterventionInput>;
}

const InterventionForm: React.FC<InterventionFormProps> = ({
  onSubmit,
  onCancel,
  initialData
}) => {
  const {
    form: { register, formState: { errors } },
    attachments,
    trackingNumbers,
    handleSubmit,
    addTrackingNumber,
    removeTrackingNumber,
    addAttachment,
    removeAttachment,
  } = useInterventionForm({ onSubmit, initialData });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Add other form fields here */}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Attachments
          </label>
          <FileUpload
            onFilesSelected={(files) => files.forEach(addAttachment)}
            maxFiles={5}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          {attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tracking Numbers
          </label>
          <div className="mt-1 flex space-x-2">
            <input
              type="text"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Add tracking number"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTrackingNumber((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
            />
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => {
                const input = document.querySelector('input[placeholder="Add tracking number"]') as HTMLInputElement;
                if (input.value) {
                  addTrackingNumber(input.value);
                  input.value = '';
                }
              }}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {trackingNumbers.length > 0 && (
            <div className="mt-2 space-y-2">
              {trackingNumbers.map((number, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm">{number}</span>
                  <button
                    type="button"
                    onClick={() => removeTrackingNumber(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default InterventionForm;