import React, { useState } from "react";
import { X } from "lucide-react";

interface NotesPopup {
    selectedSubject: any;
    onClose: () => void;
    period: string;
}
const parseGrade = (value: string): number =>
    parseFloat(value.replace(",", "."));

const getGradeColor = (average: string | number, noteSur: number = 20) => {
  if (average === "N/A") return "text-gray-500 dark:text-gray-400";

  let numericAverage =
    typeof average === "string" ? parseFloat(average) : average;

  if (noteSur !== 20 && !isNaN(numericAverage)) {
    numericAverage = (numericAverage * 20) / noteSur;
  }

  if (numericAverage >= 16) return "text-green-600 dark:text-green-400";
  if (numericAverage >= 14) return "text-emerald-600 dark:text-emerald-400";
  if (numericAverage >= 12) return "text-blue-600 dark:text-blue-400";
  if (numericAverage >= 10) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};

  

export function NotesPopup({ onClose, selectedSubject, period }: NotesPopup) {
  const [isClosing, setIsClosing] = useState(false);

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
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden transform transition-all duration-300 ease-in-out ${
          isClosing ? "animate-pop-out" : "animate-pop-in"
        }`}
      >
        <div className="p-6 flex justify-between items-start border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Note{selectedSubject.notes.length > 1 ? "s" : ""} pour {selectedSubject.matiere}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <ul className="space-y-2">
          {selectedSubject.notes.filter(note => period === note.codePeriode).length === 0 ? (

            <li className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Aucune note disponible pour cette période.
            </li>
          ) : (

            selectedSubject.notes.map((note, idx) => {
              const noteColor = getGradeColor(parseGrade(note.valeur), note.noteSur);
              
              if (period !== note.codePeriode) {
                return null;
              }

              return (
                <li
                  key={idx}
                  className="flex justify-between text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded-lg"
                >
                  <span className={noteColor}>{note.valeur} {note.noteSur != 20? `/ ${note.noteSur}`: ""} {note.coef != 1? `(${note.coef})` : ""}</span>
                  <span>{note.type}</span>
                  <span className="text-black dark:text-white">{new Date(note.date).toLocaleDateString()}</span>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
