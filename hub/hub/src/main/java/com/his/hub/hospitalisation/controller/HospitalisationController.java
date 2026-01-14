package com.his.hub.hospitalisation.controller;

import com.his.hub.common.dto.ApiResponse;
import com.his.hub.common.service.PatientAccessValidationService;
import com.his.hub.hospitalisation.dto.CreateHospitalisationRequest;
import com.his.hub.hospitalisation.dto.HospitalisationDTO;
import com.his.hub.hospitalisation.service.HospitalisationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitalisations")
@RequiredArgsConstructor
public class HospitalisationController {

    private final HospitalisationService hospitalisationService;
    private final PatientAccessValidationService patientAccessValidationService;

    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'MEDECIN', 'DIRECTEUR')")
    public ResponseEntity<ApiResponse<List<HospitalisationDTO>>> getAllHospitalisations() {
        List<HospitalisationDTO> hospitalisations = hospitalisationService.getAllHospitalisations();
        return ResponseEntity.ok(ApiResponse.success(hospitalisations));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'MEDECIN')")
    public ResponseEntity<ApiResponse<HospitalisationDTO>> creerHospitalisation(@RequestBody CreateHospitalisationRequest request) {
        HospitalisationDTO hospitalisation = hospitalisationService.creerHospitalisation(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Hospitalisation créée avec succès", hospitalisation));
    }

    @PatchMapping("/{id}/sortie")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'MEDECIN')")
    public ResponseEntity<ApiResponse<HospitalisationDTO>> enregistrerSortie(
            @PathVariable Long id,
            @RequestParam(required = false) String notesSortie) {
        HospitalisationDTO hospitalisation = hospitalisationService.enregistrerSortie(id, notesSortie);
        return ResponseEntity.ok(ApiResponse.success("Sortie enregistrée avec succès", hospitalisation));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'MEDECIN', 'INFIRMIER', 'AGENT_ACCUEIL', 'PATIENT')")
    public ResponseEntity<ApiResponse<HospitalisationDTO>> getHospitalisationById(@PathVariable Long id) {
        HospitalisationDTO hospitalisation = hospitalisationService.getHospitalisationById(id);
        
        if (hospitalisation != null && hospitalisation.getPatientId() != null) {
            patientAccessValidationService.validatePatientAccess(hospitalisation.getPatientId());
        }
        return ResponseEntity.ok(ApiResponse.success(hospitalisation));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'MEDECIN', 'INFIRMIER', 'AGENT_ACCUEIL', 'PATIENT')")
    public ResponseEntity<ApiResponse<List<HospitalisationDTO>>> getHospitalisationsByPatientId(@PathVariable Long patientId) {
        
        patientAccessValidationService.validatePatientAccess(patientId);
        List<HospitalisationDTO> hospitalisations = hospitalisationService.getHospitalisationsByPatientId(patientId);
        return ResponseEntity.ok(ApiResponse.success(hospitalisations));
    }

    @GetMapping("/en-cours")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'MEDECIN', 'INFIRMIER', 'AGENT_ACCUEIL')")
    public ResponseEntity<ApiResponse<List<HospitalisationDTO>>> getHospitalisationsEnCours() {
        List<HospitalisationDTO> hospitalisations = hospitalisationService.getHospitalisationsEnCours();
        return ResponseEntity.ok(ApiResponse.success(hospitalisations));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'MEDECIN')")
    public ResponseEntity<ApiResponse<Void>> supprimerHospitalisation(@PathVariable Long id) {
        hospitalisationService.supprimerHospitalisation(id);
        return ResponseEntity.ok(ApiResponse.success("Hospitalisation supprimée avec succès", null));
    }
}

