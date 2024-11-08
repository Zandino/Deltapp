import { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { InterventionInput } from '../../types/intervention';
import { validateIntervention } from '../../utils/interventionUtils';

interface UseInterventionFormProps {
  onSubmit: (data: InterventionInput) => Promise<void>;
  initialData?: Partial<InterventionInput>;
}

export const useInterventionForm = ({ onSubmit, initialData }: UseInterventionFormProps) => {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [trackingNumbers, setTrackingNumbers] = useState<string[]>(
    initialData?.trackingNumbers || []
  );

  const form = useForm<InterventionInput>({
    defaultValues: initialData || {
      trackingNumbers: [],
    },
  });

  const handleSubmit = async (data: InterventionInput) => {
    const formData = {
      ...data,
      attachments,
      trackingNumbers,
    };

    if (!validateIntervention(formData)) {
      throw new Error('Invalid intervention data');
    }

    await onSubmit(formData);
  };

  const addTrackingNumber = (number: string) => {
    if (number.trim()) {
      setTrackingNumbers([...trackingNumbers, number.trim()]);
    }
  };

  const removeTrackingNumber = (index: number) => {
    setTrackingNumbers(trackingNumbers.filter((_, i) => i !== index));
  };

  const addAttachment = (file: File) => {
    setAttachments([...attachments, file]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return {
    form,
    attachments,
    trackingNumbers,
    handleSubmit: form.handleSubmit(handleSubmit),
    addTrackingNumber,
    removeTrackingNumber,
    addAttachment,
    removeAttachment,
  };
};