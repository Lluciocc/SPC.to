import React, { useMemo } from 'react';
import { Grade } from '../../types/auth';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface GradesChartProps {
  grades: Grade[];
  coefficients: { [matiere: string]: number }; // Coefficients par matière
}

const parseGrade = (value: string): number => parseFloat(value.replace(',', '.'));

const calculateGeneralAverage = (grades: Grade[], coefficients: { [matiere: string]: number }) => {
  const gradesBySubject: { [key: string]: Grade[] } = {};

  grades.forEach((grade) => {
    const subjectKey = grade.libelleMatiere + (grade.codeSousMatiere ? ` (${grade.codeSousMatiere})` : '');
    if (!gradesBySubject[subjectKey]) {
      gradesBySubject[subjectKey] = [];
    }
    gradesBySubject[subjectKey].push(grade);
  });

  let totalWeightedGrade = 0;
  let totalWeight = 0;

  const groupedSubjects: { [key: string]: { totalGrade: number; totalCoef: number } } = {};

  Object.entries(gradesBySubject).forEach(([matiere, notes]) => {
    const [mainSubject] = matiere.split(' ('); // Extraire la matière principale
    const coef = coefficients[mainSubject];
    if (!coef) return;

    let subjectTotalWeighted = 0;
    let subjectTotalWeight = 0;

    notes.forEach((note) => {
      if (note.nonSignificatif || note.valeur.trim().toLowerCase() === 'abs') return;

      const value = parseGrade(note.valeur);
      const maxGrade = parseGrade(note.noteSur);
      const noteCoef = parseFloat(note.coef);

      if (!isNaN(value) && !isNaN(maxGrade) && !isNaN(noteCoef)) {
        const normalizedGrade = (value / maxGrade) * 20;
        subjectTotalWeighted += normalizedGrade * noteCoef;
        subjectTotalWeight += noteCoef;
      }
    });

    if (subjectTotalWeight === 0) return;

    const subjectAverage = subjectTotalWeighted / subjectTotalWeight;

    if (groupedSubjects[mainSubject]) {
      groupedSubjects[mainSubject].totalGrade += subjectAverage * coef;
      groupedSubjects[mainSubject].totalCoef += coef;
    } else {
      groupedSubjects[mainSubject] = { totalGrade: subjectAverage * coef, totalCoef: coef };
    }
  });

  Object.values(groupedSubjects).forEach(({ totalGrade, totalCoef }) => {
    totalWeightedGrade += totalGrade;
    totalWeight += totalCoef;
  });

  return totalWeight === 0 ? null : (totalWeightedGrade / totalWeight).toFixed(2);
};

const calculateMonthlyAverages = (
  grades: Grade[],
  coefficients: { [matiere: string]: number }
) => {
  const monthlyPeriods: { [key: string]: { totalWeighted: number; totalCoef: number } } = {};

  grades.forEach((grade) => {
    const date = new Date(grade.date);
    if (!grade.valeur || isNaN(date.getTime())) return;

    const day = date.getDate();
    const period = day <= 15 ? 'Début' : 'Milieu'; // Début ou milieu du mois
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')} (${period})`;

    const subjectKey = grade.libelleMatiere + (grade.codeSousMatiere ? ` (${grade.codeSousMatiere})` : '');
    const [mainSubject] = subjectKey.split(' ('); // Extraire la matière principale
    const coef = coefficients[mainSubject];
    if (!coef) return;

    const value = parseGrade(grade.valeur);
    const maxGrade = parseGrade(grade.noteSur);
    const noteCoef = parseFloat(grade.coef);

    if (!isNaN(value) && !isNaN(maxGrade) && !isNaN(noteCoef)) {
      const normalizedGrade = (value / maxGrade) * 20;

      if (!monthlyPeriods[monthKey]) {
        monthlyPeriods[monthKey] = { totalWeighted: 0, totalCoef: 0 };
      }

      monthlyPeriods[monthKey].totalWeighted += normalizedGrade * noteCoef * coef;
      monthlyPeriods[monthKey].totalCoef += noteCoef * coef;
    }
  });

  return Object.entries(monthlyPeriods)
    .map(([period, { totalWeighted, totalCoef }]) => ({
      period,
      average: totalCoef > 0 ? (totalWeighted / totalCoef).toFixed(2) : null,
    }))
    .filter((data) => data.average !== null)
    .sort((a, b) => a.period.localeCompare(b.period));
};

export function GradesChart({ grades, coefficients }: GradesChartProps) {
  const chartData = useMemo(() => {
    if (!grades || grades.length === 0) return { points: [], currentAverage: null };

    const monthlyAverages = calculateMonthlyAverages(grades, coefficients);
    const currentAverage = calculateGeneralAverage(grades, coefficients);

    // Ajouter la moyenne actuelle
    const today = new Date();
    monthlyAverages.push({
      period: `Aujourd'hui`,
      average: currentAverage ? parseFloat(currentAverage) : null,
    });

    return { points: monthlyAverages, currentAverage };
  }, [grades, coefficients]);

  // Configuration du graphique
  const data = {
    labels: chartData.points.map((point) => point.period),
    datasets: [
      {
        label: 'Moyenne mensuelle',
        data: chartData.points.map((point) => point.average),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        borderWidth: 2,
        cubicInterpolationMode: 'monotone',
        pointRadius: 5, // Points visibles dès le début
        pointBackgroundColor: 'rgb(75, 192, 192)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Moyennes mensuelles',
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.raw} / 20`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 20,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold dark:text-white mb-4">Graphique des Moyennes Générales</h1>
      <div className="w-full h-64 sm:h-96">
        <Line data={data} options={options} />
      </div>
      {chartData.currentAverage && (
        <div className="text-right mt-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Moyenne actuelle : </span>
          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            {chartData.currentAverage}
          </span>
        </div>
      )}
    </div>
  );
}
