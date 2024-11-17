import React, { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { QcmForm } from './components/QcmForm';
import { GradesTable } from './components/GradesTable';
import { ThemeProvider } from './context/ThemeContext';
import { UserMenu } from './components/UserMenu';
import { PatchNotes } from './components/PatchNotes';
import {
  login,
  validateQcm,
  getGrades,
  getQCM,
  FinalLogin,
} from './services/api';
import type { User, Grade, Discipline } from './types/auth';
import { Question } from './components/QcmForm';

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
  const [showPatchNotes, setShowPatchNotes] = useState(false);

  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [coefficients, setCoefficients] = useState<{ [key: string]: number }>({});

  window.onload = async function TryToLog() {
    try {
      if (
        localStorage.getItem('token') !== null &&
        localStorage.getItem('username') !== null &&
        localStorage.getItem('password') !== null &&
        localStorage.getItem('cn') !== null &&
        localStorage.getItem('cv') !== null
      ) {
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

        const gradesData = await getGrades(token, account.id);
        const periodeActuelle = gradesData.periodes.find(
          (periode) => periode.codePeriode === 'A001' 
        );

        if (periodeActuelle && periodeActuelle.ensembleMatieres?.disciplines) {
          const disciplines = periodeActuelle.ensembleMatieres.disciplines;


          const coefficients = disciplines.reduce((acc, discipline) => {
            acc[discipline.discipline] = discipline.coef;
            return acc;
          }, {});

          setCoefficients(coefficients);
          setDisciplines(disciplines); 
          console.log('Coefficients par matière :', coefficients);

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

    try {
      console.warn('logged for the first time');

      const token = await login(username, password);
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

      const gradesData = await getGrades(token, account.id);
      const periodeActuelle = gradesData.periodes.find(
        (periode) => periode.codePeriode === 'A001' 
      );

      if (periodeActuelle && periodeActuelle.ensembleMatieres?.disciplines) {
        const disciplines = periodeActuelle.ensembleMatieres.disciplines;

       
        const coefficients = disciplines.reduce((acc, discipline) => {
          acc[discipline.discipline] = discipline.coef;
          return acc;
        }, {});

        setCoefficients(coefficients); 
        setDisciplines(disciplines); 
        console.log('Coefficients par matière :', coefficients);

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

          {user ? (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Tableau de bord
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Consultez vos moyennes en temps réel
                  </p>
                </div>
                <UserMenu
                  user={user}
                  onLogout={handleLogout}
                  onShowPatchNotes={() => setShowPatchNotes(true)}
                />
              </div>

              <GradesTable grades={grades} coeficients={coefficients} />
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

          {showPatchNotes && <PatchNotes onClose={() => setShowPatchNotes(false)} />}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
