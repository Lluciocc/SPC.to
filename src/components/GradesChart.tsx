import React, { useMemo } from 'react';
import type { Grade } from '../types/auth';

interface GradesChartProps {
  grades: Grade[];
}

interface ChartData {
  month: string;
  average: number;
}

export function GradesChart({ grades }: GradesChartProps) {
  const chartData = useMemo(() => {
    const monthlyGrades: { [key: string]: number[] } = {};
    
    grades.forEach(subject => {
      subject.notes.forEach(note => {
        const date = new Date(note.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyGrades[monthKey]) {
          monthlyGrades[monthKey] = [];
        }
        
        monthlyGrades[monthKey].push(note.valeur);
      });
    });

    return Object.entries(monthlyGrades)
      .map(([month, notes]) => ({
        month,
        average: notes.reduce((a, b) => a + b, 0) / notes.length
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [grades]);

  const maxAverage = Math.max(...chartData.map(d => d.average));
  const minAverage = Math.min(...chartData.map(d => d.average));

  const formatMonth = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="w-full h-[400px] relative">
      <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400">
        {[...Array(6)].map((_, i) => {
          const value = maxAverage - (i * (maxAverage - minAverage) / 5);
          return (
            <div key={i} className="text-right pr-2">
              {value.toFixed(1)}
            </div>
          );
        })}
      </div>
      
      <div className="ml-12 h-full flex items-end">
        <div className="flex-1 h-full flex items-end">
          {chartData.map((data, index) => {
            const height = ((data.average - minAverage) / (maxAverage - minAverage)) * 100;
            const prevHeight = index > 0 
              ? ((chartData[index - 1].average - minAverage) / (maxAverage - minAverage)) * 100 
              : height;

            return (
              <div
                key={data.month}
                className="flex-1 flex flex-col items-center group relative"
              >
                {index > 0 && (
                  <div
                    className="absolute bottom-0 w-full h-full"
                    style={{
                      clipPath: `polygon(
                        0% ${100 - prevHeight}%,
                        100% ${100 - height}%,
                        100% 100%,
                        0% 100%
                      )`
                    }}
                  >
                    <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900/20"></div>
                  </div>
                )}
                
                <div className="relative w-full">
                  <div
                    className="absolute bottom-0 w-2 rounded-t-full left-1/2 -translate-x-1/2 bg-indigo-600 dark:bg-indigo-500 transition-all group-hover:bg-indigo-700 dark:group-hover:bg-indigo-400"
                    style={{ height: `${height}%` }}
                  ></div>
                </div>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 transform -rotate-45 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap origin-left translate-y-6">
                  {formatMonth(data.month)}
                </div>

                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white px-2 py-1 rounded text-xs whitespace-nowrap transition-opacity">
                  Moyenne: {data.average.toFixed(2)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}