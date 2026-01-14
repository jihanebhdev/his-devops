package com.his.hub.hospitalisation.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "lits")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Lit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String numeroLit;

    @Column(nullable = false)
    private String service; 

    @Column(nullable = false)
    private String chambre;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutLit statut;

    @Column(length = 1000)
    private String notes;

    public enum StatutLit {
        DISPONIBLE, OCCUPE, MAINTENANCE, RESERVE
    }
}

