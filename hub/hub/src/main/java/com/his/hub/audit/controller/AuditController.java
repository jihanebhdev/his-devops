package com.his.hub.audit.controller;

import com.his.hub.audit.dto.AuditLogDTO;
import com.his.hub.audit.entity.AuditLog;
import com.his.hub.audit.service.AuditService;
import com.his.hub.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;

    
    @GetMapping("/logs")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<Page<AuditLogDTO>>> getAllAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLogDTO> logs = auditService.getAllAuditLogs(pageable);
        return ResponseEntity.ok(ApiResponse.success(logs));
    }

    
    @GetMapping("/logs/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<AuditLogDTO>> getAuditLogById(@PathVariable Long id) {
        AuditLogDTO log = auditService.getAuditLogById(id);
        return ResponseEntity.ok(ApiResponse.success(log));
    }

    
    @GetMapping("/utilisateur/{utilisateurId}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<List<AuditLogDTO>>> getAuditLogsByUser(@PathVariable Long utilisateurId) {
        List<AuditLogDTO> logs = auditService.getAuditLogsByUser(utilisateurId);
        return ResponseEntity.ok(ApiResponse.success(logs));
    }

    
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'DIRECTEUR')")
    public ResponseEntity<ApiResponse<List<AuditLogDTO>>> getAuditLogsForPatient(@PathVariable Long patientId) {
        List<AuditLogDTO> logs = auditService.getAuditLogsByEntity("Patient", patientId);
        return ResponseEntity.ok(ApiResponse.success(logs));
    }

    
    @GetMapping("/entity/{entityType}/{entityId}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<List<AuditLogDTO>>> getAuditLogsByEntity(
            @PathVariable String entityType,
            @PathVariable Long entityId) {
        List<AuditLogDTO> logs = auditService.getAuditLogsByEntity(entityType, entityId);
        return ResponseEntity.ok(ApiResponse.success(logs));
    }

    
    @GetMapping("/action/{action}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<List<AuditLogDTO>>> getAuditLogsByAction(
            @PathVariable AuditLog.ActionType action) {
        List<AuditLogDTO> logs = auditService.getAuditLogsByAction(action);
        return ResponseEntity.ok(ApiResponse.success(logs));
    }

    
    @GetMapping("/date-range")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<Page<AuditLogDTO>>> getAuditLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AuditLogDTO> logs = auditService.getAuditLogsByDateRange(start, end, pageable);
        return ResponseEntity.ok(ApiResponse.success(logs));
    }
}

