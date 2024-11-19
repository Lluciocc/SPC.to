import React, { useState, useMemo } from 'react';
import { Calculator, ChevronDown } from 'lucide-react';
import type { Grade } from '../types/auth';
import { GradesChart } from './GradesChart';

interface GradesTableProps {
  grades: Grade[];
  coeficients: { [matiere: string]: number }; // clé : nom de la matière, valeur : coefficient
}

const parseGrade = (value: string): number => parseFloat(value.replace(',', '.'));

export function GradesTable({ grades, coeficients }: GradesTableProps) {
  const [selectedTrimester, setSelectedTrimester] = useState<number>(1);
  const [showChart, setShowChart] = useState<boolean>(false);

  const subjectGrades = useMemo(() => {
    const gradesBySubject: { [key: string]: Grade[] } = {};
    grades.forEach((grade) => {
      const subjectKey = grade.libelleMatiere + (grade.codeSousMatiere ? ` (${grade.codeSousMatiere})` : '');
      if (!gradesBySubject[subjectKey]) {
        gradesBySubject[subjectKey] = [];
      }
      gradesBySubject[subjectKey].push(grade);
    });

    return Object.entries(gradesBySubject).map(([matiere, notes]) => ({
      matiere,
      notes: notes.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    }));
  }, [grades]);

  const calculateAverage = (notes: Grade[], trimester: number) => {
    const trimesterNotes = notes.filter((note) => {
      if (note.nonSignificatif note.nonSignificatif || note.valeur.trim().toLowerCase() === 'abs') return false;
      const noteDate = new Date(note.date);
      const month = noteDate.getMonth() + 1;
      switch (trimester) {
        case 1:
          return month >= 9 && month <= 11; // Sept-Nov
        case 2:
          return month >= 12 || month <= 2; // Dec-Feb
        case 3:
          return month >= 3 && month <= 6; // Mar-Jun
        default:
          return true;
      }
    });

    if (trimesterNotes.length === 0) return 'N/A';

    let totalWeightedGrade = 0;
    let totalWeight = 0;

    trimesterNotes.forEach((note) => {
      const value = parseGrade(note.valeur);
      const maxGrade = parseGrade(note.noteSur);
      const coef = parseFloat(note.coef);

      const normalizedGrade = (value / maxGrade) * 20;

      totalWeightedGrade += normalizedGrade * coef;
      totalWeight += coef;
    });

    return totalWeight === 0 ? 'N/A' : (totalWeightedGrade / totalWeight).toFixed(2);
  };

  const calculateGeneralAverage = () => {
    let totalWeightedGrade = 0;
    let totalWeight = 0;

    const groupedSubjects: { [key: string]: { totalGrade: number; totalCoef: number } } = {};

    subjectGrades.forEach((subject) => {
      const [mainSubject] = subject.matiere.split(' ('); // Extract main subject
      const coef = coeficients[mainSubject];
      if (!coef) return;

      const average = calculateAverage(subject.notes, selectedTrimester);
      if (average === 'N/A') return;

      const numericAverage = parseFloat(average);

      // Handle grouped subjects (like ENSEIGN.SCIENTIFIQUE)
      if (groupedSubjects[mainSubject]) {
        groupedSubjects[mainSubject].totalGrade += numericAverage * coef;
        groupedSubjects[mainSubject].totalCoef += coef;
      } else {
        groupedSubjects[mainSubject] = { totalGrade: numericAverage * coef, totalCoef: coef };
      }
    });

    // Aggregate grouped subject averages
    Object.values(groupedSubjects).forEach(({ totalGrade, totalCoef }) => {
      totalWeightedGrade += totalGrade;
      totalWeight += totalCoef;
    });

    return totalWeight === 0 ? 'N/A' : (totalWeightedGrade / totalWeight).toFixed(2);
  };

  const generalAverage = useMemo(calculateGeneralAverage, [subjectGrades, coeficients, selectedTrimester]);

  const getGradeColor = (average: string | number) => {
    if (average === 'N/A') return 'text-gray-500 dark:text-gray-400';
    const numericAverage = typeof average === 'string' ? parseFloat(average) : average;
    if (numericAverage >= 16) return 'text-green-600 dark:text-green-400';
    if (numericAverage >= 14) return 'text-emerald-600 dark:text-emerald-400';
    if (numericAverage >= 12) return 'text-blue-600 dark:text-blue-400';
    if (numericAverage >= 10) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-colors">
        <div className="px-6 py-4 bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-between">
          <div className="flex items-center">
            <Calculator className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-semibold">Moyennes par matière</h2>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={selectedTrimester}
              onChange={(e) => setSelectedTrimester(Number(e.target.value))}
              className="bg-white/10 rounded-lg px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option value={1}>1er Trimestre</option>
              <option value={2}>2ème Trimestre</option>
              <option value={3}>3ème Trimestre</option>
            </select>
            <button
              onClick={() => setShowChart(!showChart)}
              className="flex items-center gap-1 bg-white/10 rounded-lg px-3 py-1 text-sm font-medium hover:bg-white/20 transition-colors"
            >
              {showChart ? 'Voir tableau' : 'Voir graphique'}
              <ChevronDown className={`h-4 w-4 transition-transform ${showChart ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
        {!showChart ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Matière
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Nombre de notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Moyenne
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {subjectGrades.map((subject, index) => {
                  const average = calculateAverage(subject.notes, selectedTrimester);
                  const gradeColor = getGradeColor(average);

                  return (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {subject.matiere}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {subject.notes.filter((n) => !n.nonSignificatif).length}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${gradeColor}`}>
                        {average}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-6 py-4 text-right">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Moyenne Générale : </span>
              <span className={`text-lg font-bold ${getGradeColor(generalAverage)}`}>
                {generalAverage}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <GradesChart grades={grades} />
          </div>
        )}
      </div>
    </div>
  );
}
