import React from 'react';
import { X, Github, Coffee } from 'lucide-react';

interface DevNotesProps {
  onClose: () => void;
}

export function DevNotes({ onClose }: DevNotesProps) {
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
            🧑‍💻​ Notes du développeur
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              À propos du développement de SPC.to
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
          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              À propos du projet
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              SPC.to est un projet open-source développé avec React et TypeScript. L'objectif est de fournir une interface moderne et intuitive pour consulter vos moyennes EcoleDirecte.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Technologies utilisées
            </h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>React avec TypeScript</li>
              <li>Tailwind CSS pour le style</li>
              <li>Lucide React pour les icônes</li>
              <li>Vite comme bundler</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              À savoir
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              SPC.to utilise des cookies (localStorage) afin de permettre une expérience optimale. Vous pouvez les supprimer à tout moment dans l'onglet paramètres.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Contribuer
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://github.com/votre-repo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
              >
                <Github className="h-5 w-5" />
                Voir sur GitHub
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}