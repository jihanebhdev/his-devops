package com.his.hub.consultation.dao;

import com.his.hub.consultation.entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    List<Consultation> findByPatientId(Long patientId);
    List<Consultation> findByMedecinId(Long medecinId);
    List<Consultation> findByDateHeureBetween(LocalDateTime start, LocalDateTime end);
    List<Consultation> findByTypeConsultation(Consultation.TypeConsultation typeConsultation);
    
    
    long countByDateHeureBetween(LocalDateTime start, LocalDateTime end);
    long countByMedecinId(Long medecinId);
    
    
    List<Consultation> findByDateHeureAfter(LocalDateTime date);
    List<Consultation> findByMedecinIdAndDateHeureBetween(Long medecinId, LocalDateTime start, LocalDateTime end);
}
