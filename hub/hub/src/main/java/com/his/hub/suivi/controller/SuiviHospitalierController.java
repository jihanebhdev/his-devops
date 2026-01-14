package com.his.hub.suivi.controller;

import com.his.hub.common.dto.ApiResponse;
import com.his.hub.common.service.PatientAccessValidationService;
import com.his.hub.suivi.dto.CreateSuiviHospitalierRequest;
import com.his.hub.suivi.dto.SuiviHospitalierDTO;
import com.his.hub.suivi.service.SuiviHospitalierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suivis")
@RequiredArgsConstructor
public class SuiviHospitalierController {

    private final SuiviHospitalierService suiviHospitalierService;
    private final PatientAccessValidationService patientAccessValidationService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'INFIRMIER', 'MEDECIN')")
    public ResponseEntity<ApiResponse<SuiviHospitalierDTO>> enregistrerSuivi(@RequestBody CreateSuiviHospitalierRequest request) {
        SuiviHospitalierDTO suivi = suiviHospitalierService.enregistrerSuivi(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Suivi enregistré avec succès", suivi));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'INFIRMIER', 'MEDECIN', 'PATIENT')")
    public ResponseEntity<ApiResponse<SuiviHospitalierDTO>> getSuiviById(@PathVariable Long id) {
        SuiviHospitalierDTO suivi = suiviHospitalierService.getSuiviById(id);
        
        if (suivi != null && suivi.getPatientId() != null) {
            patientAccessValidationService.validatePatientAccess(suivi.getPatientId());
        }
        return ResponseEntity.ok(ApiResponse.success(suivi));
    }

    @GetMapping("/hospitalisation/{hospitalisationId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'INFIRMIER', 'MEDECIN', 'PATIENT')")
    public ResponseEntity<ApiResponse<List<SuiviHospitalierDTO>>> getSuivisByHospitalisationId(@PathVariable Long hospitalisationId) {
        List<SuiviHospitalierDTO> suivis = suiviHospitalierService.getSuivisByHospitalisationId(hospitalisationId);
        
        if (suivis != null && !suivis.isEmpty() && suivis.get(0).getPatientId() != null) {
            patientAccessValidationService.validatePatientAccess(suivis.get(0).getPatientId());
        }
        return ResponseEntity.ok(ApiResponse.success(suivis));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'INFIRMIER', 'MEDECIN')")
    public ResponseEntity<ApiResponse<Void>> supprimerSuivi(@PathVariable Long id) {
        suiviHospitalierService.supprimerSuivi(id);
        return ResponseEntity.ok(ApiResponse.success("Suivi supprimé avec succès", null));
    }
}

