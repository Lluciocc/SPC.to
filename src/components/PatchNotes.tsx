import React from 'react';
import { X } from 'lucide-react';

interface PatchNotesProps {
  onClose: () => void;
}

export function PatchNotes({ onClose }: PatchNotesProps) {
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
              Notes de mise à jour
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Dernières modifications et améliorations
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                  <div className="space-y-8">
                      <div>
                          <div className="flex items-center space-x-2">
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                                  v1.0.1
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                  🗓️ 17 Novembre 2024
                              </span>
                          </div>
                          <ul className="mt-4 space-y-3">
                              <li className="flex items-start space-x-3">
                                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 mt-2"></span>
                                  <span className="text-gray-700 dark:text-gray-300">
                                      🌙 Ajout d'un systeme pour permettre de trier les notes par trimestre
                                  </span>
                              </li>
                              <li className="flex items-start space-x-3">
                                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 mt-2"></span>
                                  <span className="text-gray-700 dark:text-gray-300">
                                      🧮 Nouvelles améliorations de l'interface des notes et des moyennes 
                                  </span>
                              </li>
                              <li className="flex items-start space-x-3">
                                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 mt-2"></span>
                                  <span className="text-gray-700 dark:text-gray-300">
                                      ⚖️ Ajout d'un onglet 'Mentions légales'
                                  </span>
                              </li>
                          </ul>
                      </div>
                  </div>
              </div>


        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-8">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                  v1.0.0
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  🗓️ 11 Novembre 2024
                </span>
              </div>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 mt-2"></span>
                  <span className="text-gray-700 dark:text-gray-300">
                    🌙 Ajout du mode sombre pour une meilleure visibilité
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 mt-2"></span>
                  <span className="text-gray-700 dark:text-gray-300">
                    🙋🏻‍♂️ Nouveau menu utilisateur avec accès rapide aux
                    fonctionnalités
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 mt-2"></span>
                  <span className="text-gray-700 dark:text-gray-300">
                    🧮 Amélioration de l'interface des notes et des moyennes
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Suivez nos mises à jour pour découvrir les nouvelles fonctionnalités
            à venir !
          </p>
        </div>
      </div>
    </div>
  );
}