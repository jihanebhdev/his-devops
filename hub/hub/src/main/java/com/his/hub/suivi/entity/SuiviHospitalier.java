package com.his.hub.suivi.entity;

import com.his.hub.authentication.entity.Utilisateur;
import com.his.hub.hospitalisation.entity.Hospitalisation;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "suivis_hospitaliers")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SuiviHospitalier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "hospitalisation_id", nullable = false)
    private Hospitalisation hospitalisation;

    @ManyToOne
    @JoinColumn(name = "infirmier_id", nullable = false)
    private Utilisateur infirmier;

    @Column(nullable = false)
    private LocalDateTime dateHeure;

    @Column(length = 2000)
    private String observations;

    @Column(length = 2000)
    private String soinsAdministres;

    @Column(length = 2000)
    private String medicaments;

    @Column(length = 1000)
    private String etatPatient;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    @LastModifiedDate
    private LocalDateTime dateModification;
}

