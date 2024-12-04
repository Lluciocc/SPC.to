import React, { useState } from 'react';
import { X } from 'lucide-react';

interface PatchNotesProps {
  onClose: () => void;
}

export function PatchNotes({ onClose }: PatchNotesProps) {
  const [activeVersion, setActiveVersion] = useState<'v1.0.2' | 'v1.0.1' | 'v1.0.0'>('v1.0.2');
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true); // Déclenche l'animation de fermeture
    setTimeout(() => {
      onClose(); // Appelle la fonction onClose après la fermeture
    }, 300); // Durée de l'animation CSS
  };

  const notes = {
    'v1.0.2': [
      '📈 Amélioration du système de graphiques !',
      '⚙️ Ajout d\'un onglet paramètres qui affiche les informations de l\'utilisateur',
      '💼 Amélioration de l\'expérience utilisateur avec des messages informatifs',
      '⚡ Autres changements et optimisations...',
    ],
    'v1.0.1': [
      '⭐ Ajout du calcul de la moyenne générale de l\'élève',
      '📈 Ajout d\'un graphique permettant de visualiser les notes pendant le trimestre',
      '📌 Ajout d\'un système pour permettre de trier les notes par trimestre',
      '🧮 Nouvelles améliorations de l\'interface des notes et des moyennes',
      '⚖️ Ajout d\'un onglet "Mentions légales"',
      '🔁 Ajout d\'un système de connexion automatique pour rendre l\'expérience plus fluide',
      '🩹 Autres changements et optimisations...',
    ],
    'v1.0.0': [
      '🌙 Ajout du mode sombre pour une meilleure visibilité',
      '🙋🏻‍♂️ Nouveau menu utilisateur avec accès rapide aux fonctionnalités',
      '🧮 Amélioration de l\'interface des notes et des moyennes',
    ],
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden transform transition-all duration-300 ease-in-out ${
          isClosing ? 'animate-pop-out' : 'animate-pop-in'
        }`}
      >
        <div className="p-6 flex justify-between items-start border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notes de mise à jour</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Dernières modifications et améliorations
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex space-x-4">
          {Object.keys(notes).map((version) => (
            <button
              key={version}
              onClick={() => setActiveVersion(version as 'v1.0.1' | 'v1.0.0' | 'v1.0.2')}
              className={`text-sm font-medium ${
                activeVersion === version
                  ? 'text-indigo-600 dark:text-indigo-300'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {version}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {notes[activeVersion].map((note, index) => (
            <div key={index} className="flex items-start space-x-3">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 mt-2"></span>
              <span className="text-gray-700 dark:text-gray-300">{note}</span>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Suivez nos mises à jour pour découvrir les nouvelles fonctionnalités à venir !
          </p>
        </div>
      </div>
    </div>
  );
}
