package com.his.hub.patient.dao;

import com.his.hub.patient.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Optional<Patient> findByNumeroIdentification(String numeroIdentification);
    boolean existsByNumeroIdentification(String numeroIdentification);
    List<Patient> findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(String nom, String prenom);
    List<Patient> findByActifTrue();
    Optional<Patient> findByUtilisateurId(Long utilisateurId);
    
    
    long countByDateCreationAfter(LocalDateTime date);
}
