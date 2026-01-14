package com.his.hub.dossiermedical.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DossierMedicalDTO {
    private Long id;
    private Long patientId;
    private String patientNom;
    private String patientPrenom;
    private String historiqueMedical;
    private String notesCliniques;
    private String groupeSanguin;
    private String rhesus;
    private Boolean actif;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}

