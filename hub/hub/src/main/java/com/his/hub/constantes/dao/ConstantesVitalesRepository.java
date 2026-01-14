package com.his.hub.constantes.dao;

import com.his.hub.constantes.entity.ConstantesVitales;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ConstantesVitalesRepository extends JpaRepository<ConstantesVitales, Long> {
    List<ConstantesVitales> findByPatientId(Long patientId);
    List<ConstantesVitales> findByPatientIdOrderByDateHeureDesc(Long patientId);
    List<ConstantesVitales> findByDateHeureBetween(LocalDateTime start, LocalDateTime end);
}

