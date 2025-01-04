import React from "react";

interface NotesInfosProps {
  grades: { matiere: string; average: string }[];
}

export function NotesInfos({ grades }: NotesInfosProps) {
  const topThreeSubjects = [...grades]
    .sort((a, b) => parseFloat(b.average) - parseFloat(a.average))
    .slice(0, 3);
  const worstThreeSubjects = [...grades]
    .sort((a, b) => parseFloat(a.average) - parseFloat(b.average))
    .slice(0, 3);

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {/* Best Subjects */}
      <div className="bg-green-100 dark:bg-green-900 shadow-sm rounded-lg p-4 flex-1 md:max-w-[48%] text-center">
        <h2 className="text-xl font-bold text-green-800 dark:text-green-400">
          Vos Points Forts
        </h2>
        <ul className="mt-2 space-y-2">
          {topThreeSubjects.map((subject, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-green-200 dark:bg-green-800 rounded p-2"
            >
              <span className="text-green-900 dark:text-green-200 font-medium text-center flex-1">
                {subject.matiere}
              </span>
              <span className="text-green-700 dark:text-green-300 font-semibold text-center flex-1">
                {subject.average}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Worst Subjects */}
      <div className="bg-red-100 dark:bg-red-900 shadow-sm rounded-lg p-4 flex-1 md:max-w-[48%] text-center">
        <h2 className="text-xl font-bold text-red-800 dark:text-red-400">
            Vos Points Faibles
        </h2>
        <ul className="mt-2 space-y-2">
          {worstThreeSubjects.map((subject, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-red-200 dark:bg-red-800 rounded p-2"
            >
              <span className="text-red-900 dark:text-red-200 font-medium text-center flex-1">
                {subject.matiere}
              </span>
              <span className="text-red-700 dark:text-red-300 font-semibold text-center flex-1">
                {subject.average}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
