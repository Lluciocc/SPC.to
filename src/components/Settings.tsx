import React from 'react';
import { X } from 'lucide-react';

interface Parameters {
  onClose: () => void;
}

export function Parameters({ onClose }: Parameters) {
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden transform transition-all duration-300 ease-in-out animate-in"
        style={{
          animation: 'popup 0.3s ease-out',
        }}
      >
        <div className="p-6 flex justify-between items-start border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                ⚙️Paramètres
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Modifier votre experience
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
          //
        </div>
      </div>
    </div>
  );
}