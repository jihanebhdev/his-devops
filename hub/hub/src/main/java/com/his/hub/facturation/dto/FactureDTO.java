package com.his.hub.facturation.dto;

import com.his.hub.facturation.entity.Facture;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FactureDTO {
    private Long id;
    private Long patientId;
    private String patientNom;
    private String patientPrenom;
    private Long assuranceId;
    private String nomAssurance;
    private String numeroFacture;
    private LocalDateTime dateFacturation;
    private Double montantTotal;
    private Double montantAssurance;
    private Double montantPatient;
    private Facture.StatutFacture statut;
    private List<LigneFactureDTO> lignesFacture;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}

