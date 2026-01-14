package com.his.hub.facturation.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateFactureRequest {
    @NotNull(message = "L'ID du patient est requis")
    private Long patientId;

    private Long assuranceId;

    private LocalDateTime dateFacturation;

    @NotEmpty(message = "Au moins une ligne de facture est requise")
    @Valid
    private List<LigneFactureDTO> lignesFacture;
}

