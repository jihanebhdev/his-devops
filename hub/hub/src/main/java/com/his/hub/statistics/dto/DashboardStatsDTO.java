package com.his.hub.statistics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {
    
    
    private Long totalPatients;
    private Long nouveauxPatientsCeMois;
    private Long patientsActifs;
    
    
    private Long totalRendezVous;
    private Long rendezVousAujourdhui;
    private Long rendezVousEnAttente;
    private Long rendezVousConfirmes;
    private Long rendezVousTermines;
    private Long rendezVousAnnules;
    
    
    private Long totalConsultations;
    private Long consultationsAujourdhui;
    private Long consultationsCetteSemaine;
    private Long consultationsCeMois;
    
    
    private Long hospitalisationsEnCours;
    private Long litsDisponibles;
    private Long litsOccupes;
    private Long totalLits;
    private Double tauxOccupation;
    
    
    private Long totalUtilisateurs;
    private Long totalMedecins;
    private Long totalInfirmiers;
    
    
    private Double chiffreAffairesMois;
    private Double montantImpaye;
    private Long facturesEnAttente;
    private Long facturesPayees;
}
