import React, { useState } from 'react';
import { X } from 'lucide-react';

export function InfoMessage({ info }: { info: string }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false); // Pour gérer l'animation
  
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => setIsVisible(false), 300); // Attendre la fin de l'animation avant de masquer complètement
  };

  if (!isVisible || !info) return null;

  return (
    <div
      className={`mb-4 bg-green-50 dark:bg-green-900/50 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-200 px-4 py-3 rounded relative flex justify-between items-center transition-all duration-300 ${
        isClosing ? 'opacity-0 max-h-0' : 'opacity-100 max-h-20'
      }`}
    >
      <span>{info}</span>
      <button
        onClick={handleClose}
        className="ml-4 text-green-600 dark:text-green-200 hover:text-green-800 dark:hover:text-green-400 transition-colors"
        aria-label="Fermer le message"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

const style = document.createElement('style');
style.textContent = `
  @keyframes marquee {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(-100%);
    }
  }
`;
document.head.appendChild(style);
