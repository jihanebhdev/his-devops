package com.his.hub.facturation.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssuranceDTO {
    private Long id;
    private Long patientId;
    private String patientNom;
    private String patientPrenom;
    private String nomAssurance;
    private String numeroContrat;
    private Double tauxCouverture;
    private Boolean actif;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}

