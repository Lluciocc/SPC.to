import React from 'react';
import { X } from 'lucide-react';

interface LegalNoticeProps {
  onClose: () => void;
}

export function LegalNotice({ onClose }: LegalNoticeProps) {
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
            ⚖️​Mentions légales
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Informations légales et conditions d'utilisation
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
          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Résumé
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
            ℹ️ SPC.to n'est en aucun cas affilié à EcoleDirecte ou Aplim, il s'agit d'un service indépendant libre et open source.
            <br></br>
            ✅ SPC.to ne collecte aucune information sur les utilisateurs du service.
            <br></br>
            ✅ SPC.to ne crée pas de compte lors de la connexion, la connexion a lieu sur les serveurs d'Aplim. Autrement dit, nous ne STOCKONS PAS les identifiants des utilisateurs se connectant.
            <br></br>
            ✅ SPC.to ne permet, ni ne prétend donner accès à des données auxquelles l'élève n'a pas accès, incluant, mais ne se limitant pas aux : points aux examens* et au rang de l'élève*.
            <br></br>
            ℹ️ Les seules données collectées le sont par Aplim (EcoleDirecte) conformément à leur politique de confidentialité décrite dans leurs Mentions Légales.
            <br></br>
            *Si l'accès à ces données est possible par l'utilisateur sur la plateforme officielle d'EcoleDirecte, ces données peuvent être affichées sur Ecole Directe Plus. Par ailleurs, si les moyennes de l'utilisateur ne sont pas disponibles, elles seront calculées, mais ce de façon locale sur l'appareil du client, les informations ne sont PAS transmises à nos serveurs.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Credits
            </h3>

            <p className="text-gray-700 dark:text-gray-300">Développeur principal:</p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Lluciocc</li>
            </ul>
            <br></br>

            <p className="text-gray-700 dark:text-gray-300">Remerciements spéciaux:</p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>X</li>
              <li>X</li>
              <li>X</li>
            </ul>
            <br></br>

            <p className='text-gray-700 dark:text-gray-300'>APIs et services tiers:</p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>EcoleDirecte</li>
              <li>W3 school</li>
              <li>Chat GPT</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}