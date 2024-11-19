export interface LoginCredentials {
  identifiant: string;
  motdepasse: string;
}

export interface User {
  id: number;
  nom: string;
  prenom: string;
  classe: string;
  email: string;
}

export interface LoginResponse {
  code: number;
  token: string;
  message?: string;
  data: {
    accounts: Array<
      User & {
        typeCompte: string;
      }
    >;
    qcm?: {
      id: string;
      questions: Array<{
        id: number;
        title: string;
        options: string[];
      }>;
    };
  };
}

export interface QcmResponse {
  code: number;
  token: string;
  message?: string;
}

export interface Discipline {
  id: number;
  codeMatiere: string;
  codeSousMatiere: string;
  discipline: string;
  coef: number;
  effectif: number;
  rang: number;
  groupeMatiere: boolean;
  idGroupeMatiere: number;
  option: number;
  sousMatiere: boolean;
  saisieAppreciationSSMat: boolean;
}


export interface Grade {
  id: number;
  devoir: string;
  codePeriode: string;
  codeMatiere: string;
  libelleMatiere: string;
  codeSousMatiere: string;
  typeDevoir: string;
  enLettre: boolean;
  commentaire: string;
  uncSujet: string;
  uncCorrige: string;
  date: string;
  dateSaisie: string;
  coef: string;
  noteSur: string;
  valeur: string;
  valeurisee: boolean;
  nonSignificatif: boolean;
  maxClasse: string;
  elementsProgramme: any[];
  qcm?: {
    idQCM: number;
    idAssociation: number;
    titre: string;
    debute: string;
  };
}

export interface GradesResponse {
  code: number;
  token: string;
  data: {
    notes: Grade[];
  };
}

export interface FLog {
  code: number;
  message?: string;
  data: {
    accounts: Array<{
      typeCompte: string;
      id: number;
      nom: string;
      prenom: string;
      profile: Array<{
        sexe: string;
        nomEtablissement: string;
        classe: Array<{
          libelle: string;
          code: string;
        }>;
      }>;
    }>;
  };
  token: string;
}