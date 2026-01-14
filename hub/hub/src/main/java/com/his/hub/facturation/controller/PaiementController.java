package com.his.hub.facturation.controller;

import com.his.hub.common.dto.ApiResponse;
import com.his.hub.common.service.PatientAccessValidationService;
import com.his.hub.facturation.dto.CreatePaiementRequest;
import com.his.hub.facturation.dto.PaiementDTO;
import com.his.hub.facturation.service.PaiementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paiements")
@RequiredArgsConstructor
public class PaiementController {

    private final PaiementService paiementService;
    private final PatientAccessValidationService patientAccessValidationService;

    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'COMPTABLE', 'DIRECTEUR')")
    public ResponseEntity<ApiResponse<List<PaiementDTO>>> getAllPaiements() {
        List<PaiementDTO> paiements = paiementService.getAllPaiements();
        return ResponseEntity.ok(ApiResponse.success(paiements));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'COMPTABLE')")
    public ResponseEntity<ApiResponse<PaiementDTO>> enregistrerPaiement(@RequestBody CreatePaiementRequest request) {
        PaiementDTO paiement = paiementService.enregistrerPaiement(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Paiement enregistré avec succès", paiement));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'COMPTABLE', 'PATIENT')")
    public ResponseEntity<ApiResponse<PaiementDTO>> getPaiementById(@PathVariable Long id) {
        PaiementDTO paiement = paiementService.getPaiementById(id);
        
        if (paiement != null && paiement.getPatientId() != null) {
            patientAccessValidationService.validatePatientAccess(paiement.getPatientId());
        }
        return ResponseEntity.ok(ApiResponse.success(paiement));
    }

    @GetMapping("/facture/{factureId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'COMPTABLE', 'PATIENT')")
    public ResponseEntity<ApiResponse<List<PaiementDTO>>> getPaiementsByFactureId(@PathVariable Long factureId) {
        List<PaiementDTO> paiements = paiementService.getPaiementsByFactureId(factureId);
        
        if (paiements != null && !paiements.isEmpty() && paiements.get(0).getPatientId() != null) {
            patientAccessValidationService.validatePatientAccess(paiements.get(0).getPatientId());
        }
        return ResponseEntity.ok(ApiResponse.success(paiements));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'COMPTABLE', 'PATIENT')")
    public ResponseEntity<ApiResponse<List<PaiementDTO>>> getPaiementsByPatientId(@PathVariable Long patientId) {
        
        patientAccessValidationService.validatePatientAccess(patientId);
        List<PaiementDTO> paiements = paiementService.getPaiementsByPatientId(patientId);
        return ResponseEntity.ok(ApiResponse.success(paiements));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'COMPTABLE')")
    public ResponseEntity<ApiResponse<Void>> supprimerPaiement(@PathVariable Long id) {
        paiementService.supprimerPaiement(id);
        return ResponseEntity.ok(ApiResponse.success("Paiement supprimé avec succès", null));
    }
}

