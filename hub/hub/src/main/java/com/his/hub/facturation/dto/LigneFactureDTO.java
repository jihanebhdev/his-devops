package com.his.hub.facturation.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LigneFactureDTO {
    private Long id;

    @NotBlank(message = "La description est requise")
    @Size(max = 500, message = "La description ne peut pas dépasser 500 caractères")
    private String description;

    @NotNull(message = "La quantité est requise")
    @Positive(message = "La quantité doit être positive")
    private Integer quantite;

    @NotNull(message = "Le prix unitaire est requis")
    @Min(value = 0, message = "Le prix unitaire doit être positif ou nul")
    private Double prixUnitaire;

    private Double montantTotal;
}

