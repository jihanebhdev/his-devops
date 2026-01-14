package com.his.hub.hospitalisation.dao;

import com.his.hub.hospitalisation.entity.Hospitalisation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface HospitalisationRepository extends JpaRepository<Hospitalisation, Long> {
    List<Hospitalisation> findByPatientId(Long patientId);
    List<Hospitalisation> findByMedecinId(Long medecinId);
    List<Hospitalisation> findByLitId(Long litId);
    List<Hospitalisation> findByStatut(Hospitalisation.StatutHospitalisation statut);
    Optional<Hospitalisation> findByPatientIdAndStatut(Long patientId, Hospitalisation.StatutHospitalisation statut);
    
    
    long countByDateSortieIsNull();
    long countByDateSortieAfter(LocalDateTime date);
    List<Hospitalisation> findByDateSortieIsNull();
    
    
    List<Hospitalisation> findByDateAdmissionBetween(LocalDateTime start, LocalDateTime end);
    List<Hospitalisation> findByDateSortieIsNullOrderByDateAdmissionDesc();
}
