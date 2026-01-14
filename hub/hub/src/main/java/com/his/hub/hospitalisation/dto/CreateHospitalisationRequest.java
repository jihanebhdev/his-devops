package com.his.hub.hospitalisation.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateHospitalisationRequest {
    @NotNull(message = "L'ID du patient est requis")
    private Long patientId;

    @NotNull(message = "L'ID du médecin est requis")
    private Long medecinId;

    @NotNull(message = "L'ID du lit est requis")
    private Long litId;

    private LocalDateTime dateAdmission;

    @Size(max = 2000, message = "Le motif d'admission ne peut pas dépasser 2000 caractères")
    private String motifAdmission;

    @Size(max = 2000, message = "Le diagnostic ne peut pas dépasser 2000 caractères")
    private String diagnostic;
}

