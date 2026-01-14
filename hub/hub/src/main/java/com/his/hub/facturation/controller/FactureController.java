package com.his.hub.facturation.controller;

import com.his.hub.common.dto.ApiResponse;
import com.his.hub.common.service.PatientAccessValidationService;
import com.his.hub.facturation.dto.CreateFactureRequest;
import com.his.hub.facturation.dto.FactureDTO;
import com.his.hub.facturation.service.FactureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/factures")
@RequiredArgsConstructor
public class FactureController {

    private final FactureService factureService;
    private final PatientAccessValidationService patientAccessValidationService;

    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'COMPTABLE', 'DIRECTEUR')")
    public ResponseEntity<ApiResponse<java.util.List<FactureDTO>>> getAllFactures() {
        java.util.List<FactureDTO> factures = factureService.getAllFactures();
        return ResponseEntity.ok(ApiResponse.success(factures));
    }

    
    @GetMapping("/impayees")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'COMPTABLE')")
    public ResponseEntity<ApiResponse<java.util.List<FactureDTO>>> getFacturesImpayees() {
        java.util.List<FactureDTO> factures = factureService.getFacturesImpayees();
        return ResponseEntity.ok(ApiResponse.success(factures));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'COMPTABLE')")
    public ResponseEntity<ApiResponse<FactureDTO>> creerFacture(@RequestBody CreateFactureRequest request) {
        FactureDTO facture = factureService.creerFacture(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Facture créée avec succès", facture));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'COMPTABLE', 'PATIENT')")
    public ResponseEntity<ApiResponse<FactureDTO>> getFactureById(@PathVariable Long id) {
        FactureDTO facture = factureService.getFactureById(id);
        
        if (facture != null && facture.getPatientId() != null) {
            patientAccessValidationService.validatePatientAccess(facture.getPatientId());
        }
        return ResponseEntity.ok(ApiResponse.success(facture));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'COMPTABLE', 'PATIENT')")
    public ResponseEntity<ApiResponse<List<FactureDTO>>> getFacturesByPatientId(@PathVariable Long patientId) {
        
        patientAccessValidationService.validatePatientAccess(patientId);
        List<FactureDTO> factures = factureService.getFacturesByPatientId(patientId);
        return ResponseEntity.ok(ApiResponse.success(factures));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'COMPTABLE')")
    public ResponseEntity<ApiResponse<Void>> supprimerFacture(@PathVariable Long id) {
        factureService.supprimerFacture(id);
        return ResponseEntity.ok(ApiResponse.success("Facture supprimée avec succès", null));
    }
}

