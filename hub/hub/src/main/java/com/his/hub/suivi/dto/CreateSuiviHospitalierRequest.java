package com.his.hub.suivi.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateSuiviHospitalierRequest {
    @NotNull(message = "L'ID de l'hospitalisation est requis")
    private Long hospitalisationId;

    @NotNull(message = "L'ID de l'infirmier est requis")
    private Long infirmierId;

    private LocalDateTime dateHeure;

    @Size(max = 2000, message = "Les observations ne peuvent pas dépasser 2000 caractères")
    private String observations;

    @Size(max = 2000, message = "Les soins administrés ne peuvent pas dépasser 2000 caractères")
    private String soinsAdministres;

    @Size(max = 2000, message = "Les médicaments ne peuvent pas dépasser 2000 caractères")
    private String medicaments;

    @Size(max = 1000, message = "L'état du patient ne peut pas dépasser 1000 caractères")
    private String etatPatient;
}

