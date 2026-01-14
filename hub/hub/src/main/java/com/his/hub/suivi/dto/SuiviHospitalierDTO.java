package com.his.hub.suivi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SuiviHospitalierDTO {
    private Long id;
    private Long hospitalisationId;
    private Long patientId;
    private String patientNom;
    private String patientPrenom;
    private Long infirmierId;
    private String infirmierNom;
    private String infirmierPrenom;
    private LocalDateTime dateHeure;
    private String observations;
    private String soinsAdministres;
    private String medicaments;
    private String etatPatient;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}

