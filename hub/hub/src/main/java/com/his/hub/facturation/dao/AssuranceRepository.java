package com.his.hub.facturation.dao;

import com.his.hub.facturation.entity.Assurance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssuranceRepository extends JpaRepository<Assurance, Long> {
    List<Assurance> findByPatientId(Long patientId);
    List<Assurance> findByPatientIdAndActifTrue(Long patientId);
}

