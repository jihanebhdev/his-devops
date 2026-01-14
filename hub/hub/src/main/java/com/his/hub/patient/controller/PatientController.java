package com.his.hub.patient.controller;

import com.his.hub.authentication.dao.UtilisateurRepository;
import com.his.hub.common.dto.ApiResponse;
import com.his.hub.common.exception.ResourceNotFoundException;
import com.his.hub.patient.dto.CreatePatientRequest;
import com.his.hub.patient.dto.PatientDTO;
import com.his.hub.patient.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;
    private final UtilisateurRepository utilisateurRepository;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL')")
    public ResponseEntity<ApiResponse<PatientDTO>> creerPatient(@RequestBody CreatePatientRequest request) {
        PatientDTO patient = patientService.creerPatient(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Patient créé avec succès", patient));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL')")
    public ResponseEntity<ApiResponse<PatientDTO>> modifierPatient(
            @PathVariable Long id,
            @RequestBody CreatePatientRequest request) {
        PatientDTO patient = patientService.modifierPatient(id, request);
        return ResponseEntity.ok(ApiResponse.success("Patient modifié avec succès", patient));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL')")
    public ResponseEntity<ApiResponse<Void>> supprimerPatient(@PathVariable Long id) {
        patientService.supprimerPatient(id);
        return ResponseEntity.ok(ApiResponse.success("Patient supprimé avec succès", null));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN', 'INFIRMIER', 'COMPTABLE', 'DIRECTEUR')")
    public ResponseEntity<ApiResponse<PatientDTO>> getPatientById(@PathVariable Long id) {
        PatientDTO patient = patientService.getPatientById(id);
        return ResponseEntity.ok(ApiResponse.success(patient));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN', 'INFIRMIER', 'COMPTABLE', 'DIRECTEUR')")
    public ResponseEntity<ApiResponse<List<PatientDTO>>> getAllPatients() {
        List<PatientDTO> patients = patientService.getAllPatients();
        return ResponseEntity.ok(ApiResponse.success(patients));
    }

    @GetMapping("/recherche")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN', 'INFIRMIER', 'COMPTABLE', 'DIRECTEUR')")
    public ResponseEntity<ApiResponse<List<PatientDTO>>> rechercherPatients(@RequestParam String q) {
        List<PatientDTO> patients = patientService.rechercherPatients(q);
        return ResponseEntity.ok(ApiResponse.success(patients));
    }

    
    @GetMapping("/mon-profil")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'PATIENT')")
    public ResponseEntity<ApiResponse<PatientDTO>> getMonProfil() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        Long utilisateurId = utilisateurRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"))
            .getId();
        
        PatientDTO patient = patientService.getPatientByUtilisateurId(utilisateurId);
        return ResponseEntity.ok(ApiResponse.success(patient));
    }

    
    @PutMapping("/mon-profil")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<PatientDTO>> updateMonProfil(
            @RequestBody com.his.hub.patient.dto.UpdatePatientProfileRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        Long utilisateurId = utilisateurRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"))
            .getId();
        
        PatientDTO patient = patientService.updatePatientProfile(utilisateurId, request);
        return ResponseEntity.ok(ApiResponse.success("Profil mis à jour avec succès", patient));
    }
}

