import React from 'react';
import { X } from 'lucide-react';
import type { User as UserType } from '../types/auth';

interface Parameters {
  user: UserType;
  onClose: () => void;
}

export function Parameters({ user, onClose }: Parameters) {
  const clearLocalStorage = async () => {
    localStorage.clear()
  }
  console.log(user)
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

        <div className="p-6 overflow-y-auto max-h-[60vh] spxace-y-6">
        <div className="flex items-center space-x-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-md">
          <div className="p-2 bg-indigo-600 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12h.008v.008H16.5v-.008zM4.75 4a2 2 0 00-2 2v12a2 2 0 002 2h14.5a2 2 0 002-2V6a2 2 0 00-2-2H4.75zM22 6.25v11.5M2 6.25v11.5M3 6.5l8.25 6.5M22 6.5l-8.25 6.5"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Adresse e-mail</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">{user.email}</p>
          </div>
        </div>

        <button
            onClick={clearLocalStorage}
            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Clear localStorage</span>
          </button>
        </div>
      </div>
    </div>
  );
}