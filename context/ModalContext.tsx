"use client";

import React, { createContext, useContext, useState } from 'react';
import SuccessModal from '@/components/ui/SuccessModal';
import ErrorModal from '@/components/ui/ErrorModal'; // Assuming it's in the same directory

interface ModalContextType {
  showSuccess: (title?: string, message?: string) => void;
  showError: (title?: string, message?: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error'>('success');
  const [successConfig, setSuccessConfig] = useState({ title: 'Success!', message: 'Your changes have been saved.' });
  const [errorConfig, setErrorConfig] = useState({ title: 'Something went wrong', message: 'An error occurred. Please try again.' });
  const showSuccess = (title?: string, message?: string) => {
    setModalType('success');
    setSuccessConfig({
      title: title || 'Success!',
      message: message || 'Your changes have been saved.',
    });
    setIsOpen(true);
  };

  const showError = (title?: string, message?: string) => {
    setModalType('error');
    setErrorConfig({
      title: title || 'Something went wrong',
      message: message || 'An error occurred while saving your data. Please try again.',
    });
    setIsOpen(true);
  };

  const handleClose = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ showSuccess, showError }}>
      {children}

      {/* Render SuccessModal only if open and type matches */}
      <SuccessModal
        isOpen={isOpen && modalType === 'success'}
        onClose={handleClose}
        title={successConfig.title}
        message={successConfig.message}
      />

      {/* Render ErrorModal only if open and type matches */}
      <ErrorModal
        isOpen={isOpen && modalType === 'error'}
        onClose={handleClose}
        title={errorConfig.title}
        message={errorConfig.message}
      />
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within a ModalProvider');
  return context;
};