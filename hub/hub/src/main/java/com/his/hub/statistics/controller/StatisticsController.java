package com.his.hub.statistics.controller;

import com.his.hub.common.dto.ApiResponse;
import com.his.hub.statistics.dto.*;
import com.his.hub.statistics.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsService;

    
    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'DIRECTEUR')")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboardStats() {
        DashboardStatsDTO stats = statisticsService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    
    @GetMapping("/patients")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'DIRECTEUR', 'AGENT_ACCUEIL')")
    public ResponseEntity<ApiResponse<PatientStatsDTO>> getPatientStats() {
        PatientStatsDTO stats = statisticsService.getPatientStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    
    @GetMapping("/rendezvous")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'DIRECTEUR', 'AGENT_ACCUEIL', 'MEDECIN')")
    public ResponseEntity<ApiResponse<RendezVousStatsDTO>> getRendezVousStats() {
        RendezVousStatsDTO stats = statisticsService.getRendezVousStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    
    @GetMapping("/facturation")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'DIRECTEUR', 'COMPTABLE')")
    public ResponseEntity<ApiResponse<FinancialStatsDTO>> getFinancialStats() {
        FinancialStatsDTO stats = statisticsService.getFinancialStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    
    @GetMapping("/occupation")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'DIRECTEUR', 'MEDECIN', 'INFIRMIER', 'AGENT_ACCUEIL')")
    public ResponseEntity<ApiResponse<OccupationStatsDTO>> getOccupationStats() {
        OccupationStatsDTO stats = statisticsService.getOccupationStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}

