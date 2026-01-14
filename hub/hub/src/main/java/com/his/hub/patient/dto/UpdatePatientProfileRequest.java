package com.his.hub.patient.dto;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePatientProfileRequest {
    
    private String adresse;
    private String telephone;
    
    @Email(message = "Format d'email invalide")
    private String email;
}

