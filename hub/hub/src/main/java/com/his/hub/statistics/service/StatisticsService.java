package com.his.hub.statistics.service;

import com.his.hub.authentication.dao.UtilisateurRepository;
import com.his.hub.consultation.dao.ConsultationRepository;
import com.his.hub.facturation.dao.FactureRepository;
import com.his.hub.facturation.dao.PaiementRepository;
import com.his.hub.facturation.entity.Facture;
import com.his.hub.facturation.entity.Paiement;
import com.his.hub.hospitalisation.dao.HospitalisationRepository;
import com.his.hub.hospitalisation.dao.LitRepository;
import com.his.hub.hospitalisation.entity.Lit;
import com.his.hub.patient.dao.PatientRepository;
import com.his.hub.rendezvous.dao.RendezVousRepository;
import com.his.hub.rendezvous.entity.RendezVous;
import com.his.hub.statistics.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StatisticsService {

    private final PatientRepository patientRepository;
    private final RendezVousRepository rendezVousRepository;
    private final ConsultationRepository consultationRepository;
    private final HospitalisationRepository hospitalisationRepository;
    private final LitRepository litRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final FactureRepository factureRepository;
    private final PaiementRepository paiementRepository;

    
    public DashboardStatsDTO getDashboardStats() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).with(LocalTime.MIN);
        LocalDateTime startOfDay = now.with(LocalTime.MIN);
        LocalDateTime endOfDay = now.with(LocalTime.MAX);

        
        long totalPatients = patientRepository.count();
        long nouveauxPatientsCeMois = patientRepository.countByDateCreationAfter(startOfMonth);

        
        long totalRendezVous = rendezVousRepository.count();
        long rendezVousAujourdhui = rendezVousRepository.countByDateHeureBetween(startOfDay, endOfDay);
        long rendezVousEnAttente = rendezVousRepository.countByStatut(RendezVous.StatutRendezVous.PLANIFIE);
        long rendezVousConfirmes = rendezVousRepository.countByStatut(RendezVous.StatutRendezVous.CONFIRME);
        long rendezVousTermines = rendezVousRepository.countByStatut(RendezVous.StatutRendezVous.TERMINE);
        long rendezVousAnnules = rendezVousRepository.countByStatut(RendezVous.StatutRendezVous.ANNULE);

        
        long totalConsultations = consultationRepository.count();
        long consultationsAujourdhui = consultationRepository.countByDateHeureBetween(startOfDay, endOfDay);
        LocalDateTime startOfWeek = now.minusDays(now.getDayOfWeek().getValue() - 1).with(LocalTime.MIN);
        long consultationsCetteSemaine = consultationRepository.countByDateHeureBetween(startOfWeek, now);
        long consultationsCeMois = consultationRepository.countByDateHeureBetween(startOfMonth, now);

        
        long hospitalisationsEnCours = hospitalisationRepository.countByDateSortieIsNull();
        List<Lit> allLits = litRepository.findAll();
        long totalLits = allLits.size();
        long litsDisponibles = allLits.stream().filter(l -> l.getStatut() == Lit.StatutLit.DISPONIBLE).count();
        long litsOccupes = allLits.stream().filter(l -> l.getStatut() == Lit.StatutLit.OCCUPE).count();
        double tauxOccupation = totalLits > 0 ? (double) litsOccupes / totalLits * 100 : 0;

        
        long totalUtilisateurs = utilisateurRepository.count();

        
        List<Facture> facturesMois = factureRepository.findByDateFacturationAfter(startOfMonth);
        Double chiffreAffairesMois = facturesMois.stream()
            .mapToDouble(f -> f.getMontantTotal() != null ? f.getMontantTotal() : 0.0)
            .sum();

        List<Facture> facturesImpayees = factureRepository.findByStatut(Facture.StatutFacture.EN_ATTENTE);
        Double montantImpaye = facturesImpayees.stream()
            .mapToDouble(f -> {
                double total = f.getMontantTotal() != null ? f.getMontantTotal() : 0.0;
                double paye = f.getMontantPatient() != null ? f.getMontantPatient() : 0.0;
                return total - paye;
            })
            .sum();

        long facturesEnAttente = factureRepository.countByStatut(Facture.StatutFacture.EN_ATTENTE);
        long facturesPayees = factureRepository.countByStatut(Facture.StatutFacture.PAYEE);

        return DashboardStatsDTO.builder()
            .totalPatients(totalPatients)
            .nouveauxPatientsCeMois(nouveauxPatientsCeMois)
            .patientsActifs(totalPatients)
            .totalRendezVous(totalRendezVous)
            .rendezVousAujourdhui(rendezVousAujourdhui)
            .rendezVousEnAttente(rendezVousEnAttente)
            .rendezVousConfirmes(rendezVousConfirmes)
            .rendezVousTermines(rendezVousTermines)
            .rendezVousAnnules(rendezVousAnnules)
            .totalConsultations(totalConsultations)
            .consultationsAujourdhui(consultationsAujourdhui)
            .consultationsCetteSemaine(consultationsCetteSemaine)
            .consultationsCeMois(consultationsCeMois)
            .hospitalisationsEnCours(hospitalisationsEnCours)
            .litsDisponibles(litsDisponibles)
            .litsOccupes(litsOccupes)
            .totalLits(totalLits)
            .tauxOccupation(Math.round(tauxOccupation * 100.0) / 100.0)
            .totalUtilisateurs(totalUtilisateurs)
            .chiffreAffairesMois(chiffreAffairesMois)
            .montantImpaye(montantImpaye)
            .facturesEnAttente(facturesEnAttente)
            .facturesPayees(facturesPayees)
            .build();
    }

    
    public PatientStatsDTO getPatientStats() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).with(LocalTime.MIN);
        LocalDateTime startOfWeek = now.minusDays(now.getDayOfWeek().getValue() - 1).with(LocalTime.MIN);
        LocalDateTime startOfDay = now.with(LocalTime.MIN);

        long totalPatients = patientRepository.count();
        long nouveauxPatientsCeMois = patientRepository.countByDateCreationAfter(startOfMonth);
        long nouveauxPatientsCetteSemaine = patientRepository.countByDateCreationAfter(startOfWeek);
        long nouveauxPatientsAujourdhui = patientRepository.countByDateCreationAfter(startOfDay);

        return PatientStatsDTO.builder()
            .totalPatients(totalPatients)
            .nouveauxPatientsCeMois(nouveauxPatientsCeMois)
            .nouveauxPatientsCetteSemaine(nouveauxPatientsCetteSemaine)
            .nouveauxPatientsAujourdhui(nouveauxPatientsAujourdhui)
            .distributionParAge(new HashMap<>())
            .evolutionMensuelle(new HashMap<>())
            .build();
    }

    
    public RendezVousStatsDTO getRendezVousStats() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).with(LocalTime.MIN);
        LocalDateTime startOfWeek = now.minusDays(now.getDayOfWeek().getValue() - 1).with(LocalTime.MIN);
        LocalDateTime startOfDay = now.with(LocalTime.MIN);
        LocalDateTime endOfDay = now.with(LocalTime.MAX);

        long totalRendezVous = rendezVousRepository.count();
        long rendezVousAujourdhui = rendezVousRepository.countByDateHeureBetween(startOfDay, endOfDay);
        long rendezVousCetteSemaine = rendezVousRepository.countByDateHeureBetween(startOfWeek, now);
        long rendezVousCeMois = rendezVousRepository.countByDateHeureBetween(startOfMonth, now);

        long planifies = rendezVousRepository.countByStatut(RendezVous.StatutRendezVous.PLANIFIE);
        long confirmes = rendezVousRepository.countByStatut(RendezVous.StatutRendezVous.CONFIRME);
        long termines = rendezVousRepository.countByStatut(RendezVous.StatutRendezVous.TERMINE);
        long annules = rendezVousRepository.countByStatut(RendezVous.StatutRendezVous.ANNULE);
        long absents = rendezVousRepository.countByStatut(RendezVous.StatutRendezVous.ABSENT);

        double tauxAnnulation = totalRendezVous > 0 ? (double) annules / totalRendezVous * 100 : 0;
        double tauxAbsence = totalRendezVous > 0 ? (double) absents / totalRendezVous * 100 : 0;
        double tauxCompletion = totalRendezVous > 0 ? (double) termines / totalRendezVous * 100 : 0;

        return RendezVousStatsDTO.builder()
            .totalRendezVous(totalRendezVous)
            .rendezVousAujourdhui(rendezVousAujourdhui)
            .rendezVousCetteSemaine(rendezVousCetteSemaine)
            .rendezVousCeMois(rendezVousCeMois)
            .planifies(planifies)
            .confirmes(confirmes)
            .termines(termines)
            .annules(annules)
            .absents(absents)
            .tauxAnnulation(Math.round(tauxAnnulation * 100.0) / 100.0)
            .tauxAbsence(Math.round(tauxAbsence * 100.0) / 100.0)
            .tauxCompletion(Math.round(tauxCompletion * 100.0) / 100.0)
            .parMedecin(new HashMap<>())
            .evolutionQuotidienne(new HashMap<>())
            .build();
    }

    
    public FinancialStatsDTO getFinancialStats() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfMonth = now.withDayOfMonth(1).with(LocalTime.MIN);
        LocalDateTime startOfWeek = now.minusDays(now.getDayOfWeek().getValue() - 1).with(LocalTime.MIN);
        LocalDateTime startOfDay = now.with(LocalTime.MIN);

        
        List<Facture> allFactures = factureRepository.findAll();
        Double chiffreAffairesTotal = allFactures.stream()
            .mapToDouble(f -> f.getMontantTotal() != null ? f.getMontantTotal() : 0.0)
            .sum();

        List<Facture> facturesMois = factureRepository.findByDateFacturationAfter(startOfMonth);
        Double chiffreAffairesMois = facturesMois.stream()
            .mapToDouble(f -> f.getMontantTotal() != null ? f.getMontantTotal() : 0.0)
            .sum();

        List<Facture> facturesSemaine = factureRepository.findByDateFacturationAfter(startOfWeek);
        Double chiffreAffairesSemaine = facturesSemaine.stream()
            .mapToDouble(f -> f.getMontantTotal() != null ? f.getMontantTotal() : 0.0)
            .sum();

        List<Facture> facturesAujourdhui = factureRepository.findByDateFacturationAfter(startOfDay);
        Double chiffreAffairesAujourdhui = facturesAujourdhui.stream()
            .mapToDouble(f -> f.getMontantTotal() != null ? f.getMontantTotal() : 0.0)
            .sum();

        
        List<Paiement> allPaiements = paiementRepository.findAll();
        Double totalPaye = allPaiements.stream()
            .mapToDouble(p -> p.getMontant() != null ? p.getMontant() : 0.0)
            .sum();

        Double totalImpaye = chiffreAffairesTotal - totalPaye;
        if (totalImpaye < 0) totalImpaye = 0.0;

        
        long totalFactures = allFactures.size();
        long facturesPayees = factureRepository.countByStatut(Facture.StatutFacture.PAYEE);
        long facturesPartiellementPayees = factureRepository.countByStatut(Facture.StatutFacture.PARTIELLEMENT_PAYEE);
        long facturesImpayees = factureRepository.countByStatut(Facture.StatutFacture.EN_ATTENTE);

        double tauxRecouvrement = chiffreAffairesTotal > 0 
            ? (totalPaye / chiffreAffairesTotal) * 100 
            : 0;

        return FinancialStatsDTO.builder()
            .chiffreAffairesTotal(chiffreAffairesTotal)
            .chiffreAffairesMois(chiffreAffairesMois)
            .chiffreAffairesSemaine(chiffreAffairesSemaine)
            .chiffreAffairesAujourdhui(chiffreAffairesAujourdhui)
            .totalPaye(totalPaye)
            .totalImpaye(totalImpaye)
            .montantEnRetard(0.0)
            .totalFactures(totalFactures)
            .facturesPayees(facturesPayees)
            .facturesPartiellementPayees(facturesPartiellementPayees)
            .facturesImpayees(facturesImpayees)
            .tauxRecouvrement(Math.round(tauxRecouvrement * 100.0) / 100.0)
            .parModePaiement(new HashMap<>())
            .evolutionMensuelle(new HashMap<>())
            .build();
    }

    
    public OccupationStatsDTO getOccupationStats() {
        List<Lit> allLits = litRepository.findAll();
        
        long totalLits = allLits.size();
        long litsDisponibles = allLits.stream().filter(l -> l.getStatut() == Lit.StatutLit.DISPONIBLE).count();
        long litsOccupes = allLits.stream().filter(l -> l.getStatut() == Lit.StatutLit.OCCUPE).count();
        long litsMaintenance = allLits.stream().filter(l -> l.getStatut() == Lit.StatutLit.MAINTENANCE).count();
        long litsReserves = allLits.stream().filter(l -> l.getStatut() == Lit.StatutLit.RESERVE).count();

        double tauxOccupation = totalLits > 0 ? (double) litsOccupes / totalLits * 100 : 0;

        
        Map<String, Long> litsParService = new HashMap<>();
        Map<String, Long> occupationParService = new HashMap<>();
        
        allLits.stream()
            .collect(java.util.stream.Collectors.groupingBy(Lit::getService, java.util.stream.Collectors.counting()))
            .forEach(litsParService::put);

        allLits.stream()
            .filter(l -> l.getStatut() == Lit.StatutLit.OCCUPE)
            .collect(java.util.stream.Collectors.groupingBy(Lit::getService, java.util.stream.Collectors.counting()))
            .forEach(occupationParService::put);

        long hospitalisationsEnCours = hospitalisationRepository.countByDateSortieIsNull();

        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).with(LocalTime.MIN);
        long hospitalisationsTermineesCeMois = hospitalisationRepository.countByDateSortieAfter(startOfMonth);

        return OccupationStatsDTO.builder()
            .totalLits(totalLits)
            .litsDisponibles(litsDisponibles)
            .litsOccupes(litsOccupes)
            .litsMaintenance(litsMaintenance)
            .litsReserves(litsReserves)
            .tauxOccupation(Math.round(tauxOccupation * 100.0) / 100.0)
            .litsParService(litsParService)
            .occupationParService(occupationParService)
            .tauxOccupationParService(new HashMap<>())
            .hospitalisationsEnCours(hospitalisationsEnCours)
            .hospitalisationsTermineesCeMois(hospitalisationsTermineesCeMois)
            .dureeMoyenneHospitalisation(0.0)
            .build();
    }
}
