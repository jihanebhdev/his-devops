package com.his.hub.audit.service;

import com.his.hub.audit.dao.AuditLogRepository;
import com.his.hub.audit.dto.AuditLogDTO;
import com.his.hub.audit.entity.AuditLog;
import com.his.hub.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    
    public void logAction(AuditLog.ActionType action, String entityType, Long entityId, 
                         String description, String oldValue, String newValue,
                         String ipAddress, String userAgent) {
        AuditLog auditLog = new AuditLog();
        
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && 
            !authentication.getName().equals("anonymousUser")) {
            auditLog.setUtilisateurUsername(authentication.getName());
        }
        
        auditLog.setAction(action);
        auditLog.setEntityType(entityType);
        auditLog.setEntityId(entityId);
        auditLog.setDescription(description);
        auditLog.setOldValue(oldValue);
        auditLog.setNewValue(newValue);
        auditLog.setIpAddress(ipAddress);
        auditLog.setUserAgent(userAgent);
        
        auditLogRepository.save(auditLog);
    }

    
    public void logAction(AuditLog.ActionType action, String entityType, Long entityId, String description) {
        logAction(action, entityType, entityId, description, null, null, null, null);
    }

    
    @Transactional(readOnly = true)
    public Page<AuditLogDTO> getAllAuditLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByDateActionDesc(pageable)
            .map(this::toDTO);
    }

    
    @Transactional(readOnly = true)
    public List<AuditLogDTO> getAuditLogsByUser(Long utilisateurId) {
        return auditLogRepository.findByUtilisateurIdOrderByDateActionDesc(utilisateurId)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    
    @Transactional(readOnly = true)
    public List<AuditLogDTO> getAuditLogsByEntity(String entityType, Long entityId) {
        return auditLogRepository.findByEntityTypeAndEntityIdOrderByDateActionDesc(entityType, entityId)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    
    @Transactional(readOnly = true)
    public List<AuditLogDTO> getAuditLogsByAction(AuditLog.ActionType action) {
        return auditLogRepository.findByActionOrderByDateActionDesc(action)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    
    @Transactional(readOnly = true)
    public Page<AuditLogDTO> getAuditLogsByDateRange(LocalDateTime start, LocalDateTime end, Pageable pageable) {
        return auditLogRepository.findByDateActionBetweenOrderByDateActionDesc(start, end, pageable)
            .map(this::toDTO);
    }

    
    @Transactional(readOnly = true)
    public AuditLogDTO getAuditLogById(Long id) {
        AuditLog auditLog = auditLogRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Log d'audit non trouvé"));
        return toDTO(auditLog);
    }

    private AuditLogDTO toDTO(AuditLog auditLog) {
        AuditLogDTO dto = new AuditLogDTO();
        dto.setId(auditLog.getId());
        dto.setUtilisateurId(auditLog.getUtilisateurId());
        dto.setUtilisateurUsername(auditLog.getUtilisateurUsername());
        dto.setAction(auditLog.getAction());
        dto.setEntityType(auditLog.getEntityType());
        dto.setEntityId(auditLog.getEntityId());
        dto.setDescription(auditLog.getDescription());
        dto.setOldValue(auditLog.getOldValue());
        dto.setNewValue(auditLog.getNewValue());
        dto.setIpAddress(auditLog.getIpAddress());
        dto.setUserAgent(auditLog.getUserAgent());
        dto.setDateAction(auditLog.getDateAction());
        return dto;
    }
}

