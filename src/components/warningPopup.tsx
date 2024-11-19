import React, { useState } from 'react';
import { X } from 'lucide-react';

export function WarningMessage({ warning }: { warning: string }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false); 

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => setIsVisible(false), 300); // Attendre la fin de l'animation avant de masquer complètement
  };

  setTimeout(() => {
    handleClose()
  }, 3000);

  if (!isVisible || !warning) return null;

  return (
    <div
      className={`mb-4 bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-200 px-4 py-3 rounded relative flex justify-between items-center transition-all duration-300 ${
        isClosing ? 'opacity-0 max-h-0' : 'opacity-100 max-h-20'
      }`}
    >
      <span>{warning}</span>
      <button
        onClick={handleClose}
        className="ml-4 text-yellow-600 dark:text-yellow-200 hover:text-yellow-800 dark:hover:text-yellow-400 transition-colors"
        aria-label="Fermer le message"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
