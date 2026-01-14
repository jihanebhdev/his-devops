package com.his.hub.facturation.controller;

import com.his.hub.common.dto.ApiResponse;
import com.his.hub.common.service.PatientAccessValidationService;
import com.his.hub.facturation.dto.AssuranceDTO;
import com.his.hub.facturation.service.AssuranceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assurances")
@RequiredArgsConstructor
public class AssuranceController {

    private final AssuranceService assuranceService;
    private final PatientAccessValidationService patientAccessValidationService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'COMPTABLE', 'DIRECTEUR')")
    public ResponseEntity<ApiResponse<List<AssuranceDTO>>> getAllAssurances() {
        List<AssuranceDTO> assurances = assuranceService.getAllAssurances();
        return ResponseEntity.ok(ApiResponse.success(assurances));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'COMPTABLE', 'PATIENT')")
    public ResponseEntity<ApiResponse<AssuranceDTO>> getAssuranceById(@PathVariable Long id) {
        AssuranceDTO assurance = assuranceService.getAssuranceById(id);
        
        if (assurance != null && assurance.getPatientId() != null) {
            patientAccessValidationService.validatePatientAccess(assurance.getPatientId());
        }
        return ResponseEntity.ok(ApiResponse.success(assurance));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'COMPTABLE', 'PATIENT')")
    public ResponseEntity<ApiResponse<List<AssuranceDTO>>> getAssurancesByPatientId(@PathVariable Long patientId) {
        
        patientAccessValidationService.validatePatientAccess(patientId);
        List<AssuranceDTO> assurances = assuranceService.getAssurancesByPatientId(patientId);
        return ResponseEntity.ok(ApiResponse.success(assurances));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'COMPTABLE')")
    public ResponseEntity<ApiResponse<AssuranceDTO>> creerAssurance(
            @RequestParam Long patientId,
            @RequestParam String nomAssurance,
            @RequestParam String numeroContrat,
            @RequestParam(required = false) Double tauxCouverture) {
        AssuranceDTO assurance = assuranceService.creerAssurance(patientId, nomAssurance, numeroContrat, tauxCouverture);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Assurance créée avec succès", assurance));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'COMPTABLE')")
    public ResponseEntity<ApiResponse<AssuranceDTO>> modifierAssurance(
            @PathVariable Long id,
            @RequestParam(required = false) String nomAssurance,
            @RequestParam(required = false) String numeroContrat,
            @RequestParam(required = false) Double tauxCouverture) {
        AssuranceDTO assurance = assuranceService.modifierAssurance(id, nomAssurance, numeroContrat, tauxCouverture);
        return ResponseEntity.ok(ApiResponse.success("Assurance modifiée avec succès", assurance));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'COMPTABLE')")
    public ResponseEntity<ApiResponse<Void>> supprimerAssurance(@PathVariable Long id) {
        assuranceService.supprimerAssurance(id);
        return ResponseEntity.ok(ApiResponse.success("Assurance supprimée avec succès", null));
    }
}

