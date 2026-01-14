package com.his.hub.document.dto;

import com.his.hub.document.entity.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DocumentDTO {
    
    private Long id;
    private String nom;
    private String nomFichier;
    private String typeMime;
    private Long taille;
    private Document.TypeDocument type;
    private Document.CategorieDocument categorie;
    private String description;
    private Long patientId;
    private String patientNom;
    private String patientPrenom;
    private Long uploadedById;
    private String uploadedByUsername;
    private String downloadUrl;
    private LocalDateTime dateCreation;
    private LocalDateTime dateModification;
}

