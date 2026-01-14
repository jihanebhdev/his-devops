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
public class OccupationStatsDTO {
    
    
    private Long totalLits;
    private Long litsDisponibles;
    private Long litsOccupes;
    private Long litsMaintenance;
    private Long litsReserves;
    private Double tauxOccupation;
    
    
    private Map<String, Long> litsParService;
    private Map<String, Long> occupationParService;
    private Map<String, Double> tauxOccupationParService;
    
    
    private Long hospitalisationsEnCours;
    private Long hospitalisationsTermineesCeMois;
    private Double dureeMoyenneHospitalisation;
}
