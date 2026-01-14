package com.his.hub.report.controller;

import com.his.hub.common.dto.ApiResponse;
import com.his.hub.common.service.PatientAccessValidationService;
import com.his.hub.report.dto.PatientSummaryReport;
import com.his.hub.report.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;
    private final PatientAccessValidationService patientAccessValidationService;

    
    @GetMapping("/patient/{patientId}/summary")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'MEDECIN', 'INFIRMIER', 'DIRECTEUR', 'PATIENT')")
    public ResponseEntity<ApiResponse<PatientSummaryReport>> getPatientSummary(@PathVariable Long patientId) {
        
        patientAccessValidationService.validatePatientAccess(patientId);
        
        PatientSummaryReport report = reportService.generatePatientSummary(patientId);
        return ResponseEntity.ok(ApiResponse.success(report));
    }

    
    @GetMapping("/patient/{patientId}/summary/export")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'MEDECIN', 'DIRECTEUR')")
    public ResponseEntity<ApiResponse<PatientSummaryReport>> exportPatientSummary(@PathVariable Long patientId) {
        PatientSummaryReport report = reportService.generatePatientSummary(patientId);
        return ResponseEntity.ok(ApiResponse.success("Rapport généré avec succès", report));
    }
}

