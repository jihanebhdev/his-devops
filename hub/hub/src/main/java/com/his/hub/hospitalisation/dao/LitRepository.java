package com.his.hub.hospitalisation.dao;

import com.his.hub.hospitalisation.entity.Lit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LitRepository extends JpaRepository<Lit, Long> {
    Optional<Lit> findByNumeroLit(String numeroLit);
    List<Lit> findByStatut(Lit.StatutLit statut);
    List<Lit> findByService(String service);
    List<Lit> findByStatutAndService(Lit.StatutLit statut, String service);
}

