package com.his.hub.audit.dao;

import com.his.hub.audit.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    
    List<AuditLog> findByUtilisateurIdOrderByDateActionDesc(Long utilisateurId);
    
    Page<AuditLog> findByUtilisateurIdOrderByDateActionDesc(Long utilisateurId, Pageable pageable);
    
    List<AuditLog> findByEntityTypeAndEntityIdOrderByDateActionDesc(String entityType, Long entityId);
    
    Page<AuditLog> findAllByOrderByDateActionDesc(Pageable pageable);
    
    List<AuditLog> findByActionOrderByDateActionDesc(AuditLog.ActionType action);
    
    List<AuditLog> findByDateActionBetweenOrderByDateActionDesc(LocalDateTime start, LocalDateTime end);
    
    Page<AuditLog> findByDateActionBetweenOrderByDateActionDesc(LocalDateTime start, LocalDateTime end, Pageable pageable);
    
    List<AuditLog> findByUtilisateurIdAndDateActionBetweenOrderByDateActionDesc(
        Long utilisateurId, 
        LocalDateTime start, 
        LocalDateTime end
    );
    
    long countByAction(AuditLog.ActionType action);
    
    long countByDateActionAfter(LocalDateTime date);
}

