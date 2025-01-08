import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { GetMessageContent, GetMessagerie } from "../../utils/messagerie";
import { MessageContent } from "./messageContentPopup";

interface MessagerieProps {
  onClose: () => void;
  id: number;
  token: string;
}

export function MessageriePopup({ onClose, id, token }: MessagerieProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<any[]>([]);
  const [showMessageContent, setShowMessageContent] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const fetchedMessages = await GetMessagerie(token, id);
        if (Array.isArray(fetchedMessages)) {
          setMessages(fetchedMessages);
        } else {
          setError("Données inattendues reçues.");
        }
      } catch (err) {
        setError("Erreur lors de la récupération des messages.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [token, id]);

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
              📧 Messagerie
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Regarder vos messages
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
          ) : messages.length > 0 ? (
            messages.map((message, index) => (
              <div
                onClick={() => {setSelectedMessage(message); setShowMessageContent(true)}}
                //onClick={() => {console.log(GetMessageContent(token, id, message.id))}}
                key={index}
                className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {message.subject || "Sujet non défini"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {message.from?.civilite} {message.from?.nom} {"|"} {message.date}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Aucun message.</p>
          )}
        </div>
      </div>

      {showMessageContent && <MessageContent onClose={() => setShowMessageContent(false)} messageID={selectedMessage?.id} id={id} token={token}></MessageContent>}
    </div>
  );
}
