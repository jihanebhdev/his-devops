package com.his.hub.dossiermedical.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateDossierMedicalRequest {
    @NotNull(message = "L'ID du patient est requis")
    private Long patientId;

    @Size(max = 2000, message = "L'historique médical ne peut pas dépasser 2000 caractères")
    private String historiqueMedical;

    @Size(max = 2000, message = "Les notes cliniques ne peuvent pas dépasser 2000 caractères")
    private String notesCliniques;

    @Size(max = 10, message = "Le groupe sanguin ne peut pas dépasser 10 caractères")
    private String groupeSanguin;

    @Size(max = 10, message = "Le rhésus ne peut pas dépasser 10 caractères")
    private String rhesus;
}

