import React, { useState } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { decodeBase64 } from '../utils/base64';

export interface Question {
  id: number;
  title: string;
  options: string[];
}

interface QcmFormProps {
  questions: Question[];
  onSubmit: (answers: Record<number, number>) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function QcmForm({
  questions = [],
  onSubmit,
  loading,
  error,
}: QcmFormProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(answers);
  };

  const handleAnswerChange = (questionId: number, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const decodedQuestion =
    questions.length > 0
      ? {
          ...questions[0],
          title: decodeBase64(questions[0].title),
          options: (questions[0].options || []).map(decodeBase64),
        }
      : null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-colors">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Double Authentification
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Pour sécuriser votre compte, veuillez répondre à la question suivante
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {decodedQuestion ? (
          <div
            key={decodedQuestion.id}
            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-4"
          >
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {decodedQuestion.title}
            </h3>

            <div className="max-h-72 overflow-y-auto space-y-3">
              {decodedQuestion.options.map((option, index) => (
                <label
                  key={index}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                    answers[decodedQuestion.id] === index
                      ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${decodedQuestion.id}`}
                    value={index}
                    checked={answers[decodedQuestion.id] === index}
                    onChange={() =>
                      handleAnswerChange(decodedQuestion.id, index)
                    }
                    className="h-4 w-4 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 dark:focus:ring-indigo-400 border-gray-300 dark:border-gray-600"
                    disabled={loading}
                  />
                  <span className="ml-3 text-gray-700 dark:text-gray-200">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-300">
            Aucune question disponible.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Vérification en cours...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5" />
              Valider ma réponse
            </>
          )}
        </button>
      </form>
    </div>
  );
}