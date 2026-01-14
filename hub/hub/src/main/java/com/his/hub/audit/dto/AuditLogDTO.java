package com.his.hub.audit.dto;

import com.his.hub.audit.entity.AuditLog;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogDTO {
    
    private Long id;
    private Long utilisateurId;
    private String utilisateurUsername;
    private AuditLog.ActionType action;
    private String entityType;
    private Long entityId;
    private String description;
    private String oldValue;
    private String newValue;
    private String ipAddress;
    private String userAgent;
    private LocalDateTime dateAction;
}

