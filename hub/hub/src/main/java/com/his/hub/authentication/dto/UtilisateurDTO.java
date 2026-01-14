package com.his.hub.authentication.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UtilisateurDTO {
    private Long id;
    private String username;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private Boolean actif;
    private Set<String> roles;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}

