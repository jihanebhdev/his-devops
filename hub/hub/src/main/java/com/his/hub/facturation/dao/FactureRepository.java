package com.his.hub.facturation.dao;

import com.his.hub.facturation.entity.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {
    Optional<Facture> findByNumeroFacture(String numeroFacture);
    List<Facture> findByPatientId(Long patientId);
    List<Facture> findByStatut(Facture.StatutFacture statut);
    List<Facture> findByDateFacturationBetween(LocalDateTime start, LocalDateTime end);
    
    
    long countByStatut(Facture.StatutFacture statut);
    List<Facture> findByDateFacturationAfter(LocalDateTime date);
    
    
    List<Facture> findByPatientIdAndStatut(Long patientId, Facture.StatutFacture statut);
    List<Facture> findAllByOrderByDateFacturationDesc();
}
