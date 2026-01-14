package com.his.hub.rendezvous.controller;

import com.his.hub.authentication.dao.UtilisateurRepository;
import com.his.hub.common.dto.ApiResponse;
import com.his.hub.common.exception.ResourceNotFoundException;
import com.his.hub.common.service.PatientAccessValidationService;
import com.his.hub.rendezvous.dto.CreateRendezVousRequest;
import com.his.hub.rendezvous.dto.RendezVousDTO;
import com.his.hub.rendezvous.entity.RendezVous;
import com.his.hub.rendezvous.service.RendezVousService;
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
@RequestMapping("/api/rendezvous")
@RequiredArgsConstructor
public class RendezVousController {

    private final RendezVousService rendezVousService;
    private final UtilisateurRepository utilisateurRepository;
    private final PatientRepository patientRepository;
    private final PatientAccessValidationService patientAccessValidationService;

    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN', 'DIRECTEUR')")
    public ResponseEntity<ApiResponse<List<RendezVousDTO>>> getAllRendezVous() {
        List<RendezVousDTO> rendezVous = rendezVousService.getAllRendezVous();
        return ResponseEntity.ok(ApiResponse.success(rendezVous));
    }

    
    @GetMapping("/today")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN')")
    public ResponseEntity<ApiResponse<List<RendezVousDTO>>> getTodayRendezVous() {
        List<RendezVousDTO> rendezVous = rendezVousService.getTodayRendezVous();
        return ResponseEntity.ok(ApiResponse.success(rendezVous));
    }

    
    @GetMapping("/upcoming")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN')")
    public ResponseEntity<ApiResponse<List<RendezVousDTO>>> getUpcomingRendezVous() {
        List<RendezVousDTO> rendezVous = rendezVousService.getUpcomingRendezVous();
        return ResponseEntity.ok(ApiResponse.success(rendezVous));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN')")
    public ResponseEntity<ApiResponse<RendezVousDTO>> creerRendezVous(@RequestBody CreateRendezVousRequest request) {
        RendezVousDTO rendezVous = rendezVousService.creerRendezVous(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Rendez-vous créé avec succès", rendezVous));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN')")
    public ResponseEntity<ApiResponse<RendezVousDTO>> modifierRendezVous(
            @PathVariable Long id,
            @RequestBody CreateRendezVousRequest request) {
        RendezVousDTO rendezVous = rendezVousService.modifierRendezVous(id, request);
        return ResponseEntity.ok(ApiResponse.success("Rendez-vous modifié avec succès", rendezVous));
    }

    @PatchMapping("/{id}/statut")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN')")
    public ResponseEntity<ApiResponse<RendezVousDTO>> changerStatut(
            @PathVariable Long id,
            @RequestParam RendezVous.StatutRendezVous statut) {
        RendezVousDTO rendezVous = rendezVousService.changerStatut(id, statut);
        return ResponseEntity.ok(ApiResponse.success("Statut modifié avec succès", rendezVous));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN', 'PATIENT')")
    public ResponseEntity<ApiResponse<RendezVousDTO>> getRendezVousById(@PathVariable Long id) {
        RendezVousDTO rendezVous = rendezVousService.getRendezVousById(id);
        
        if (rendezVous != null && rendezVous.getPatientId() != null) {
            patientAccessValidationService.validatePatientAccess(rendezVous.getPatientId());
        }
        return ResponseEntity.ok(ApiResponse.success(rendezVous));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN', 'PATIENT')")
    public ResponseEntity<ApiResponse<List<RendezVousDTO>>> getRendezVousByPatientId(@PathVariable Long patientId) {
        
        patientAccessValidationService.validatePatientAccess(patientId);
        List<RendezVousDTO> rendezVous = rendezVousService.getRendezVousByPatientId(patientId);
        return ResponseEntity.ok(ApiResponse.success(rendezVous));
    }

    @GetMapping("/medecin/{medecinId}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'MEDECIN')")
    public ResponseEntity<ApiResponse<List<RendezVousDTO>>> getRendezVousByMedecinId(@PathVariable Long medecinId) {
        List<RendezVousDTO> rendezVous = rendezVousService.getRendezVousByMedecinId(medecinId);
        return ResponseEntity.ok(ApiResponse.success(rendezVous));
    }

    
    @GetMapping("/mes-rendezvous")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'PATIENT')")
    public ResponseEntity<ApiResponse<List<RendezVousDTO>>> getMesRendezVous() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        Long utilisateurId = utilisateurRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"))
            .getId();
        
        Long patientId = patientRepository.findByUtilisateurId(utilisateurId)
            .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé pour cet utilisateur"))
            .getId();
        
        List<RendezVousDTO> rendezVous = rendezVousService.getRendezVousByPatientId(patientId);
        return ResponseEntity.ok(ApiResponse.success(rendezVous));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN')")
    public ResponseEntity<ApiResponse<Void>> supprimerRendezVous(@PathVariable Long id) {
        rendezVousService.supprimerRendezVous(id);
        return ResponseEntity.ok(ApiResponse.success("Rendez-vous supprimé avec succès", null));
    }
}

