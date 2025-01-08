import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import { GetMessageContent } from "../../utils/messagerie";
import { decodeBase64 } from "../../utils/base64";
import { downloadFile } from "../../utils/download";

interface MessagerieContentProps {
  onClose: () => void;
  id: number;
  token: string;
  messageID: number;
}

interface From {
    nom: string;
    prenom: string;
    particule: string;
    civilite: string;
    role: string;
    listeRouge: boolean;
    id: number;
    read: boolean;
    fonctionPersonnel: string;
  }
  
interface Message {
    id: number;
    responseId: number;
    forwardId: number;
    mtype: string;
    read: boolean;
    idDossier: number;
    idClasseur: number;
    transferred: boolean;
    answered: boolean;
    to_cc_cci: string;
    brouillon: boolean;
    canAnswer: boolean;
    subject: string;
    content: string; // base64
    date: string;
    to: any[]; 
    files: {
      id: number;
      libelle: string;
      date: string;
      type: string;
      signatureDemandee: boolean;
      etatSignatures: any[]; 
      signature: any;
    }[];
    from: From;
} // -> oui chat gpt a fait cette interface
  

export function MessageContent({ onClose, id, token, messageID }: MessagerieContentProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await GetMessageContent(token, id, messageID);
        setMessage(response)
      } catch (err) {
        setError("Erreur lors de la récupération des messages.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [token, id, messageID]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden transform transition-all duration-300 ease-in-out ${
          isClosing ? "animate-pop-out" : "animate-pop-in"
        }`}
      >
        <div className="p-6 flex justify-between items-start border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {message?.subject}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {message?.from?.civilite} {message?.from?.nom}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              <p className="text-gray-500 dark:text-gray-400">Chargement...</p>
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) :  (
            <div>
              {/* Affichage du contenu du message */}
              <div className="prose max-w-none">
                <div className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 dark:focus:border-indigo-400"
                dangerouslySetInnerHTML={{ __html: decodeBase64(message?.content) }} 
                />
              </div>
              <div className="mt-6">
                {message?.files && message.files.length > 0 ? (
                    <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Fichiers attachés :</h3>
                    <ul className="mt-4 space-y-2">
                        {message.files.map((file) => (
                        <li key={file.id} className="flex items-center justify-between">
                            <span className="text-sm text-gray-700 dark:text-gray-300">{file.libelle}</span>
                            <button
                            onClick={() => downloadFile(file.id, token, 'PIECE_JOINTE', file.libelle)}
                            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors text-sm"
                            >
                            <Download className="inline h-4 w-4 mr-1" /> Télécharger
                            </button>
                        </li>
                        ))}
                    </ul>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400"></p>
                )}
                </div>

              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">Envoyé le {message?.date}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
