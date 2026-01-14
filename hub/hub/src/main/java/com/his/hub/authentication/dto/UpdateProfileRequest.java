package com.his.hub.authentication.dto;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    
    private String nom;
    private String prenom;
    
    @Email(message = "Format d'email invalide")
    private String email;
    
    private String telephone;
}

