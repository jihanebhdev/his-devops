package com.his.hub.consultation.dto;

import com.his.hub.consultation.entity.Consultation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationDTO {
    private Long id;
    private Long patientId;
    private String patientNom;
    private String patientPrenom;
    private Long medecinId;
    private String medecinNom;
    private String medecinPrenom;
    private LocalDateTime dateHeure;
    private String motif;
    private String examenClinique;
    private String diagnostic;
    private String prescription;
    private String recommandations;
    private Consultation.TypeConsultation typeConsultation;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}

