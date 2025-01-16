import React, { useState } from 'react';
import { LoginForm } from './components/Form/LoginForm';
import { QcmForm, Question } from './components/Form/QcmForm';
import { GradesTable } from './components/Grades/GradesTable';
import { ThemeProvider } from './context/ThemeContext';
import { UserMenu } from './components/User/UserMenu';
import { login, validateQcm, getGrades, getQCM, FinalLogin } from './services/api';
import type { User, Grade } from './types/auth';
import { InfoMessage } from './components/Popup/infoPopup';
import { WarningMessage } from './components/Popup/warningPopup';
import { getRandomPhrase } from './utils/motivate';

import json_notes_data from './utils/json/notes_admin.json';
import { console_message } from './utils/console';
import { GetDocs } from './utils/docAdm';

interface AuthUser extends User {
  token: string;
}

function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQcm, setShowQcm] = useState(false);
  const [qcmQuestions, setQcmQuestions] = useState<Question[]>([]);
  const [tempToken, setTempToken] = useState<string>('');
  const [usernameStr, setUsernameStr] = useState<string>('');
  const [passStr, setPassStr] = useState<string>('');
  const [warning, setWarning] = useState<string>('');
  const [coefficients, setCoefficients] = useState<{ [key: string]: number }>({});
  const [infos, setInfos] = useState<string>('');
  const [goodSousMatiere, setSousMatiere] = useState<any>();

  window.onload = async function TryToLog() {
    console_message()
    setInfos("Le site est en cours de maintenance du a Ecole Directe. Merci de votre indulgence !");

    try {
      if (
        localStorage.getItem('token') !== null &&
        localStorage.getItem('username') !== null &&
        localStorage.getItem('password') !== null &&
        localStorage.getItem('cn') !== null &&
        localStorage.getItem('cv') !== null
      ) {
        setWarning("Trying to log you...");
        console.warn('not logged for the first time');

        const token_local = localStorage.getItem('token');
        const username_local = localStorage.getItem('username');
        const password_local = localStorage.getItem('password');
        const cn_local = localStorage.getItem('cn');
        const cv_local = localStorage.getItem('cv');
        const { token, account } = await FinalLogin(
          token_local,
          username_local,
          password_local,
          cn_local,
          cv_local
        );

        const authUser: AuthUser = {
          ...account,
          token,
        };

        setUser(authUser);
        setShowQcm(false);

        GetDocs(token);

        const gradesData = await getGrades(token, account.id);
        const periodeActuelle = gradesData.periodes.find(
          (periode) => periode.codePeriode === 'A001'
        );

        if (periodeActuelle && periodeActuelle.ensembleMatieres?.disciplines) {
          const disciplines = periodeActuelle.ensembleMatieres.disciplines;

          const coefficients = disciplines.reduce((acc, discipline) => {
            acc[discipline.codeMatiere] = discipline.coef; // Utiliser codeMatiere comme clé
            return acc;
          }, {});
          ///////////////////////////////////////////////
          const listedSousMatiere = disciplines.reduce((acc, discipline) => {
            if (!discipline.sousMatiere) {

              acc[discipline.codeMatiere] = {
                matierePrincipale: discipline.discipline,
                sousMatieres: [],
              };
            } else {

              if (acc[discipline.codeMatiere]) {
                acc[discipline.codeMatiere].sousMatieres.push(discipline.discipline);
              }
            }
          
            return acc;
          }, {});
          setSousMatiere(listedSousMatiere);
          ////////////////////////////////////////////////
          setCoefficients(coefficients);
          setGrades(gradesData.notes);
        } else {
          console.warn('Période ou disciplines introuvables dans les données.');
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Connexion échouée. Veuillez réessayer.';
      setError(errorMessage);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    setUsernameStr(username);
    setPassStr(password);
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    localStorage.setItem('showPhoto', "yes"); // -> Settings.tsx

    try {
      console.warn('logged for the first time');

      const token = await login(username, password);
      if (token === "xxxxxxx") {
        setInfos("Vous êtes connecté à une session administrateur. Toutes les informations affichées sont fictives et sont uniquement destinées à des fins de test.");
        setShowQcm(false);
        let account = {
          id: 1111,
          nom: "Admin",
          prenom: "/",
          sexe: "?",
          email: "admin@example.com",
          classe: "1-10",
          photo: "xx",
          etablissement: "SPC",
          phone: "000-000-0000",
          profile: "Admin Profile",
        };

        const authAdmin: AuthUser = {
          ...account,
          token,
        };

        const gradesData = json_notes_data.data;
        const periodeActuelle = gradesData.periodes.find(
          (periode) => periode.codePeriode === 'A001'
        );

        if (periodeActuelle && periodeActuelle.ensembleMatieres?.disciplines) {
          const disciplines = periodeActuelle.ensembleMatieres.disciplines;

          const coefficients = disciplines.reduce((acc, discipline) => {
            acc[discipline.codeMatiere] = discipline.coef;
            return acc;
          }, {});
          ///////////////////////////////////////////////
          const listedSousMatiere = disciplines.reduce((acc, discipline) => {
            if (!discipline.sousMatiere) {

              acc[discipline.codeMatiere] = {
                matierePrincipale: discipline.discipline,
                sousMatieres: [],
              };
            } else {

              if (acc[discipline.codeMatiere]) {
                acc[discipline.codeMatiere].sousMatieres.push(discipline.discipline);
              }
            }
          
            return acc;
          }, {});
          setSousMatiere(listedSousMatiere);
          ////////////////////////////////////////////////

          setCoefficients(coefficients);
          setGrades(gradesData.notes);
          setUser(authAdmin);
          return;
        }
      }

      setTempToken(token);

      const questions = await getQCM(token);
      setQcmQuestions([questions]);
      setShowQcm(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Une erreur inattendue est survenue';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleQcmSubmit = async (answers: Record<number, number>) => {
    setLoading(true);
    setError(null);

    try {
      const { cn, cv } = await validateQcm(tempToken, answers[1], qcmQuestions);
      const { token, account } = await FinalLogin(
        tempToken,
        usernameStr,
        passStr,
        cn,
        cv
      );
      localStorage.setItem('cn', cn);
      localStorage.setItem('cv', cv);
      localStorage.setItem('token', token);

      const authUser: AuthUser = {
        ...account,
        token,
      };

      setUser(authUser);
      setShowQcm(false);

      GetDocs(token);

      const gradesData = await getGrades(token, account.id);
      const periodeActuelle = gradesData.periodes.find(
        (periode) => periode.codePeriode === 'A001'
      );

      if (periodeActuelle && periodeActuelle.ensembleMatieres?.disciplines) {
        const disciplines = periodeActuelle.ensembleMatieres.disciplines;

        const coefficients = disciplines.reduce((acc, discipline) => {
          acc[discipline.codeMatiere] = discipline.coef;
          return acc;
        }, {});
        ///////////////////////////////////////////////
        const listedSousMatiere = disciplines.reduce((acc, discipline) => {
          if (!discipline.sousMatiere) {

            acc[discipline.codeMatiere] = {
              matierePrincipale: discipline.discipline,
              sousMatieres: [],
            };
          } else {

            if (acc[discipline.codeMatiere]) {
              acc[discipline.codeMatiere].sousMatieres.push(discipline.discipline);
            }
          }
        
          return acc;
        }, {});
        setSousMatiere(listedSousMatiere);
        ////////////////////////////////////////////////

        setCoefficients(coefficients);
        setGrades(gradesData.notes);
      } else {
        console.warn('Période ou disciplines introuvables dans les données.');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Une erreur inattendue est survenue';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setGrades([]);
    setError(null);
    setShowQcm(false);
    setQcmQuestions([]);
    setTempToken('');
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-200 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          <InfoMessage info={infos} />
          <WarningMessage warning={warning}></WarningMessage>

          {user ? (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Tableau de bord
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm md:text-base lg:text-base hidden md:block">
                  {getRandomPhrase()}
                </p>
                <UserMenu
                  user={user}
                  onLogout={handleLogout}
                />
              </div>

              <GradesTable grades={grades} coeficients={coefficients} goodSousMatiere={goodSousMatiere} />
            </div>
          ) : showQcm ? (
            <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4">
              <QcmForm
                questions={qcmQuestions}
                onSubmit={handleQcmSubmit}
                loading={loading}
                error={error}
              />
            </div>
          ) : (
            <div className="flex justify-center items-center min-h-[80vh]">
              <LoginForm onLogin={handleLogin} loading={loading} />
            </div>
          )}

        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
