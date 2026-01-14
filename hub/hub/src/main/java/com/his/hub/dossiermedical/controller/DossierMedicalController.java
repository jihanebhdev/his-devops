package com.his.hub.dossiermedical.controller;

import com.his.hub.common.dto.ApiResponse;
import com.his.hub.common.service.PatientAccessValidationService;
import com.his.hub.dossiermedical.dto.CreateDossierMedicalRequest;
import com.his.hub.dossiermedical.dto.DossierMedicalDTO;
import com.his.hub.dossiermedical.service.DossierMedicalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dossiers")
@RequiredArgsConstructor
public class DossierMedicalController {

    private final DossierMedicalService dossierMedicalService;
    private final PatientAccessValidationService patientAccessValidationService;

    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'MEDECIN', 'DIRECTEUR')")
    public ResponseEntity<ApiResponse<java.util.List<DossierMedicalDTO>>> getAllDossiersMedicaux() {
        java.util.List<DossierMedicalDTO> dossiers = dossierMedicalService.getAllDossiersMedicaux();
        return ResponseEntity.ok(ApiResponse.success(dossiers));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN')")
    public ResponseEntity<ApiResponse<DossierMedicalDTO>> creerDossierMedical(@RequestBody CreateDossierMedicalRequest request) {
        DossierMedicalDTO dossier = dossierMedicalService.creerDossierMedical(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Dossier médical créé avec succès", dossier));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN')")
    public ResponseEntity<ApiResponse<DossierMedicalDTO>> modifierDossierMedical(
            @PathVariable Long id,
            @RequestBody CreateDossierMedicalRequest request) {
        DossierMedicalDTO dossier = dossierMedicalService.modifierDossierMedical(id, request);
        return ResponseEntity.ok(ApiResponse.success("Dossier médical modifié avec succès", dossier));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN', 'INFIRMIER', 'DIRECTEUR', 'PATIENT')")
    public ResponseEntity<ApiResponse<DossierMedicalDTO>> getDossierMedicalById(@PathVariable Long id) {
        DossierMedicalDTO dossier = dossierMedicalService.getDossierMedicalById(id);
        
        if (dossier != null && dossier.getPatientId() != null) {
            patientAccessValidationService.validatePatientAccess(dossier.getPatientId());
        }
        return ResponseEntity.ok(ApiResponse.success(dossier));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN', 'INFIRMIER', 'DIRECTEUR', 'PATIENT')")
    public ResponseEntity<ApiResponse<DossierMedicalDTO>> getDossierMedicalByPatientId(@PathVariable Long patientId) {
        
        patientAccessValidationService.validatePatientAccess(patientId);
        DossierMedicalDTO dossier = dossierMedicalService.getDossierMedicalByPatientId(patientId);
        return ResponseEntity.ok(ApiResponse.success(dossier));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'MEDECIN')")
    public ResponseEntity<ApiResponse<Void>> supprimerDossierMedical(@PathVariable Long id) {
        dossierMedicalService.supprimerDossierMedical(id);
        return ResponseEntity.ok(ApiResponse.success("Dossier médical supprimé avec succès", null));
    }
}

