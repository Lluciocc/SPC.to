import React, { useEffect, useMemo, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js'; // Importer PointElement
import type { Grade } from '../types/auth';

// Enregistrement des composants de Chart.js, y compris PointElement
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

interface GradesChartProps {
  grades: Grade[];
}

interface ChartData {
  month: string;
  average: number;
}

export function GradesChart({ grades }: GradesChartProps) {
  const chartRef = useRef<ChartJS | null>(null); // Référence au graphique Chart.js

  const chartData = useMemo(() => {
    if (!grades || grades.length === 0) {
      console.warn('No grades data available');
      return [];
    }

    const monthlyGrades: { [key: string]: number[] } = {};

    grades.forEach((grade) => {
      if (!grade.valeur) {
        console.warn('Grade without value:', grade);
        return; // Si la note ne contient pas de valeur, on l'ignore
      }

      const date = new Date(grade.date); // Date de la note
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', grade.date);
        return; // Si la date est invalide, on l'ignore
      }

      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyGrades[monthKey]) {
        monthlyGrades[monthKey] = [];
      }

      // Ajout de la note à la liste des notes pour le mois
      const noteValue = parseFloat(grade.valeur);
      monthlyGrades[monthKey].push(noteValue);

    });


    return Object.entries(monthlyGrades)
      .map(([month, notes]) => ({
        month,
        average: notes.reduce((a, b) => a + b, 0) / notes.length,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [grades]);

  console.log('Chart Data:', chartData); // Log pour vérifier chartData final

  if (!chartData.length) {
    return <div>No data available</div>;
  }

  const labels = chartData.map((data) => data.month);
  const averages = chartData.map((data) => data.average);

  // Données pour le graphique avec Chart.js
  const data = {
    type: 'line',
    labels: labels, // Mois
    datasets: [
      {
        label: 'Moyenne des notes', // Pour la courbe
        data: averages,
        fill: false,
        borderColor: 'rgb(75, 192, 192)', // Couleur de la courbe
        tension: 0.1, // Courbe lisse
        borderWidth: 2,
        pointRadius: 5, // Taille des points sur la courbe
      },
      {
        label: 'Moyenne mensuelle', // Pour les barres
        data: averages,
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Couleur des barres
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
        categoryPercentage: 0.5,
        barPercentage: 0.5,
      },
    ],
  };

  // Options pour personnaliser le graphique
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.dataset.label}: ${context.raw.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      y: {
        min: Math.min(...averages) - 1, // Plage de l'axe Y
        max: Math.max(...averages) + 1,
        beginAtZero: false, // L'axe Y commence à la valeur la plus basse
      },
    },
  };

  useEffect(() => {
    if (chartRef.current) {
      // Détruire le graphique précédent si nécessaire
      chartRef.current.destroy();
    }
  }, [chartData]);

  return (
    <div>
    <h1 className="text-xl font-semibold dark:text-white">Graphique des Notes</h1>
    <div style={{ width: '100%', height: '400px' }}>
      <Line data={data} options={options} />
    </div>
  </div>
  );
}
