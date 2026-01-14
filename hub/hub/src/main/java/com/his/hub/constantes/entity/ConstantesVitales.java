package com.his.hub.constantes.entity;

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
@Table(name = "constantes_vitales")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConstantesVitales {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "infirmier_id")
    private Utilisateur infirmier;

    @Column(nullable = false)
    private LocalDateTime dateHeure;

    private Double temperature; 
    private Integer tensionArterielleSystolique;
    private Integer tensionArterielleDiastolique;
    private Integer frequenceCardiaque; 
    private Integer frequenceRespiratoire; 
    private Double poids; 
    private Double taille; 
    private Double glycemie; 
    private Double saturationOxygene; 

    @Column(length = 1000)
    private String notes;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @LastModifiedDate
    private LocalDateTime dateModification;
}

