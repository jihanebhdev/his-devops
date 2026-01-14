package com.his.hub.constantes.controller;

import com.his.hub.common.dto.ApiResponse;
import com.his.hub.common.service.PatientAccessValidationService;
import com.his.hub.constantes.dto.CreateConstantesVitalesRequest;
import com.his.hub.constantes.dto.ConstantesVitalesDTO;
import com.his.hub.constantes.service.ConstantesVitalesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/constantes")
@RequiredArgsConstructor
public class ConstantesVitalesController {

    private final ConstantesVitalesService constantesVitalesService;
    private final PatientAccessValidationService patientAccessValidationService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'INFIRMIER', 'MEDECIN')")
    public ResponseEntity<ApiResponse<ConstantesVitalesDTO>> enregistrerConstantes(@RequestBody CreateConstantesVitalesRequest request) {
        ConstantesVitalesDTO constantes = constantesVitalesService.enregistrerConstantes(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Constantes vitales enregistrées avec succès", constantes));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'INFIRMIER', 'MEDECIN', 'PATIENT')")
    public ResponseEntity<ApiResponse<ConstantesVitalesDTO>> getConstantesById(@PathVariable Long id) {
        ConstantesVitalesDTO constantes = constantesVitalesService.getConstantesById(id);
        
        if (constantes != null && constantes.getPatientId() != null) {
            patientAccessValidationService.validatePatientAccess(constantes.getPatientId());
        }
        return ResponseEntity.ok(ApiResponse.success(constantes));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'INFIRMIER', 'MEDECIN', 'PATIENT')")
    public ResponseEntity<ApiResponse<List<ConstantesVitalesDTO>>> getConstantesByPatientId(@PathVariable Long patientId) {
        
        patientAccessValidationService.validatePatientAccess(patientId);
        List<ConstantesVitalesDTO> constantes = constantesVitalesService.getConstantesByPatientId(patientId);
        return ResponseEntity.ok(ApiResponse.success(constantes));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'INFIRMIER', 'MEDECIN')")
    public ResponseEntity<ApiResponse<Void>> supprimerConstantes(@PathVariable Long id) {
        constantesVitalesService.supprimerConstantes(id);
        return ResponseEntity.ok(ApiResponse.success("Constantes vitales supprimées avec succès", null));
    }
}

