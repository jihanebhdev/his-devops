package com.his.hub.document.dto;

import com.his.hub.document.entity.Document;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UploadDocumentRequest {
    
    @NotBlank(message = "Le nom du document est requis")
    private String nom;
    
    private Long patientId;
    
    private String description;
    
    private Document.CategorieDocument categorie = Document.CategorieDocument.GENERAL;
}

