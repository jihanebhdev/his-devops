package com.his.hub.rendezvous.dao;

import com.his.hub.rendezvous.entity.RendezVous;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RendezVousRepository extends JpaRepository<RendezVous, Long> {
    List<RendezVous> findByPatientId(Long patientId);
    List<RendezVous> findByMedecinId(Long medecinId);
    List<RendezVous> findByDateHeureBetween(LocalDateTime start, LocalDateTime end);
    List<RendezVous> findByStatut(RendezVous.StatutRendezVous statut);
    
    
    long countByStatut(RendezVous.StatutRendezVous statut);
    long countByDateHeureBetween(LocalDateTime start, LocalDateTime end);
    
    
    List<RendezVous> findByDateHeureAfter(LocalDateTime date);
    List<RendezVous> findByDateHeureAfterOrderByDateHeureAsc(LocalDateTime date);
    List<RendezVous> findByMedecinIdAndDateHeureBetween(Long medecinId, LocalDateTime start, LocalDateTime end);
    List<RendezVous> findByPatientIdAndDateHeureAfter(Long patientId, LocalDateTime date);
}
