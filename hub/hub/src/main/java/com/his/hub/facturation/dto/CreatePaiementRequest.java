package com.his.hub.facturation.dto;

import com.his.hub.facturation.entity.Paiement;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePaiementRequest {
    @NotNull(message = "L'ID de la facture est requis")
    private Long factureId;

    @NotNull(message = "Le montant est requis")
    @Positive(message = "Le montant doit être positif")
    private Double montant;

    private LocalDateTime datePaiement;

    @NotNull(message = "Le mode de paiement est requis")
    private Paiement.ModePaiement modePaiement;

    @Size(max = 100, message = "La référence de transaction ne peut pas dépasser 100 caractères")
    private String referenceTransaction;

    @Size(max = 1000, message = "Les notes ne peuvent pas dépasser 1000 caractères")
    private String notes;
}

