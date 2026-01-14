package com.his.hub.constantes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConstantesVitalesDTO {
    private Long id;
    private Long patientId;
    private String patientNom;
    private String patientPrenom;
    private Long infirmierId;
    private String infirmierNom;
    private String infirmierPrenom;
    private LocalDateTime dateHeure;
    private Double temperature;
    private Integer tensionArterielleSystolique;
    private Integer tensionArterielleDiastolique;
    private Integer frequenceCardiaque;
    private Integer frequenceRespiratoire;
    private Double poids;
    private Double taille;
    private Double glycemie;
    private Double saturationOxygene;
    private String notes;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}

