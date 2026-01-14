package com.his.hub.hospitalisation.entity;

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
@Table(name = "hospitalisations")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hospitalisation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "medecin_id", nullable = false)
    private Utilisateur medecin;

    @ManyToOne
    @JoinColumn(name = "lit_id", nullable = false)
    private Lit lit;

    @Column(nullable = false)
    private LocalDateTime dateAdmission;

    private LocalDateTime dateSortie;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutHospitalisation statut;

    @Column(length = 2000)
    private String motifAdmission;

    @Column(length = 2000)
    private String diagnostic;

    @Column(length = 2000)
    private String notesSortie;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @LastModifiedDate
    private LocalDateTime dateModification;

    public enum StatutHospitalisation {
        EN_COURS, SORTIE, TRANSFERT, DECES
    }
}

