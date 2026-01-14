package com.his.hub.statistics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RendezVousStatsDTO {
    
    private Long totalRendezVous;
    private Long rendezVousAujourdhui;
    private Long rendezVousCetteSemaine;
    private Long rendezVousCeMois;
    
    
    private Long planifies;
    private Long confirmes;
    private Long termines;
    private Long annules;
    private Long absents;
    
    
    private Double tauxAnnulation;
    private Double tauxAbsence;
    private Double tauxCompletion;
    
    
    private Map<String, Long> parMedecin;
    
    
    private Map<String, Long> evolutionQuotidienne;
}
