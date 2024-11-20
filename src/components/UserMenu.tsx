import React, { useState, useRef, useEffect } from 'react';
import { LogOut, User, FileText, Scale, Code, ChevronDown, Settings } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LegalNotice } from './LegalNotice';
import { DevNotes } from './DevNotes';
import { Parameters } from './Settings';
import type { User as UserType } from '../types/auth';

interface UserMenuProps {
  user: UserType;
  onLogout: () => void;
  onShowPatchNotes: () => void;
}

export function UserMenu({ user, onLogout, onShowPatchNotes }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [showDevNotes, setShowDevNotes] = useState(false);
  const [showParameters, setShowParameters] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showPhoto, setShowPhoto] = useState<boolean>(localStorage.getItem('showPhoto') !== 'no');

  const menuRef = useRef<HTMLDivElement>(null);

  const photoUrl = user.photo.startsWith('http') ? user.photo : 'https:' + user.photo;

  const handleImageError = () => {
    setImageError(true);
  };

  useEffect(() => {
    const storedValue = localStorage.getItem('showPhoto');
    if (storedValue) {
      setShowPhoto(storedValue !== 'no');
    }

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center">
        {!imageError && showPhoto ? (
            <img
              src={photoUrl}
              alt="User"
              className="w-full h-full rounded-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <User className="h-6 w-6 text-white" />
          )}
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {user?.prenom} {user?.nom}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{user?.classe}</div>
        </div>
        <ChevronDown 
          className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      <div
        className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 transform origin-top transition-all duration-200 ease-in-out ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
      >
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-700 dark:text-gray-300">Connecté en tant que</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {user?.prenom} {user?.nom}, {user.classe}
          </p>
        </div>

        <button
          onClick={onShowPatchNotes}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
        >
          <FileText className="h-4 w-4" />
          <span>Notes de mise à jour</span>
        </button>

        <button
          onClick={() => setShowDevNotes(true)}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
        >
          <Code className="h-4 w-4" />
          <span>Notes du développeur</span>
        </button>

        <button
          onClick={() => setShowLegal(true)}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
        >
          <Scale className="h-4 w-4" />
          <span>Mentions légales</span>
        </button>
        
        <button
          onClick={() => setShowParameters(true)}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span>Paramètres</span>
        </button>

        <div className="px-4 py-2 flex items-center space-x-2 border-t border-gray-200 dark:border-gray-700">
          <ThemeToggle />
          <span className="text-sm text-gray-700 dark:text-gray-300">Thème</span>
        </div>

        <button
          onClick={onLogout}
          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Déconnexion</span>
        </button>
      </div>

      {showLegal && <LegalNotice onClose={() => setShowLegal(false)} />}
      {showDevNotes && <DevNotes onClose={() => setShowDevNotes(false)} />}
      {showParameters && <Parameters user={user} onClose={() => setShowParameters(false)} />}
    </div>
  );
}
