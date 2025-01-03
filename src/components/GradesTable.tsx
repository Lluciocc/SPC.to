
import React, { useState, useMemo, useEffect } from "react";
import { Calculator, ChevronDown } from "lucide-react";
import type { Grade } from "../types/auth";
import { GradesChart } from "./GradesChart";
import { NotesPopup } from "./NotePopup";
import { NotesInfos } from './NotesInfos';

// Helper functions
const parseGrade = (value: string): number =>
  parseFloat(value.replace(",", "."));

const safeParseFloat = (value: any) => {
  const parsedValue = parseFloat(value?.replace(",", "."));
  return isNaN(parsedValue) ? "N/A" : parsedValue;
};

const calcAverage = (grades: Grade[], scale: number = 20) => {
  let totalWeighted = 0;
  let totalCoef = 0;

  grades.forEach((grade) => {
    if (
      grade.nonSignificatif ||
      ["Abs", "Disp", "NE", "EA"].includes(grade.valeur)
    )
      return;

    const value = parseGrade(grade.valeur);
    const maxGrade = parseGrade(grade.noteSur);
    const coef = parseFloat(grade.coef);

    if (!isNaN(value) && !isNaN(maxGrade) && !isNaN(coef)) {
      totalWeighted += (value / maxGrade) * scale * coef;
      totalCoef += coef;
    }
  });

  return totalCoef === 0 ? "N/A" : (totalWeighted / totalCoef).toFixed(2);
};

const calcGeneralAverage = (
  subjects: { matiere: string; codeMatiere: string; notes: Grade[] }[],
  coefficients: { [codeMatiere: string]: number },
  scale: number = 20
) => {
  let totalWeighted = 0;
  let totalCoef = 0;

  subjects.forEach((subject) => {
    const coef = coefficients[subject.codeMatiere] || 0; // Utiliser codeMatiere ici
    const average = calcAverage(subject.notes, scale);

    if (average !== "N/A") {
      totalWeighted += parseFloat(average) * coef;
      totalCoef += coef;
    }

  });

  return totalCoef === 0 ? "N/A" : (totalWeighted / totalCoef).toFixed(2);
};

const getGradeColor = (average: string | number) => {
  if (average === "N/A") return "text-gray-500 dark:text-gray-400";
  const numericAverage =
    typeof average === "string" ? parseFloat(average) : average;
  if (numericAverage >= 16) return "text-green-600 dark:text-green-400";
  if (numericAverage >= 14) return "text-emerald-600 dark:text-emerald-400";
  if (numericAverage >= 12) return "text-blue-600 dark:text-blue-400";
  if (numericAverage >= 10) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
};

export function GradesTable({ grades, coeficients }: GradesTableProps) {
  const [selectedTrimester, setSelectedTrimester] = useState<string>("A001");
  const [showChart, setShowChart] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [showNotePopup, setShowNotePopup] = useState(false);

  const subjectGrades = useMemo(() => {
    const gradesBySubject: { [key: string]: { matiere: string; notes: Grade[]; codeMatiere: string; prof: string } } = {};

    grades.forEach((grade) => {
      const subjectKey = `${grade.libelleMatiere}${
        grade.codeSousMatiere ? ` (${grade.codeSousMatiere})` : ""
      }`;

      if (!gradesBySubject[subjectKey]) {
        gradesBySubject[subjectKey] = {
          matiere: grade.libelleMatiere,
          prof: grade.professeur || "Inconnu",
          codeMatiere: grade.codeMatiere,
          notes: [],
        };
      }

      gradesBySubject[subjectKey].notes.push(grade);
    });

    return Object.values(gradesBySubject).map((subject) => ({
      ...subject,
      notes: subject.notes.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    }));
  }, [grades]);

  const filteredGrades = (notes: Grade[]) =>
    notes.filter((note) => {
      if (
        note.nonSignificatif ||
        ["Abs", "Disp", "NE", "EA"].includes(note.valeur)
      )
        return false;

      const noteDate = new Date(note.date);
      const month = noteDate.getMonth() + 1;

      switch (selectedTrimester) {
        case "A001":
          return month >= 9 && month <= 11; // Sept-Nov
        case "A002":
          return month >= 12 || month <= 2; // Dec-Feb
        case "A003":
          return month >= 3 && month <= 6; // Mar-Jun
        default:
          return true;
      }
    });

    const infos: { codeMatiere: string; matiere: string; average: string | number }[] = useMemo(() => {
      return subjectGrades.map((subject) => {
        const average = calcAverage(filteredGrades(subject.notes), 20);
        return {
          codeMatiere: subject.codeMatiere,
          matiere: subject.matiere,
          average,
        };
      });
    }, [subjectGrades, selectedTrimester]);
  
  const generalAverage = useMemo(
    () =>
      calcGeneralAverage(
        subjectGrades.map((subject) => ({
          matiere: subject.matiere,
          codeMatiere: subject.codeMatiere,
          notes: filteredGrades(subject.notes),
        })),
        coeficients
      ),
    [subjectGrades, coeficients, selectedTrimester]
  );

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-colors">
        {/* Header */}
        <div className="px-6 py-4 bg-indigo-600 dark:bg-indigo-500 text-white flex items-center justify-between flex-wrap">
          <div className="flex items-center">
            <Calculator className="h-6 w-6 mr-2" />
            <h2 className="text-xl font-semibold">Moyennes par matière</h2>
          </div>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <select
              value={selectedTrimester}
              onChange={(e) => setSelectedTrimester(e.target.value)}
              className="bg-white/10 rounded-lg px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              <option value={"A001"}>1er Trimestre</option>
              <option value={"A002"}>2ème Trimestre</option>
              <option value={"A003"}>3ème Trimestre</option>
            </select>
            <button
              onClick={() => setShowChart(!showChart)}
              className="flex items-center gap-1 bg-white/10 rounded-lg px-3 py-1 text-sm font-medium hover:bg-white/20 transition-colors"
            >
              {showChart ? "Voir tableau" : "Voir graphique"}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  showChart ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Content */}
        {!showChart ? (
          <div className="overflow-x-auto sm:overflow-x-visible">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-auto w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Matière
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Nombre de notes
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Moyenne
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {subjectGrades.map((subject, index) => {
                  const average = calcAverage(
                    filteredGrades(subject.notes),
                    20
                  );
                  const gradeColor = getGradeColor(average);

                  return (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => {setSelectedSubject(subject), setShowNotePopup(true)}}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {subject.matiere}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {subject.notes.length}
                      </td>
                      <td
                        className={`px-4 py-4 whitespace-nowrap text-sm font-semibold ${gradeColor}`}
                      >
                        {average}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-6 py-4 text-right">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Moyenne Générale :{" "}
              </span>
              <span className={`text-lg font-bold ${getGradeColor(generalAverage)}`}>
                {generalAverage}
              </span>
            </div>
            <NotesInfos grades={infos}/>
            <br></br>
          </div>
        ) : (
          <div className="p-6">
            <GradesChart grades={grades} coefficients={coeficients} />
          </div>
        )}
      </div>

      {/* Popup */}
      {showNotePopup && <NotesPopup period={selectedTrimester} selectedSubject={selectedSubject} onClose={() => setShowNotePopup(false)}></NotesPopup>}
    </div>
  );
}
