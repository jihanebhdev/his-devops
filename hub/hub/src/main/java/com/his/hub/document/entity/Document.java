package com.his.hub.document.entity;

import com.his.hub.authentication.entity.Utilisateur;
import com.his.hub.patient.entity.Patient;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false)
    private String nomFichier;

    @Column(nullable = false)
    private String typeMime;

    private Long taille; 

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeDocument type = TypeDocument.AUTRE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategorieDocument categorie = CategorieDocument.GENERAL;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by")
    private Utilisateur uploadedBy;

    @Column(nullable = false)
    private String cheminFichier; 

    @Column(nullable = false)
    private Boolean actif = true;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @LastModifiedDate
    private LocalDateTime dateModification;

    public enum TypeDocument {
        PDF,
        IMAGE,
        WORD,
        EXCEL,
        DICOM,
        AUTRE
    }

    public enum CategorieDocument {
        GENERAL,
        RESULTAT_LABO,
        RADIOLOGIE,
        ORDONNANCE,
        COMPTE_RENDU,
        CERTIFICAT_MEDICAL,
        FORMULAIRE,
        CONSENTEMENT,
        ASSURANCE,
        IDENTITE,
        AUTRE
    }
}

