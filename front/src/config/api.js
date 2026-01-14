export const API_BASE_URL = 'http://localhost:8080/api';
export const ROLES = {
  ADMINISTRATEUR: 'ADMINISTRATEUR',
  AGENT_ACCUEIL: 'AGENT_ACCUEIL',
  MEDECIN: 'MEDECIN',
  INFIRMIER: 'INFIRMIER',
  COMPTABLE: 'COMPTABLE',
  DIRECTEUR: 'DIRECTEUR',
  PATIENT: 'PATIENT'
};
export const ROLE_ROUTES = {
  [ROLES.ADMINISTRATEUR]: '/admin/tableau-de-bord',
  [ROLES.AGENT_ACCUEIL]: '/accueil/tableau-de-bord',
  [ROLES.MEDECIN]: '/medecin/tableau-de-bord',
  [ROLES.INFIRMIER]: '/infirmier/tableau-de-bord',
  [ROLES.COMPTABLE]: '/comptabilite/tableau-de-bord',
  [ROLES.DIRECTEUR]: '/directeur/tableau-de-bord',
  [ROLES.PATIENT]: '/patient/tableau-de-bord'
};
