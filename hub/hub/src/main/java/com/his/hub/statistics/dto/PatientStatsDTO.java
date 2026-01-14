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
public class PatientStatsDTO {
    
    private Long totalPatients;
    private Long nouveauxPatientsCeMois;
    private Long nouveauxPatientsCetteSemaine;
    private Long nouveauxPatientsAujourdhui;
    
    
    private Map<String, Long> distributionParAge;
    
    
    private Map<String, Long> evolutionMensuelle;
}
