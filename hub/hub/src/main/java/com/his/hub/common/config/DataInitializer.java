package com.his.hub.common.config;

import com.his.hub.authentication.dao.PermissionRepository;
import com.his.hub.authentication.dao.RoleRepository;
import com.his.hub.authentication.dao.UtilisateurRepository;
import com.his.hub.authentication.entity.Permission;
import com.his.hub.authentication.entity.Role;
import com.his.hub.authentication.entity.Utilisateur;
import com.his.hub.constantes.dao.ConstantesVitalesRepository;
import com.his.hub.constantes.entity.ConstantesVitales;
import com.his.hub.consultation.dao.ConsultationRepository;
import com.his.hub.consultation.entity.Consultation;
import com.his.hub.dossiermedical.dao.DossierMedicalRepository;
import com.his.hub.dossiermedical.entity.DossierMedical;
import com.his.hub.facturation.dao.AssuranceRepository;
import com.his.hub.facturation.dao.FactureRepository;
import com.his.hub.facturation.dao.PaiementRepository;
import com.his.hub.facturation.entity.Assurance;
import com.his.hub.facturation.entity.Facture;
import com.his.hub.facturation.entity.LigneFacture;
import com.his.hub.facturation.entity.Paiement;
import com.his.hub.hospitalisation.dao.HospitalisationRepository;
import com.his.hub.hospitalisation.dao.LitRepository;
import com.his.hub.hospitalisation.entity.Hospitalisation;
import com.his.hub.hospitalisation.entity.Lit;
import com.his.hub.patient.dao.PatientRepository;
import com.his.hub.patient.entity.Patient;
import com.his.hub.rendezvous.dao.RendezVousRepository;
import com.his.hub.rendezvous.entity.RendezVous;
import com.his.hub.suivi.dao.SuiviHospitalierRepository;
import com.his.hub.suivi.entity.SuiviHospitalier;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final PatientRepository patientRepository;
    private final DossierMedicalRepository dossierMedicalRepository;
    private final LitRepository litRepository;
    private final AssuranceRepository assuranceRepository;
    private final RendezVousRepository rendezVousRepository;
    private final ConsultationRepository consultationRepository;
    private final HospitalisationRepository hospitalisationRepository;
    private final ConstantesVitalesRepository constantesVitalesRepository;
    private final SuiviHospitalierRepository suiviHospitalierRepository;
    private final FactureRepository factureRepository;
    private final PaiementRepository paiementRepository;
    private final PasswordEncoder passwordEncoder;

    @EventListener(ApplicationReadyEvent.class)
    @Order(1)
    @Transactional
    public void initializeData() {
        if (permissionRepository.count() > 0) {
            log.info("Data already initialized. Skipping...");
            return;
        }

        log.info("Starting data initialization...");

        
        createPermissions();

        
        createRoles();

        
        linkPermissionsToRoles();

        
        createUsers();

        
        createPatients();

        
        createMedicalRecords();

        
        createBeds();

        
        createInsurance();

        
        createRendezVous();

        
        createConsultations();

        
        createHospitalisations();

        
        createConstantesVitales();

        
        createSuivisHospitaliers();

        
        createFactures();

        
        createPaiements();

        log.info("Data initialization completed successfully!");
    }

    private void createPermissions() {
        log.info("Creating permissions...");
        String[][] permissions = {
            {"CREER_UTILISATEUR", "Créer un utilisateur"},
            {"MODIFIER_UTILISATEUR", "Modifier un utilisateur"},
            {"SUPPRIMER_UTILISATEUR", "Supprimer un utilisateur"},
            {"GERER_ROLES", "Gérer les rôles et permissions"},
            {"CREER_PATIENT", "Créer un patient"},
            {"MODIFIER_PATIENT", "Modifier un patient"},
            {"CONSULTER_DOSSIER", "Consulter le dossier médical"},
            {"CREER_RENDEZVOUS", "Créer un rendez-vous"},
            {"CREER_CONSULTATION", "Créer une consultation"},
            {"CREER_HOSPITALISATION", "Créer une hospitalisation"},
            {"ENREGISTRER_CONSTANTES", "Enregistrer les constantes vitales"},
            {"ENREGISTRER_SUIVI", "Enregistrer le suivi hospitalier"},
            {"GERER_FACTURES", "Gérer les factures"},
            {"ENREGISTRER_PAIEMENT", "Enregistrer un paiement"},
            {"CONSULTER_STATISTIQUES", "Consulter les statistiques"}
        };

        for (String[] perm : permissions) {
            if (!permissionRepository.existsByNom(perm[0])) {
                Permission permission = new Permission();
                permission.setNom(perm[0]);
                permission.setDescription(perm[1]);
                permissionRepository.save(permission);
            }
        }
    }

    private void createRoles() {
        log.info("Creating roles...");
        String[][] roles = {
            {"ADMINISTRATEUR", "Administrateur système avec tous les droits"},
            {"AGENT_ACCUEIL", "Agent d'accueil - Gestion des patients et rendez-vous"},
            {"MEDECIN", "Médecin - Consultations et hospitalisations"},
            {"INFIRMIER", "Infirmier - Soins et suivi des patients"},
            {"COMPTABLE", "Comptable - Gestion financière"},
            {"DIRECTEUR", "Directeur - Consultation des statistiques"},
            {"PATIENT", "Patient - Accès à ses propres données médicales"}
        };

        for (String[] role : roles) {
            if (!roleRepository.existsByNom(role[0])) {
                Role r = new Role();
                r.setNom(role[0]);
                r.setDescription(role[1]);
                roleRepository.save(r);
            }
        }
    }

    private void linkPermissionsToRoles() {
        log.info("Linking permissions to roles...");
        
        Role admin = roleRepository.findByNom("ADMINISTRATEUR").orElseThrow();
        Role agent = roleRepository.findByNom("AGENT_ACCUEIL").orElseThrow();
        Role medecin = roleRepository.findByNom("MEDECIN").orElseThrow();
        Role infirmier = roleRepository.findByNom("INFIRMIER").orElseThrow();
        Role comptable = roleRepository.findByNom("COMPTABLE").orElseThrow();
        Role directeur = roleRepository.findByNom("DIRECTEUR").orElseThrow();

        
        admin.setPermissions(new HashSet<>(permissionRepository.findAll()));
        roleRepository.save(admin);

        
        Set<Permission> agentPerms = new HashSet<>();
        agentPerms.add(permissionRepository.findByNom("CREER_PATIENT").orElseThrow());
        agentPerms.add(permissionRepository.findByNom("MODIFIER_PATIENT").orElseThrow());
        agentPerms.add(permissionRepository.findByNom("CONSULTER_DOSSIER").orElseThrow());
        agentPerms.add(permissionRepository.findByNom("CREER_RENDEZVOUS").orElseThrow());
        agent.setPermissions(agentPerms);
        roleRepository.save(agent);

        
        Set<Permission> medecinPerms = new HashSet<>();
        medecinPerms.add(permissionRepository.findByNom("CONSULTER_DOSSIER").orElseThrow());
        medecinPerms.add(permissionRepository.findByNom("CREER_CONSULTATION").orElseThrow());
        medecinPerms.add(permissionRepository.findByNom("CREER_HOSPITALISATION").orElseThrow());
        medecinPerms.add(permissionRepository.findByNom("CREER_RENDEZVOUS").orElseThrow());
        medecin.setPermissions(medecinPerms);
        roleRepository.save(medecin);

        
        Set<Permission> infirmierPerms = new HashSet<>();
        infirmierPerms.add(permissionRepository.findByNom("CONSULTER_DOSSIER").orElseThrow());
        infirmierPerms.add(permissionRepository.findByNom("ENREGISTRER_CONSTANTES").orElseThrow());
        infirmierPerms.add(permissionRepository.findByNom("ENREGISTRER_SUIVI").orElseThrow());
        infirmier.setPermissions(infirmierPerms);
        roleRepository.save(infirmier);

        
        Set<Permission> comptablePerms = new HashSet<>();
        comptablePerms.add(permissionRepository.findByNom("GERER_FACTURES").orElseThrow());
        comptablePerms.add(permissionRepository.findByNom("ENREGISTRER_PAIEMENT").orElseThrow());
        comptable.setPermissions(comptablePerms);
        roleRepository.save(comptable);

        
        Set<Permission> directeurPerms = new HashSet<>();
        directeurPerms.add(permissionRepository.findByNom("CONSULTER_STATISTIQUES").orElseThrow());
        directeurPerms.add(permissionRepository.findByNom("CONSULTER_DOSSIER").orElseThrow());
        directeur.setPermissions(directeurPerms);
        roleRepository.save(directeur);

        
        Role patient = roleRepository.findByNom("PATIENT").orElseThrow();
        Set<Permission> patientPerms = new HashSet<>();
        patientPerms.add(permissionRepository.findByNom("CONSULTER_DOSSIER").orElseThrow());
        patient.setPermissions(patientPerms);
        roleRepository.save(patient);
    }

    private void createUsers() {
        log.info("Creating users...");
        String password = passwordEncoder.encode("password123");
        LocalDateTime now = LocalDateTime.now();

        String[][] users = {
            
            {"admin", "Admin", "System", "admin@his.local", "0123456789", "ADMINISTRATEUR"},
            {"agent1", "Dupont", "Marie", "agent1@his.local", "0123456780", "AGENT_ACCUEIL"},
            {"medecin1", "Martin", "Jean", "medecin1@his.local", "0123456781", "MEDECIN"},
            {"infirmier1", "Bernard", "Sophie", "infirmier1@his.local", "0123456782", "INFIRMIER"},
            {"comptable1", "Dubois", "Pierre", "comptable1@his.local", "0123456783", "COMPTABLE"},
            {"directeur1", "Lefebvre", "Anne", "directeur1@his.local", "0123456784", "DIRECTEUR"},
            
            
            {"agent2", "El Amrani", "Khalid", "khalid.elamrani@his.local", "0123456785", "AGENT_ACCUEIL"},
            {"medecin2", "Bennani", "Fatima", "fatima.bennani@his.local", "0123456786", "MEDECIN"},
            {"medecin3", "Idrissi", "Hassan", "hassan.idrissi@his.local", "0123456787", "MEDECIN"},
            {"infirmier2", "Tazi", "Aicha", "aicha.tazi@his.local", "0123456788", "INFIRMIER"},
            {"infirmier3", "Cherkaoui", "Mohammed", "mohammed.cherkaoui@his.local", "0123456790", "INFIRMIER"},
            {"comptable2", "Lahlou", "Nadia", "nadia.lahlou@his.local", "0123456791", "COMPTABLE"},
            {"directeur2", "El Fassi", "Mehdi", "mehdi.elfassi@his.local", "0123456792", "DIRECTEUR"}
        };

        for (String[] userData : users) {
            if (!utilisateurRepository.existsByUsername(userData[0])) {
                Utilisateur user = new Utilisateur();
                user.setUsername(userData[0]);
                user.setPassword(password);
                user.setNom(userData[1]);
                user.setPrenom(userData[2]);
                user.setEmail(userData[3]);
                user.setTelephone(userData[4]);
                user.setActif(true);
                user.setDateCreation(now);

                Role role = roleRepository.findByNom(userData[5]).orElseThrow();
                user.setRoles(Set.of(role));

                utilisateurRepository.save(user);
            }
        }
    }

    private void createPatients() {
        log.info("Creating patients...");
        LocalDateTime now = LocalDateTime.now();
        String password = passwordEncoder.encode("password123");
        Role patientRole = roleRepository.findByNom("PATIENT").orElseThrow();

        
        Object[][] patients = {
            
            {"Alami", "Ahmed", LocalDate.of(1985, 5, 15), Patient.Sexe.MASCULIN, "AB123456", "123 Rue Mohammed V, Casablanca", "0612345678", "ahmed.alami@email.com", "Hypertension artérielle depuis 2015.", "Aucune", false, null},
            {"Benali", "Fatima", LocalDate.of(1990, 8, 22), Patient.Sexe.FEMININ, "CD789012", "456 Avenue Hassan II, Rabat", "0623456789", "fatima.benali@email.com", "Diabète de type 2 diagnostiqué en 2018.", "Aucune", false, null},
            {"Idrissi", "Mohammed", LocalDate.of(1978, 12, 10), Patient.Sexe.MASCULIN, "EF345678", "789 Boulevard Zerktouni, Marrakech", "0634567890", "mohammed.idrissi@email.com", "Antécédents d'asthme. Pas de crise depuis 2 ans.", "Aucune", false, null},
            {"Tazi", "Aicha", LocalDate.of(1995, 3, 30), Patient.Sexe.FEMININ, "GH901234", "321 Rue Allal Ben Abdellah, Fès", "0645678901", "aicha.tazi@email.com", "Aucun antécédent médical notable.", "Aucune", false, null},
            {"Bennani", "Youssef", LocalDate.of(1988, 7, 18), Patient.Sexe.MASCULIN, "IJ567890", "654 Avenue Mohammed VI, Tanger", "0656789012", "youssef.bennani@email.com", "Aucun antécédent.", "Allergie aux pénicillines", false, null},
            
            
            {"El Amrani", "Sanae", LocalDate.of(1992, 4, 12), Patient.Sexe.FEMININ, "KL123789", "12 Rue Ibn Battuta, Casablanca", "0667890123", "sanae.elamrani@email.com", "Aucun antécédent médical.", "Aucune", true, "patient1"},
            {"Ouali", "Karim", LocalDate.of(1987, 9, 25), Patient.Sexe.MASCULIN, "MN456123", "45 Avenue Al Massira, Rabat", "0678901234", "karim.ouali@email.com", "Hypertension légère.", "Aucune", true, "patient2"},
            {"Bouazza", "Laila", LocalDate.of(1994, 11, 8), Patient.Sexe.FEMININ, "OP789456", "78 Boulevard Mohammed V, Marrakech", "0689012345", "laila.bouazza@email.com", "Aucun antécédent.", "Allergie aux acariens", true, "patient3"},
            {"Cherkaoui", "Omar", LocalDate.of(1983, 2, 18), Patient.Sexe.MASCULIN, "QR234567", "23 Rue Hassan II, Fès", "0690123456", "omar.cherkaoui@email.com", "Diabète de type 1.", "Aucune", true, "patient4"},
            {"Lahlou", "Nadia", LocalDate.of(1996, 6, 30), Patient.Sexe.FEMININ, "ST567890", "56 Avenue Mohammed VI, Tanger", "0611234567", "nadia.lahlou@email.com", "Aucun antécédent médical notable.", "Aucune", true, "patient5"},
            
            
            {"El Fassi", "Mehdi", LocalDate.of(1989, 1, 14), Patient.Sexe.MASCULIN, "UV890123", "89 Rue Zerktouni, Casablanca", "0622345678", "mehdi.elfassi@email.com", "Asthme chronique.", "Aucune", false, null},
            {"Bensaid", "Salma", LocalDate.of(1991, 7, 22), Patient.Sexe.FEMININ, "WX123456", "34 Avenue Allal Ben Abdellah, Rabat", "0633456789", "salma.bensaid@email.com", "Aucun antécédent.", "Allergie aux pollens", false, null},
            {"Mansouri", "Hassan", LocalDate.of(1986, 3, 5), Patient.Sexe.MASCULIN, "YZ456789", "67 Boulevard Zerktouni, Marrakech", "0644567890", "hassan.mansouri@email.com", "Hypertension artérielle.", "Aucune", false, null},
            {"El Ouazzani", "Imane", LocalDate.of(1993, 10, 17), Patient.Sexe.FEMININ, "AA789012", "90 Rue Mohammed V, Fès", "0655678901", "imane.elouazzani@email.com", "Aucun antécédent médical.", "Aucune", false, null},
            {"Bennouna", "Rachid", LocalDate.of(1984, 8, 28), Patient.Sexe.MASCULIN, "BB012345", "11 Avenue Hassan II, Tanger", "0666789012", "rachid.bennouna@email.com", "Diabète de type 2.", "Aucune", false, null},
            {"El Khattabi", "Souad", LocalDate.of(1997, 5, 9), Patient.Sexe.FEMININ, "CC345678", "22 Rue Ibn Battuta, Casablanca", "0677890123", "souad.elkhattabi@email.com", "Aucun antécédent.", "Aucune", false, null},
            {"Berrada", "Amine", LocalDate.of(1982, 12, 3), Patient.Sexe.MASCULIN, "DD678901", "33 Avenue Al Massira, Rabat", "0688901234", "amine.berrada@email.com", "Hypertension artérielle sévère.", "Aucune", false, null},
            {"El Malki", "Hind", LocalDate.of(1995, 4, 20), Patient.Sexe.FEMININ, "EE901234", "44 Boulevard Mohammed V, Marrakech", "0699012345", "hind.elmalki@email.com", "Aucun antécédent médical notable.", "Allergie aux produits laitiers", false, null},
            {"Tahiri", "Yassine", LocalDate.of(1988, 9, 11), Patient.Sexe.MASCULIN, "FF234567", "55 Rue Hassan II, Fès", "0610123456", "yassine.tahiri@email.com", "Asthme léger.", "Aucune", false, null},
            {"El Haddadi", "Khadija", LocalDate.of(1990, 1, 26), Patient.Sexe.FEMININ, "GG567890", "66 Avenue Mohammed VI, Tanger", "0621234567", "khadija.elhaddadi@email.com", "Aucun antécédent.", "Aucune", false, null}
        };

        for (Object[] patientData : patients) {
            String numeroIdentification = (String) patientData[4];
            if (!patientRepository.existsByNumeroIdentification(numeroIdentification)) {
                Patient patient = new Patient();
                patient.setNom((String) patientData[0]);
                patient.setPrenom((String) patientData[1]);
                patient.setDateNaissance((LocalDate) patientData[2]);
                patient.setSexe((Patient.Sexe) patientData[3]);
                patient.setNumeroIdentification(numeroIdentification);
                patient.setAdresse((String) patientData[5]);
                patient.setTelephone((String) patientData[6]);
                patient.setEmail((String) patientData[7]);
                patient.setAntecedentsMedicaux((String) patientData[8]);
                patient.setAllergies((String) patientData[9]);
                patient.setActif(true);
                patient.setDateCreation(now);

                
                Boolean createUserAccount = (Boolean) patientData[10];
                if (Boolean.TRUE.equals(createUserAccount)) {
                    String username = (String) patientData[11];
                    if (username != null && !utilisateurRepository.existsByUsername(username)) {
                        Utilisateur utilisateur = new Utilisateur();
                        utilisateur.setUsername(username);
                        utilisateur.setPassword(password);
                        utilisateur.setNom((String) patientData[0]);
                        utilisateur.setPrenom((String) patientData[1]);
                        utilisateur.setEmail((String) patientData[7]);
                        utilisateur.setTelephone((String) patientData[6]);
                        utilisateur.setActif(true);
                        utilisateur.setRoles(Set.of(patientRole));
                        utilisateur.setDateCreation(now);
                        
                        Utilisateur savedUtilisateur = utilisateurRepository.save(utilisateur);
                        patient.setUtilisateur(savedUtilisateur);
                        log.info("Created user account '{}' for patient {} {}", username, patientData[0], patientData[1]);
                    }
                }

                patientRepository.save(patient);
            }
        }
    }

    private void createMedicalRecords() {
        log.info("Creating medical records...");
        LocalDateTime now = LocalDateTime.now();

        
        List<Patient> allPatients = patientRepository.findAll();
        String[] groupesSanguins = {"A", "B", "O", "AB", "A", "B", "O", "AB", "A", "B", "O", "AB", "A", "B", "O", "AB", "A", "B", "O", "AB"};
        String[] rhesus = {"POSITIF", "NEGATIF", "POSITIF", "POSITIF", "NEGATIF", "POSITIF", "NEGATIF", "POSITIF", "POSITIF", "NEGATIF", "POSITIF", "POSITIF", "NEGATIF", "POSITIF", "NEGATIF", "POSITIF", "POSITIF", "NEGATIF", "POSITIF", "POSITIF"};
        
        int index = 0;
        for (Patient patient : allPatients) {
            if (!dossierMedicalRepository.existsByPatientId(patient.getId())) {
                DossierMedical dossier = new DossierMedical();
                dossier.setPatient(patient);
                dossier.setHistoriqueMedical(patient.getAntecedentsMedicaux());
                dossier.setNotesCliniques("Dossier médical créé lors de l'initialisation. " + 
                    (patient.getAntecedentsMedicaux() != null && !patient.getAntecedentsMedicaux().isEmpty() 
                        ? "Antécédents: " + patient.getAntecedentsMedicaux() 
                        : "Aucun antécédent notable."));
                dossier.setGroupeSanguin(groupesSanguins[index % groupesSanguins.length]);
                dossier.setRhesus(rhesus[index % rhesus.length]);
                dossier.setActif(true);
                dossier.setDateCreation(now);
                dossierMedicalRepository.save(dossier);
                index++;
            }
        }
    }

    private void createBeds() {
        log.info("Creating beds...");
        Object[][] beds = {
            {"LIT-001", "Cardiologie", "CH-101", Lit.StatutLit.DISPONIBLE, "Lit standard"},
            {"LIT-002", "Cardiologie", "CH-101", Lit.StatutLit.DISPONIBLE, "Lit standard"},
            {"LIT-003", "Chirurgie", "CH-201", Lit.StatutLit.DISPONIBLE, "Lit post-opératoire"},
            {"LIT-004", "Chirurgie", "CH-201", Lit.StatutLit.DISPONIBLE, "Lit post-opératoire"},
            {"LIT-005", "Médecine Générale", "CH-301", Lit.StatutLit.DISPONIBLE, "Lit standard"},
            {"LIT-006", "Médecine Générale", "CH-301", Lit.StatutLit.DISPONIBLE, "Lit standard"},
            {"LIT-007", "Urgences", "CH-401", Lit.StatutLit.DISPONIBLE, "Lit d'urgence"},
            {"LIT-008", "Urgences", "CH-401", Lit.StatutLit.DISPONIBLE, "Lit d'urgence"}
        };

        for (Object[] bedData : beds) {
            if (litRepository.findByNumeroLit((String) bedData[0]).isEmpty()) {
                Lit lit = new Lit();
                lit.setNumeroLit((String) bedData[0]);
                lit.setService((String) bedData[1]);
                lit.setChambre((String) bedData[2]);
                lit.setStatut((Lit.StatutLit) bedData[3]);
                lit.setNotes((String) bedData[4]);
                litRepository.save(lit);
            }
        }
    }

    private void createInsurance() {
        log.info("Creating insurance records...");
        LocalDateTime now = LocalDateTime.now();

        String[] assurances = {"CNSS", "CNOPS", "Assurance Privée XYZ", "CNSS", "CNOPS", "CNSS", "CNOPS", "Assurance Privée ABC", "CNSS", "CNOPS", "CNSS", "CNOPS", "Assurance Privée XYZ", "CNSS", "CNOPS", "CNSS", "CNOPS", "Assurance Privée ABC", "CNSS", "CNOPS"};
        double[] tauxCouverture = {70.0, 80.0, 60.0, 70.0, 80.0, 70.0, 80.0, 65.0, 70.0, 80.0, 70.0, 80.0, 60.0, 70.0, 80.0, 70.0, 80.0, 65.0, 70.0, 80.0};
        
        List<Patient> allPatients = patientRepository.findAll();
        int index = 0;
        for (Patient patient : allPatients) {
            if (assuranceRepository.findByPatientId(patient.getId()).isEmpty()) {
                Assurance assurance = new Assurance();
                assurance.setPatient(patient);
                assurance.setNomAssurance(assurances[index % assurances.length]);
                assurance.setNumeroContrat(assurances[index % assurances.length] + "-2024-" + String.format("%03d", index + 1));
                assurance.setTauxCouverture(tauxCouverture[index % tauxCouverture.length]);
                assurance.setActif(true);
                assurance.setDateCreation(now);
                assuranceRepository.save(assurance);
                index++;
            }
        }
    }

    private void createRendezVous() {
        log.info("Creating appointments (rendez-vous)...");
        LocalDateTime now = LocalDateTime.now();

        
        Utilisateur medecin = utilisateurRepository.findByUsername("medecin1").orElseThrow();

        Object[][] rendezVous = {
            {1L, medecin.getId(), LocalDateTime.now().plusDays(2).withHour(9).withMinute(0), RendezVous.StatutRendezVous.PLANIFIE, "Consultation de routine", "Premier rendez-vous"},
            {2L, medecin.getId(), LocalDateTime.now().plusDays(3).withHour(10).withMinute(30), RendezVous.StatutRendezVous.CONFIRME, "Suivi diabète", "Contrôle glycémique"},
            {3L, medecin.getId(), LocalDateTime.now().plusDays(5).withHour(14).withMinute(0), RendezVous.StatutRendezVous.PLANIFIE, "Consultation générale", null},
            {4L, medecin.getId(), LocalDateTime.now().minusDays(1).withHour(11).withMinute(0), RendezVous.StatutRendezVous.TERMINE, "Consultation préventive", "Examen complet effectué"},
            {5L, medecin.getId(), LocalDateTime.now().plusDays(7).withHour(15).withMinute(30), RendezVous.StatutRendezVous.CONFIRME, "Suivi post-opératoire", "Contrôle après intervention"}
        };

        for (Object[] rdvData : rendezVous) {
            Long patientId = (Long) rdvData[0];
            Patient patient = patientRepository.findById(patientId).orElseThrow();
            
            RendezVous rdv = new RendezVous();
            rdv.setPatient(patient);
            rdv.setMedecin(medecin);
            rdv.setDateHeure((LocalDateTime) rdvData[2]);
            rdv.setStatut((RendezVous.StatutRendezVous) rdvData[3]);
            rdv.setMotif((String) rdvData[4]);
            rdv.setNotes((String) rdvData[5]);
            rdv.setDateCreation(now);
            
            rendezVousRepository.save(rdv);
        }
    }

    private void createConsultations() {
        log.info("Creating consultations...");
        LocalDateTime now = LocalDateTime.now();

        
        Utilisateur medecin = utilisateurRepository.findByUsername("medecin1").orElseThrow();

        Object[][] consultations = {
            {1L, LocalDateTime.now().minusDays(10), Consultation.TypeConsultation.CONSULTATION_GENERALE, 
                "Hypertension artérielle", 
                "TA: 145/90 mmHg, FC: 72 bpm, Pas d'anomalie cardiaque", 
                "Hypertension artérielle stade 1", 
                "Amlodipine 5mg 1cp/jour, Mesure tension 2x/jour", 
                "Contrôle dans 1 mois"},
            {2L, LocalDateTime.now().minusDays(5), Consultation.TypeConsultation.SUIVI, 
                "Suivi diabète type 2", 
                "Glycémie à jeun: 6.8 mmol/L, HbA1c: 7.2%", 
                "Diabète de type 2 bien équilibré", 
                "Metformine 1000mg 2x/jour, Continuer régime", 
                "Contrôle glycémique dans 3 mois"},
            {3L, LocalDateTime.now().minusDays(3), Consultation.TypeConsultation.CONSULTATION_SPECIALISEE, 
                "Asthme", 
                "Poumons clairs, Pas de sibilance", 
                "Asthme contrôlé", 
                "Ventoline en cas de besoin", 
                "Pas de traitement de fond nécessaire actuellement"},
            {4L, LocalDateTime.now().minusDays(7), Consultation.TypeConsultation.CONSULTATION_GENERALE, 
                "Bilan de santé", 
                "Examen clinique normal, Pas d'anomalie", 
                "Bonne santé générale", 
                "Aucun traitement", 
                "Contrôle annuel"},
            {5L, LocalDateTime.now().minusDays(2), Consultation.TypeConsultation.URGENCE, 
                "Infection respiratoire", 
                "Toux, Fièvre 38.5°C, Auscultation pulmonaire normale", 
                "Infection respiratoire virale", 
                "Paracétamol 1g 3x/jour, Repos", 
                "Revenir si aggravation"}
        };

        for (Object[] consultData : consultations) {
            Long patientId = (Long) consultData[0];
            Patient patient = patientRepository.findById(patientId).orElseThrow();
            
            Consultation consultation = new Consultation();
            consultation.setPatient(patient);
            consultation.setMedecin(medecin);
            consultation.setDateHeure((LocalDateTime) consultData[1]);
            consultation.setTypeConsultation((Consultation.TypeConsultation) consultData[2]);
            consultation.setMotif((String) consultData[3]);
            consultation.setExamenClinique((String) consultData[4]);
            consultation.setDiagnostic((String) consultData[5]);
            consultation.setPrescription((String) consultData[6]);
            consultation.setRecommandations((String) consultData[7]);
            consultation.setDateCreation(now);
            
            consultationRepository.save(consultation);
        }
    }

    private void createHospitalisations() {
        log.info("Creating hospitalisations...");
        LocalDateTime now = LocalDateTime.now();

        
        Utilisateur medecin = utilisateurRepository.findByUsername("medecin1").orElseThrow();
        
        
        Lit lit1 = litRepository.findByNumeroLit("LIT-001").orElseThrow();
        Lit lit2 = litRepository.findByNumeroLit("LIT-003").orElseThrow();
        Lit lit3 = litRepository.findByNumeroLit("LIT-005").orElseThrow();

        Object[][] hospitalisations = {
            {1L, lit1.getId(), LocalDateTime.now().minusDays(5), null, Hospitalisation.StatutHospitalisation.EN_COURS, 
                "Hypertension sévère nécessitant surveillance", 
                "Hypertension artérielle sévère avec complications"},
            {2L, lit2.getId(), LocalDateTime.now().minusDays(3), null, Hospitalisation.StatutHospitalisation.EN_COURS, 
                "Chirurgie programmée", 
                "Intervention chirurgicale prévue"},
            {3L, lit3.getId(), LocalDateTime.now().minusDays(10), LocalDateTime.now().minusDays(7), Hospitalisation.StatutHospitalisation.SORTIE, 
                "Pneumonie", 
                "Pneumonie bactérienne traitée", 
                "Sortie avec traitement antibiotique à poursuivre"}
        };

        for (Object[] hospData : hospitalisations) {
            Long patientId = (Long) hospData[0];
            Patient patient = patientRepository.findById(patientId).orElseThrow();
            Lit lit = litRepository.findById((Long) hospData[1]).orElseThrow();
            
            Hospitalisation hospitalisation = new Hospitalisation();
            hospitalisation.setPatient(patient);
            hospitalisation.setMedecin(medecin);
            hospitalisation.setLit(lit);
            hospitalisation.setDateAdmission((LocalDateTime) hospData[2]);
            hospitalisation.setDateSortie((LocalDateTime) hospData[3]);
            hospitalisation.setStatut((Hospitalisation.StatutHospitalisation) hospData[4]);
            hospitalisation.setMotifAdmission((String) hospData[5]);
            hospitalisation.setDiagnostic((String) hospData[6]);
            if (hospData.length > 7) {
                hospitalisation.setNotesSortie((String) hospData[7]);
            }
            hospitalisation.setDateCreation(now);
            
            
            lit.setStatut(Lit.StatutLit.OCCUPE);
            litRepository.save(lit);
            
            hospitalisationRepository.save(hospitalisation);
        }
    }

    private void createConstantesVitales() {
        log.info("Creating vital signs (constantes vitales)...");
        LocalDateTime now = LocalDateTime.now();

        
        Utilisateur infirmier = utilisateurRepository.findByUsername("infirmier1").orElseThrow();

        Object[][] constantes = {
            {1L, LocalDateTime.now().minusHours(2), 36.8, 145, 90, 72, 18, 75.5, 175.0, 5.8, 98.0, "Constantes normales"},
            {1L, LocalDateTime.now().minusHours(6), 37.1, 142, 88, 70, 16, 75.2, 175.0, 5.9, 98.5, "Stable"},
            {2L, LocalDateTime.now().minusHours(1), 36.9, 130, 80, 68, 16, 68.0, 165.0, 6.2, 99.0, "Bien contrôlé"},
            {3L, LocalDateTime.now().minusHours(3), 36.7, 120, 75, 65, 14, 82.0, 180.0, null, 97.5, "Normal"},
            {4L, LocalDateTime.now().minusHours(4), 36.6, 115, 70, 62, 15, 60.0, 165.0, null, 98.0, "Excellent état"},
            {5L, LocalDateTime.now().minusHours(5), 37.2, 125, 78, 75, 18, 70.0, 170.0, null, 97.8, "Légère fièvre"}
        };

        for (Object[] constData : constantes) {
            Long patientId = (Long) constData[0];
            Patient patient = patientRepository.findById(patientId).orElseThrow();
            
            ConstantesVitales constante = new ConstantesVitales();
            constante.setPatient(patient);
            constante.setInfirmier(infirmier);
            constante.setDateHeure((LocalDateTime) constData[1]);
            constante.setTemperature((Double) constData[2]);
            constante.setTensionArterielleSystolique((Integer) constData[3]);
            constante.setTensionArterielleDiastolique((Integer) constData[4]);
            constante.setFrequenceCardiaque((Integer) constData[5]);
            constante.setFrequenceRespiratoire((Integer) constData[6]);
            constante.setPoids((Double) constData[7]);
            constante.setTaille((Double) constData[8]);
            constante.setGlycemie((Double) constData[9]);
            constante.setSaturationOxygene((Double) constData[10]);
            constante.setNotes((String) constData[11]);
            constante.setDateCreation(now);
            
            constantesVitalesRepository.save(constante);
        }
    }

    private void createSuivisHospitaliers() {
        log.info("Creating hospital follow-ups (suivis hospitaliers)...");
        LocalDateTime now = LocalDateTime.now();

        
        Utilisateur infirmier = utilisateurRepository.findByUsername("infirmier1").orElseThrow();
        
        
        List<Hospitalisation> hospitalisations = hospitalisationRepository.findByStatut(Hospitalisation.StatutHospitalisation.EN_COURS);
        
        if (!hospitalisations.isEmpty()) {
            Hospitalisation hosp1 = hospitalisations.get(0);
            Hospitalisation hosp2 = hospitalisations.size() > 1 ? hospitalisations.get(1) : hosp1;

            Object[][] suivis = {
                {hosp1.getId(), LocalDateTime.now().minusHours(4), 
                    "Patient calme, coopératif", 
                    "Prise de tension, contrôle glycémique", 
                    "Amlodipine 5mg, Metformine 1000mg", 
                    "Stable"},
                {hosp1.getId(), LocalDateTime.now().minusHours(12), 
                    "Nuit calme, sommeil réparateur", 
                    "Contrôle des constantes vitales", 
                    "Traitement habituel", 
                    "Amélioration"},
                {hosp2.getId(), LocalDateTime.now().minusHours(2), 
                    "Patient en bonne forme", 
                    "Pansement propre, pas de signe d'infection", 
                    "Antibiotiques IV", 
                    "Évolution favorable"}
            };

            for (Object[] suiviData : suivis) {
                Hospitalisation hosp = hospitalisationRepository.findById((Long) suiviData[0]).orElseThrow();
                
                SuiviHospitalier suivi = new SuiviHospitalier();
                suivi.setHospitalisation(hosp);
                suivi.setInfirmier(infirmier);
                suivi.setDateHeure((LocalDateTime) suiviData[1]);
                suivi.setObservations((String) suiviData[2]);
                suivi.setSoinsAdministres((String) suiviData[3]);
                suivi.setMedicaments((String) suiviData[4]);
                suivi.setEtatPatient((String) suiviData[5]);
                suivi.setDateCreation(now);
                
                suiviHospitalierRepository.save(suivi);
            }
        }
    }

    private void createFactures() {
        log.info("Creating invoices (factures)...");
        LocalDateTime now = LocalDateTime.now();

        Object[][] factures = {
            {1L, 1L, "FAC-2024-001", LocalDateTime.now().minusDays(5), 
                new Object[][]{
                    {"Consultation générale", 1, 200.0},
                    {"Analyses sanguines", 1, 150.0},
                    {"Médicaments", 1, 80.0}
                },
                Facture.StatutFacture.PAYEE},
            {2L, 2L, "FAC-2024-002", LocalDateTime.now().minusDays(3),
                new Object[][]{
                    {"Consultation spécialisée", 1, 300.0},
                    {"Glycémie HbA1c", 1, 120.0}
                },
                Facture.StatutFacture.PARTIELLEMENT_PAYEE},
            {3L, 3L, "FAC-2024-003", LocalDateTime.now().minusDays(2),
                new Object[][]{
                    {"Consultation", 1, 200.0},
                    {"Radiographie thorax", 1, 250.0}
                },
                Facture.StatutFacture.EN_ATTENTE},
            {4L, 4L, "FAC-2024-004", LocalDateTime.now().minusDays(7),
                new Object[][]{
                    {"Bilan de santé complet", 1, 500.0}
                },
                Facture.StatutFacture.PAYEE},
            {5L, 5L, "FAC-2024-005", LocalDateTime.now().minusDays(1),
                new Object[][]{
                    {"Consultation urgence", 1, 350.0},
                    {"Médicaments", 1, 45.0}
                },
                Facture.StatutFacture.EN_ATTENTE}
        };

        for (Object[] factData : factures) {
            Long patientId = (Long) factData[0];
            Patient patient = patientRepository.findById(patientId).orElseThrow();
            Assurance assurance = assuranceRepository.findByPatientId(patientId).stream().findFirst().orElse(null);
            
            Facture facture = new Facture();
            facture.setPatient(patient);
            facture.setAssurance(assurance);
            facture.setNumeroFacture((String) factData[2]);
            facture.setDateFacturation((LocalDateTime) factData[3]);
            facture.setStatut((Facture.StatutFacture) factData[5]);
            
            
            double montantTotal = 0.0;
            Object[][] lignes = (Object[][]) factData[4];
            List<LigneFacture> lignesFacture = new ArrayList<>();
            
            for (Object[] ligneData : lignes) {
                String description = (String) ligneData[0];
                Integer quantite = (Integer) ligneData[1];
                Double prixUnitaire = (Double) ligneData[2];
                Double montantLigne = quantite * prixUnitaire;
                montantTotal += montantLigne;
                
                LigneFacture ligne = new LigneFacture();
                ligne.setFacture(facture);
                ligne.setDescription(description);
                ligne.setQuantite(quantite);
                ligne.setPrixUnitaire(prixUnitaire);
                ligne.setMontantTotal(montantLigne);
                lignesFacture.add(ligne);
            }
            
            facture.setLignesFacture(lignesFacture);
            facture.setMontantTotal(montantTotal);
            
            
            double tauxCouverture = assurance != null ? assurance.getTauxCouverture() : 0.0;
            double montantAssurance = montantTotal * (tauxCouverture / 100.0);
            double montantPatient = montantTotal - montantAssurance;
            
            facture.setMontantAssurance(montantAssurance);
            facture.setMontantPatient(montantPatient);
            facture.setDateCreation(now);
            
            factureRepository.save(facture);
        }
    }

    private void createPaiements() {
        log.info("Creating payments (paiements)...");
        LocalDateTime now = LocalDateTime.now();

        
        List<Facture> facturesPayees = factureRepository.findByStatut(Facture.StatutFacture.PAYEE);
        List<Facture> facturesPartielles = factureRepository.findByStatut(Facture.StatutFacture.PARTIELLEMENT_PAYEE);

        for (Facture facture : facturesPayees) {
            Paiement paiement = new Paiement();
            paiement.setFacture(facture);
            paiement.setPatient(facture.getPatient());
            paiement.setMontant(facture.getMontantPatient());
            paiement.setDatePaiement(facture.getDateFacturation().plusDays(1));
            paiement.setModePaiement(Paiement.ModePaiement.CARTE_BANCAIRE);
            paiement.setReferenceTransaction("TXN-" + facture.getNumeroFacture());
            paiement.setNotes("Paiement complet");
            paiement.setDateCreation(now);
            
            paiementRepository.save(paiement);
        }

        for (Facture facture : facturesPartielles) {
            
            Paiement paiement = new Paiement();
            paiement.setFacture(facture);
            paiement.setPatient(facture.getPatient());
            paiement.setMontant(facture.getMontantPatient() * 0.5);
            paiement.setDatePaiement(facture.getDateFacturation().plusDays(1));
            paiement.setModePaiement(Paiement.ModePaiement.ESPECES);
            paiement.setReferenceTransaction("TXN-PART-" + facture.getNumeroFacture());
            paiement.setNotes("Acompte de 50%");
            paiement.setDateCreation(now);
            
            paiementRepository.save(paiement);
        }
    }
}

