package com.his.hub.rendezvous.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateRendezVousRequest {
    @NotNull(message = "L'ID du patient est requis")
    private Long patientId;

    private Long medecinId;

    @NotNull(message = "La date et l'heure sont requises")
    @Future(message = "La date du rendez-vous doit être dans le futur")
    private LocalDateTime dateHeure;

    @Size(max = 1000, message = "Le motif ne peut pas dépasser 1000 caractères")
    private String motif;

    @Size(max = 1000, message = "Les notes ne peuvent pas dépasser 1000 caractères")
    private String notes;
}

