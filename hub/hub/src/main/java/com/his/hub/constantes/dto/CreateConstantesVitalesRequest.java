package com.his.hub.constantes.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateConstantesVitalesRequest {
    @NotNull(message = "L'ID du patient est requis")
    private Long patientId;

    private Long infirmierId;

    private LocalDateTime dateHeure;

    @Min(value = 30, message = "La température doit être au moins 30°C")
    @Max(value = 45, message = "La température ne peut pas dépasser 45°C")
    private Double temperature;

    @Min(value = 50, message = "La tension systolique doit être au moins 50")
    @Max(value = 250, message = "La tension systolique ne peut pas dépasser 250")
    private Integer tensionArterielleSystolique;

    @Min(value = 30, message = "La tension diastolique doit être au moins 30")
    @Max(value = 150, message = "La tension diastolique ne peut pas dépasser 150")
    private Integer tensionArterielleDiastolique;

    @Min(value = 30, message = "La fréquence cardiaque doit être au moins 30 bpm")
    @Max(value = 200, message = "La fréquence cardiaque ne peut pas dépasser 200 bpm")
    private Integer frequenceCardiaque;

    @Min(value = 8, message = "La fréquence respiratoire doit être au moins 8 rpm")
    @Max(value = 40, message = "La fréquence respiratoire ne peut pas dépasser 40 rpm")
    private Integer frequenceRespiratoire;

    @Min(value = 0, message = "Le poids doit être positif")
    @Max(value = 300, message = "Le poids ne peut pas dépasser 300 kg")
    private Double poids;

    @Min(value = 0, message = "La taille doit être positive")
    @Max(value = 250, message = "La taille ne peut pas dépasser 250 cm")
    private Double taille;

    @Min(value = 0, message = "La glycémie doit être positive")
    @Max(value = 30, message = "La glycémie ne peut pas dépasser 30 mmol/L")
    private Double glycemie;

    @Min(value = 0, message = "La saturation en oxygène doit être positive")
    @Max(value = 100, message = "La saturation en oxygène ne peut pas dépasser 100%")
    private Double saturationOxygene;

    @Size(max = 1000, message = "Les notes ne peuvent pas dépasser 1000 caractères")
    private String notes;
}

