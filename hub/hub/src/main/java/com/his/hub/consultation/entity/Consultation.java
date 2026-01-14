package com.his.hub.consultation.entity;

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
@Table(name = "consultations")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Consultation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "medecin_id", nullable = false)
    private Utilisateur medecin;

    @Column(nullable = false)
    private LocalDateTime dateHeure;

    @Column(length = 2000)
    private String motif;

    @Column(length = 2000)
    private String examenClinique;

    @Column(length = 2000)
    private String diagnostic;

    @Column(length = 2000)
    private String prescription;

    @Column(length = 2000)
    private String recommandations;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeConsultation typeConsultation;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @LastModifiedDate
    private LocalDateTime dateModification;

    public enum TypeConsultation {
        CONSULTATION_GENERALE, CONSULTATION_SPECIALISEE, URGENCE, SUIVI
    }
}

