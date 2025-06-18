'use client';

import Modal from './Modal';
import Button from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isConfirming?: boolean;
}

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isConfirming = false,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onClose} disabled={isConfirming}>
          {cancelText}
        </Button>
        <Button
          variant="primary"
          className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
          onClick={onConfirm}
          disabled={isConfirming}
        >
          {isConfirming ? 'Deleting...' : confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;