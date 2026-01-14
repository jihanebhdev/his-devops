package com.his.hub.notification.entity;

import com.his.hub.authentication.entity.Utilisateur;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateur utilisateur;

    @Column(nullable = false)
    private String titre;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeNotification type = TypeNotification.INFO;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CategorieNotification categorie = CategorieNotification.SYSTEME;

    @Column(nullable = false)
    private Boolean lu = false;

    private LocalDateTime dateLecture;

    @Column(name = "reference_id")
    private Long referenceId;

    @Column(name = "reference_type")
    private String referenceType;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime dateCreation;

    public enum TypeNotification {
        INFO,
        SUCCESS,
        WARNING,
        ERROR,
        URGENT
    }

    public enum CategorieNotification {
        SYSTEME,
        RENDEZ_VOUS,
        CONSULTATION,
        HOSPITALISATION,
        FACTURE,
        PAIEMENT,
        DOCUMENT,
        RAPPEL
    }
}

