import React, { useState, useEffect } from "react";
import { X, Mail, School, Contact, Phone } from "lucide-react";
import type { User as UserType } from "../types/auth";

interface ParametersProps {
  user: UserType;
  onClose: () => void;
}

export function Parameters({ user, onClose }: ParametersProps) {
  const [isOn, setIsOn] = useState(localStorage.getItem("showPhoto") !== "no");
  const [isClosing, setIsClosing] = useState(false);

  const clearLocalStorage = async () => {
    localStorage.clear();
    
  };

  useEffect(() => {
    localStorage.setItem("showPhoto", isOn ? "yes" : "no");
  }, [isOn]);

  const handleSwitchToggle = () => {
    setIsOn(!isOn);
  };

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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">⚙️ Paramètres</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Modifier votre expérience</p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Informations personnelles</h2>

          {/* Informations utilisateur */}
          <div className="flex items-center space-x-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <div className="p-2 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
              <Contact className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Informations</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {user.prenom} {user.nom}, {user.classe}, {user.id}
              </p>
            </div>
          </div>

          {/* Adresse e-mail */}
          <div className="flex items-center space-x-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <div className="p-2 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Adresse e-mail</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{user.email}</p>
            </div>
          </div>

          {/* Numéro de téléphone */}
          <div className="flex items-center space-x-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <div className="p-2 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Num Tél.</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {user.phone && user.phone.trim() ? user.phone : "vide"}
              </p>
            </div>
          </div>

          {/* Etablissement */}
          <div className="flex items-center space-x-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <div className="p-2 bg-indigo-600 rounded-full flex items-center justify-center shadow-md">
              <School className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Etablissement</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{user.etablissement}</p>
            </div>
          </div>

          {/* Switch On/Off */}
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <p className="text-sm text-gray-500 dark:text-gray-400">Afficher la photo</p>
            <div
              className={`relative inline-block w-12 align-middle select-none transition duration-200 ease-in ${
                isOn ? "bg-indigo-600" : "bg-gray-300"
              } rounded-full`}
              onClick={handleSwitchToggle}
            >
              <span
                className={`inline-block w-6 h-6 transform bg-white rounded-full transition duration-200 ease-in-out ${
                  isOn ? "translate-x-6" : "translate-x-0"
                }`}
              ></span>
            </div>
          </div>

          {/* Clear localStorage */}
          <button
            onClick={clearLocalStorage}
            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 transition-colors rounded-lg shadow-md mt-4"
          >
            <X className="h-4 w-4" />
            <span>Effacer localStorage</span>
          </button>
        </div>
      </div>
    </div>
  );
}
