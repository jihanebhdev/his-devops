package com.his.hub.rendezvous.dto;

import com.his.hub.rendezvous.entity.RendezVous;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RendezVousDTO {
    private Long id;
    private Long patientId;
    private String patientNom;
    private String patientPrenom;
    private Long medecinId;
    private String medecinNom;
    private String medecinPrenom;
    private LocalDateTime dateHeure;
    private RendezVous.StatutRendezVous statut;
    private String motif;
    private String notes;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}

