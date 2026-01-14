package com.his.hub.facturation.dto;

import com.his.hub.facturation.entity.Paiement;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaiementDTO {
    private Long id;
    private Long factureId;
    private String numeroFacture;
    private Long patientId;
    private String patientNom;
    private String patientPrenom;
    private Double montant;
    private LocalDateTime datePaiement;
    private Paiement.ModePaiement modePaiement;
    private String referenceTransaction;
    private String notes;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}

