package com.his.hub.patient.dto;

import com.his.hub.patient.entity.Patient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PatientDTO {
    private Long id;
    private String nom;
    private String prenom;
    private LocalDate dateNaissance;
    private Patient.Sexe sexe;
    private String numeroIdentification;
    private String adresse;
    private String telephone;
    private String email;
    private String antecedentsMedicaux;
    private String allergies;
    private Boolean actif;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}

