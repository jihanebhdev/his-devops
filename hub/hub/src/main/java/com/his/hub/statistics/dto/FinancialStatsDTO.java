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
public class FinancialStatsDTO {
    
    
    private Double chiffreAffairesTotal;
    private Double chiffreAffairesMois;
    private Double chiffreAffairesSemaine;
    private Double chiffreAffairesAujourdhui;
    
    
    private Double totalPaye;
    private Double totalImpaye;
    private Double montantEnRetard;
    
    
    private Long totalFactures;
    private Long facturesPayees;
    private Long facturesPartiellementPayees;
    private Long facturesImpayees;
    
    
    private Double tauxRecouvrement;
    
    
    private Map<String, Double> parModePaiement;
    
    
    private Map<String, Double> evolutionMensuelle;
}
