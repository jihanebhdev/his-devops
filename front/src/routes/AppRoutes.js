import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';
import DashboardLayout from '../components/Layout/DashboardLayout';
import PatientPortalLayout from '../components/Layout/PatientPortalLayout';
import HomeRedirect from '../components/HomeRedirect';
import Login from '../pages/Login';
import LandingPage from '../pages/LandingPage';
import Unauthorized from '../pages/Unauthorized';
import PageEnConstruction from '../pages/PageEnConstruction';
import DashboardAdmin from '../pages/dashboards/DashboardAdmin';
import DashboardAccueil from '../pages/dashboards/DashboardAccueil';
import DashboardMedecin from '../pages/dashboards/DashboardMedecin';
import DashboardInfirmier from '../pages/dashboards/DashboardInfirmier';
import DashboardComptabilite from '../pages/dashboards/DashboardComptabilite';
import DashboardDirecteur from '../pages/dashboards/DashboardDirecteur';
import DashboardPatient from '../pages/dashboards/DashboardPatient';
import ListePatients from '../pages/patients/ListePatients';
import FormulairePatient from '../pages/patients/FormulairePatient';
import DetailsPatient from '../pages/patients/DetailsPatient';
import ListeRendezVous from '../pages/appointments/ListeRendezVous';
import FormulaireRendezVous from '../pages/appointments/FormulaireRendezVous';
import ListeConsultations from '../pages/consultations/ListeConsultations';
import FormulaireConsultation from '../pages/consultations/FormulaireConsultation';
import DetailsConsultation from '../pages/consultations/DetailsConsultation';
import ListeDossiersMedicaux from '../pages/medical-records/ListeDossiersMedicaux';
import FormulaireDossierMedical from '../pages/medical-records/FormulaireDossierMedical';
import DetailsDossierMedical from '../pages/medical-records/DetailsDossierMedical';
import ListeConstantesVitales from '../pages/vital-signs/ListeConstantesVitales';
import FormulaireConstantesVitales from '../pages/vital-signs/FormulaireConstantesVitales';
import ListeHospitalisations from '../pages/hospitalizations/ListeHospitalisations';
import FormulaireHospitalisation from '../pages/hospitalizations/FormulaireHospitalisation';
import DetailsHospitalisation from '../pages/hospitalizations/DetailsHospitalisation';
import ListeLits from '../pages/beds/ListeLits';
import FormulaireLit from '../pages/beds/FormulaireLit';
import ListeFactures from '../pages/bills/ListeFactures';
import FormulaireFacture from '../pages/bills/FormulaireFacture';
import DetailsFacture from '../pages/bills/DetailsFacture';
import ListePaiements from '../pages/payments/ListePaiements';
import FormulairePaiement from '../pages/payments/FormulairePaiement';
import ListeAssurances from '../pages/insurance/ListeAssurances';
import FormulaireAssurance from '../pages/insurance/FormulaireAssurance';
import ListeUtilisateurs from '../pages/admin/ListeUtilisateurs';
import FormulaireUtilisateur from '../pages/admin/FormulaireUtilisateur';
import ListeRoles from '../pages/admin/ListeRoles';
import ListePermissions from '../pages/admin/ListePermissions';
import ProfilPatient from '../pages/patient/ProfilPatient';
import MesRendezVous from '../pages/patient/MesRendezVous';
import MesConsultations from '../pages/patient/MesConsultations';
import MonDossierMedical from '../pages/patient/MonDossierMedical';
import MesConstantesVitales from '../pages/patient/MesConstantesVitales';
import MesHospitalisations from '../pages/patient/MesHospitalisations';
import MesFactures from '../pages/patient/MesFactures';
import MesPaiements from '../pages/patient/MesPaiements';
import MonAssurance from '../pages/patient/MonAssurance';
import ProfilUtilisateur from '../pages/staff/ProfilUtilisateur';
import ListeNotifications from '../pages/admin/ListeNotifications';
const AppRoutes = () => {
  return (
    <Routes>
      {}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route path="/unauthorized" element={<Unauthorized />} />
      {}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <HomeRedirect />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {}
      <Route
        path="/admin/tableau-de-bord"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR']}>
            <DashboardLayout>
              <DashboardAdmin />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/accueil/tableau-de-bord"
        element={
          <ProtectedRoute requiredRoles={['AGENT_ACCUEIL']}>
            <DashboardLayout>
              <DashboardAccueil />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/medecin/tableau-de-bord"
        element={
          <ProtectedRoute requiredRoles={['MEDECIN']}>
            <DashboardLayout>
              <DashboardMedecin />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/infirmier/tableau-de-bord"
        element={
          <ProtectedRoute requiredRoles={['INFIRMIER']}>
            <DashboardLayout>
              <DashboardInfirmier />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/comptabilite/tableau-de-bord"
        element={
          <ProtectedRoute requiredRoles={['COMPTABLE']}>
            <DashboardLayout>
              <DashboardComptabilite />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/directeur/tableau-de-bord"
        element={
          <ProtectedRoute requiredRoles={['DIRECTEUR']}>
            <DashboardLayout>
              <DashboardDirecteur />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/tableau-de-bord"
        element={
          <ProtectedRoute requiredRoles={['PATIENT']}>
            <PatientPortalLayout>
              <DashboardPatient />
            </PatientPortalLayout>
          </ProtectedRoute>
        }
      />
      {}
      <Route
        path="/patients"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN', 'INFIRMIER', 'COMPTABLE', 'DIRECTEUR']}>
            <DashboardLayout>
              <ListePatients />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients/nouveau"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'AGENT_ACCUEIL']}>
            <DashboardLayout>
              <FormulairePatient />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients/:id/modifier"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'AGENT_ACCUEIL']}>
            <DashboardLayout>
              <FormulairePatient />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients/:id"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN', 'INFIRMIER', 'COMPTABLE', 'DIRECTEUR']}>
            <DashboardLayout>
              <DetailsPatient />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {}
      <Route
        path="/rendezvous"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN']}>
            <DashboardLayout>
              <ListeRendezVous />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rendezvous/nouveau"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN']}>
            <DashboardLayout>
              <FormulaireRendezVous />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rendezvous/:id/modifier"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN']}>
            <DashboardLayout>
              <FormulaireRendezVous />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {}
      <Route
        path="/consultations"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'MEDECIN', 'INFIRMIER', 'AGENT_ACCUEIL', 'PATIENT']}>
            <DashboardLayout>
              <ListeConsultations />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/consultations/nouvelle"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'MEDECIN']}>
            <DashboardLayout>
              <FormulaireConsultation />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/consultations/:id/modifier"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'MEDECIN']}>
            <DashboardLayout>
              <FormulaireConsultation />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/consultations/:id"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'MEDECIN', 'INFIRMIER', 'AGENT_ACCUEIL', 'PATIENT']}>
            <DashboardLayout>
              <DetailsConsultation />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {}
      <Route
        path="/dossiers/patient/:patientId/nouveau"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN']}>
            <DashboardLayout>
              <FormulaireDossierMedical />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dossiers/:id/modifier"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN']}>
            <DashboardLayout>
              <FormulaireDossierMedical />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {}
      <Route
        path="/constantes-vitales/nouvelle"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'INFIRMIER', 'MEDECIN']}>
            <DashboardLayout>
              <FormulaireConstantesVitales />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {}
      <Route
        path="/hospitalisations"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'MEDECIN', 'INFIRMIER', 'AGENT_ACCUEIL']}>
            <DashboardLayout>
              <ListeHospitalisations />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hospitalisations/nouvelle"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'MEDECIN']}>
            <DashboardLayout>
              <FormulaireHospitalisation />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hospitalisations/:id"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'MEDECIN', 'INFIRMIER', 'AGENT_ACCUEIL', 'PATIENT']}>
            <DashboardLayout>
              <DetailsHospitalisation />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {}
      <Route
        path="/lits"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN']}>
            <DashboardLayout>
              <ListeLits />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/lits/nouveau"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN']}>
            <DashboardLayout>
              <FormulaireLit />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/lits/:id/modifier"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN']}>
            <DashboardLayout>
              <FormulaireLit />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {}
      {}
      <Route
        path="/factures"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'COMPTABLE', 'PATIENT']}>
            <DashboardLayout>
              <ListeFactures />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/factures/nouvelle"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'COMPTABLE']}>
            <DashboardLayout>
              <FormulaireFacture />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/factures/:id"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'COMPTABLE', 'PATIENT']}>
            <DashboardLayout>
              <DetailsFacture />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/factures/:id/modifier"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'COMPTABLE']}>
            <DashboardLayout>
              <FormulaireFacture />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {}
      <Route
        path="/paiements"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'COMPTABLE', 'PATIENT']}>
            <DashboardLayout>
              <ListePaiements />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/paiements/nouveau"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'COMPTABLE']}>
            <DashboardLayout>
              <FormulairePaiement />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {}
      <Route
        path="/assurances"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'COMPTABLE', 'PATIENT']}>
            <DashboardLayout>
              <ListeAssurances />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/assurances/nouvelle"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'COMPTABLE']}>
            <DashboardLayout>
              <FormulaireAssurance />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {}
      <Route
        path="/admin/utilisateurs"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR']}>
            <DashboardLayout>
              <ListeUtilisateurs />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/utilisateurs/nouveau"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR']}>
            <DashboardLayout>
              <FormulaireUtilisateur />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/utilisateurs/:id/modifier"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR']}>
            <DashboardLayout>
              <FormulaireUtilisateur />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/roles"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR']}>
            <DashboardLayout>
              <ListeRoles />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/permissions"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR']}>
            <DashboardLayout>
              <ListePermissions />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/notifications"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN', 'INFIRMIER', 'COMPTABLE', 'DIRECTEUR']}>
            <DashboardLayout>
              <ListeNotifications />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {}
      <Route
        path="/staff/profil"
        element={
          <ProtectedRoute requiredRoles={['ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN', 'INFIRMIER', 'COMPTABLE', 'DIRECTEUR']}>
            <DashboardLayout>
              <ProfilUtilisateur />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      {}
      <Route
        path="/patient/profil"
        element={
          <ProtectedRoute requiredRoles={['PATIENT']}>
            <PatientPortalLayout>
              <ProfilPatient />
            </PatientPortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/rendezvous"
        element={
          <ProtectedRoute requiredRoles={['PATIENT']}>
            <PatientPortalLayout>
              <MesRendezVous />
            </PatientPortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/consultations"
        element={
          <ProtectedRoute requiredRoles={['PATIENT']}>
            <PatientPortalLayout>
              <MesConsultations />
            </PatientPortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/dossier-medical"
        element={
          <ProtectedRoute requiredRoles={['PATIENT']}>
            <PatientPortalLayout>
              <MonDossierMedical />
            </PatientPortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/constantes-vitales"
        element={
          <ProtectedRoute requiredRoles={['PATIENT']}>
            <PatientPortalLayout>
              <MesConstantesVitales />
            </PatientPortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/hospitalisations"
        element={
          <ProtectedRoute requiredRoles={['PATIENT']}>
            <PatientPortalLayout>
              <MesHospitalisations />
            </PatientPortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/factures"
        element={
          <ProtectedRoute requiredRoles={['PATIENT']}>
            <PatientPortalLayout>
              <MesFactures />
            </PatientPortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/paiements"
        element={
          <ProtectedRoute requiredRoles={['PATIENT']}>
            <PatientPortalLayout>
              <MesPaiements />
            </PatientPortalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/assurances"
        element={
          <ProtectedRoute requiredRoles={['PATIENT']}>
            <PatientPortalLayout>
              <MonAssurance />
            </PatientPortalLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
export default AppRoutes;
