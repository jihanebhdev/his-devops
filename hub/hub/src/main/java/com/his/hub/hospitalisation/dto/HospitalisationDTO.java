package com.his.hub.hospitalisation.dto;

import com.his.hub.hospitalisation.entity.Hospitalisation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HospitalisationDTO {
    private Long id;
    private Long patientId;
    private String patientNom;
    private String patientPrenom;
    private Long medecinId;
    private String medecinNom;
    private String medecinPrenom;
    private Long litId;
    private String numeroLit;
    private String service;
    private String chambre;
    private LocalDateTime dateAdmission;
    private LocalDateTime dateSortie;
    private Hospitalisation.StatutHospitalisation statut;
    private String motifAdmission;
    private String diagnostic;
    private String notesSortie;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}

