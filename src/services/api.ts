import { useState } from 'react';
import { LoginResponse, FLog } from '../types/auth';
import { Question } from '../components/QcmForm';

const API_URL = 'https://api.ecoledirecte.com/v3';
const API_VERSION = '4.62.1';

export interface QCMResponse {
  code: number;
  token: string;
  message?: string;
  data: {
    question: string;
    propositions: [];
  };
}

export interface Validate {
  code: number;
  message?: string;
  data: {
    cn: string;
    cv: string;
  };
}

class EcoleDirecteError extends Error {
  constructor(message: string, public code?: number, public details?: string) {
    super(message);
    this.name = 'EcoleDirecteError';
  }
}

async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new EcoleDirecteError(
      `Erreur réseau: ${response.status} ${response.statusText}`,
      response.status
    );
  }

  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    throw new EcoleDirecteError('Réponse invalide du serveur');
  }

  try {
    const data = await response.json();

    if (data.code === 505 || data.code === 525) {
      throw new EcoleDirecteError('Identifiant ou mot de passe incorrect');
    }

    return data as T;
  } catch (error) {
    if (error instanceof EcoleDirecteError) {
      throw error;
    }
    throw new EcoleDirecteError('Erreur lors de la lecture de la réponse');
  }
}

async function makeApiRequest(
  url: string,
  options: RequestInit
): Promise<Response> {
  const defaultHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json, text/plain, */*',
    //'X-Requested-With': 'XMLHttpRequest',
    //'User-Agent': 'Mozilla/5.0',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      mode: 'cors',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
    });
    return response;
  } catch (error) {
    console.error('API Request Error:', error);
    if (
      error instanceof TypeError &&
      error.message.includes('Failed to fetch')
    ) {
      throw new EcoleDirecteError(
        'La connexion au serveur a échoué. Veuillez vérifier votre connexion internet et réessayer.'
      );
    }
    throw error;
  }
}

export async function login(
  username: string,
  password: string
): Promise<string> {
  if (!username || !password) {
    throw new EcoleDirecteError('Identifiant et mot de passe requis');
  }

  try {
    const loginData = {
      identifiant: username.trim(),
      motdepasse: password,
      uuid: "",
      isReLogin: false,
    };

    const response = await makeApiRequest(`${API_URL}/login.awp`, {
      method: 'POST',
      body: `data=${JSON.stringify(loginData)}`,
    });

    const data = await handleApiResponse<LoginResponse>(response);

    if (!data.token) {
      throw new EcoleDirecteError('Identifiant ou mot de passe incorrect');
    }

    return data.token;
  } catch (error) {
    console.error('Login Error:', error);
    if (error instanceof EcoleDirecteError) {
      throw error;
    }
    throw new EcoleDirecteError(
      'Impossible de se connecter au serveur EcoleDirecte. Veuillez réessayer.'
    );
  }
}

export async function getQCM(token: string) {
  try {
    // ne pas toucher c'est un miracle ca marche
    const response = await fetch(
      `${API_URL}/connexion/doubleauth.awp?verbe=get&v=${API_VERSION}`,
      {
        method: 'POST',
        headers: {
          'X-Token': token,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'data={}',
      }
    );

    const dataq = await handleApiResponse<QCMResponse>(response);

    if (dataq && dataq.code === 200 && dataq.data) {
      return {
        id: 1,
        title: dataq.data.question,
        options: dataq.data.propositions,
      };
    }
  } catch (error) {
    console.error('QCM Error:', error);
    if (error instanceof EcoleDirecteError) {
      throw error;
    }
    throw new EcoleDirecteError(
      'Erreur lors de la récupération du QCM. Veuillez réessayer.'
    );
  }
}

export async function validateQcm(
  token: string,
  choix: number,
  qcm: Question[]
) {
  try {
    const choice = qcm[0].options[choix];

    const response = await fetch(
      `${API_URL}/connexion/doubleauth.awp?verbe=post&v=${API_VERSION}`,
      {
        method: 'POST',
        headers: {
          'X-Token': token,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data={"choix": "${choice}"}`,
      }
    );

    const data = await handleApiResponse<Validate>(response);
    if (data.code !== 200) {
      throw new EcoleDirecteError('Réponses incorrectes au QCM', data.code);
    }
    return {
      cn: data.data.cn,
      cv: data.data.cv,
    };
  } catch (error) {
    console.error('QCM Validation Error:', error);
    if (error instanceof EcoleDirecteError) {
      throw error;
    }
    throw new EcoleDirecteError(
      'Erreur lors de la validation du QCM. Veuillez réessayer.'
    );
  }
}

export async function FinalLogin(
  token: string,
  username: string,
  password: string,
  cn: string,
  cv: string
) {
  try {
    const loginData = {
      identifiant: username.trim(),
      motdepasse: password,
      uuid: "",
      isReLogin: false,
      fa: [
        {
          cn: cn,
          cv: cv,
        },
      ],
    };

    const response = await makeApiRequest(`${API_URL}/login.awp`, {
      method: 'POST',
      body: `data=${JSON.stringify(loginData)}`,
    });

    const data = await handleApiResponse<FLog>(response);

    console.clear();
    console.log(data);

    const account = data.data.accounts[0];
    return {
      token: data.token,
      account: {
        id: account.id,
        nom: account.nom,
        prenom: account.prenom,
        classe: account.profile.classe.code,
        email: account.email,
      },
    };
  } catch (error) {
    console.error('Last Login Error:', error);
    if (error instanceof EcoleDirecteError) {
      throw error;
    }
    throw new EcoleDirecteError(
      'Erreur lors de la tentative de connexion finale.'
    );
  }
}

export async function getGrades(token: string, studentId: number) {
  if (!token || !studentId) {
    throw new EcoleDirecteError('Token et ID étudiant requis');
  }

  try {
    const response = await makeApiRequest(
      `${API_URL}/eleves/${studentId}/notes.awp?verbe=get&`,
      {
        method: 'POST',
        headers: {
          'X-Token': token,
        },
        body: 'data={"anneeScolaire": ""}',
      }
    );

    const data = await handleApiResponse<{
      code: number;
      data: {
        notes: Array<{
          matiere: string;
          notes: Array<{
            valeur: number;
            coef: number;
            date: string;
            devoir: string;
          }>;
        }>;
      };
    }>(response);

    if (data.code !== 200) {
      throw new EcoleDirecteError(
        'Erreur lors de la récupération des notes',
        data.code
      );
    }

    return data.data;
  } catch (error) {
    console.error('Grades Error:', error);
    if (error instanceof EcoleDirecteError) {
      throw error;
    }
    throw new EcoleDirecteError(
      'Impossible de récupérer les notes. Veuillez réessayer.'
    );
  }
}
