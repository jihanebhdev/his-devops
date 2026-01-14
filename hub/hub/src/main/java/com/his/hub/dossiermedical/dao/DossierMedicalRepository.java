package com.his.hub.dossiermedical.dao;

import com.his.hub.dossiermedical.entity.DossierMedical;
import com.his.hub.patient.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DossierMedicalRepository extends JpaRepository<DossierMedical, Long> {
    Optional<DossierMedical> findByPatient(Patient patient);
    Optional<DossierMedical> findByPatientId(Long patientId);
    boolean existsByPatientId(Long patientId);
}

