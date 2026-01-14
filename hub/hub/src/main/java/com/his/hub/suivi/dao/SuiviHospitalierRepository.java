package com.his.hub.suivi.dao;

import com.his.hub.suivi.entity.SuiviHospitalier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SuiviHospitalierRepository extends JpaRepository<SuiviHospitalier, Long> {
    List<SuiviHospitalier> findByHospitalisationId(Long hospitalisationId);
    List<SuiviHospitalier> findByHospitalisationIdOrderByDateHeureDesc(Long hospitalisationId);
    List<SuiviHospitalier> findByInfirmierId(Long infirmierId);
}

