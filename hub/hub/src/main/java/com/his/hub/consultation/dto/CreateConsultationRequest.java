package com.his.hub.consultation.dto;

import com.his.hub.consultation.entity.Consultation;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateConsultationRequest {
    @NotNull(message = "L'ID du patient est requis")
    private Long patientId;

    @NotNull(message = "L'ID du médecin est requis")
    private Long medecinId;

    private LocalDateTime dateHeure;

    @Size(max = 2000, message = "Le motif ne peut pas dépasser 2000 caractères")
    private String motif;

    @Size(max = 2000, message = "L'examen clinique ne peut pas dépasser 2000 caractères")
    private String examenClinique;

    @Size(max = 2000, message = "Le diagnostic ne peut pas dépasser 2000 caractères")
    private String diagnostic;

    @Size(max = 2000, message = "La prescription ne peut pas dépasser 2000 caractères")
    private String prescription;

    @Size(max = 2000, message = "Les recommandations ne peuvent pas dépasser 2000 caractères")
    private String recommandations;

    private Consultation.TypeConsultation typeConsultation;
}

