package com.his.hub.consultation.controller;

import com.his.hub.authentication.dao.UtilisateurRepository;
import com.his.hub.common.dto.ApiResponse;
import com.his.hub.common.exception.ResourceNotFoundException;
import com.his.hub.common.service.PatientAccessValidationService;
import com.his.hub.consultation.dto.ConsultationDTO;
import com.his.hub.consultation.dto.CreateConsultationRequest;
import com.his.hub.consultation.service.ConsultationService;
import com.his.hub.patient.dao.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
@RequiredArgsConstructor
public class ConsultationController {

    private final ConsultationService consultationService;
    private final UtilisateurRepository utilisateurRepository;
    private final PatientRepository patientRepository;
    private final PatientAccessValidationService patientAccessValidationService;

    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'MEDECIN', 'DIRECTEUR')")
    public ResponseEntity<ApiResponse<List<ConsultationDTO>>> getAllConsultations() {
        List<ConsultationDTO> consultations = consultationService.getAllConsultations();
        return ResponseEntity.ok(ApiResponse.success(consultations));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'MEDECIN')")
    public ResponseEntity<ApiResponse<ConsultationDTO>> creerConsultation(@RequestBody CreateConsultationRequest request) {
        ConsultationDTO consultation = consultationService.creerConsultation(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Consultation créée avec succès", consultation));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'MEDECIN', 'INFIRMIER', 'AGENT_ACCUEIL', 'PATIENT')")
    public ResponseEntity<ApiResponse<ConsultationDTO>> getConsultationById(@PathVariable Long id) {
        ConsultationDTO consultation = consultationService.getConsultationById(id);
        
        if (consultation != null && consultation.getPatientId() != null) {
            patientAccessValidationService.validatePatientAccess(consultation.getPatientId());
        }
        return ResponseEntity.ok(ApiResponse.success(consultation));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'MEDECIN', 'INFIRMIER', 'AGENT_ACCUEIL', 'PATIENT')")
    public ResponseEntity<ApiResponse<List<ConsultationDTO>>> getConsultationsByPatientId(@PathVariable Long patientId) {
        
        patientAccessValidationService.validatePatientAccess(patientId);
        List<ConsultationDTO> consultations = consultationService.getConsultationsByPatientId(patientId);
        return ResponseEntity.ok(ApiResponse.success(consultations));
    }

    @GetMapping("/medecin/{medecinId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'MEDECIN')")
    public ResponseEntity<ApiResponse<List<ConsultationDTO>>> getConsultationsByMedecinId(@PathVariable Long medecinId) {
        List<ConsultationDTO> consultations = consultationService.getConsultationsByMedecinId(medecinId);
        return ResponseEntity.ok(ApiResponse.success(consultations));
    }

    
    @GetMapping("/mes-consultations")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'PATIENT')")
    public ResponseEntity<ApiResponse<List<ConsultationDTO>>> getMesConsultations() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        Long utilisateurId = utilisateurRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"))
            .getId();
        
        Long patientId = patientRepository.findByUtilisateurId(utilisateurId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé pour cet utilisateur"))
            .getId();
        
        List<ConsultationDTO> consultations = consultationService.getConsultationsByPatientId(patientId);
        return ResponseEntity.ok(ApiResponse.success(consultations));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'MEDECIN')")
    public ResponseEntity<ApiResponse<Void>> supprimerConsultation(@PathVariable Long id) {
        consultationService.supprimerConsultation(id);
        return ResponseEntity.ok(ApiResponse.success("Consultation supprimée avec succès", null));
    }
}

