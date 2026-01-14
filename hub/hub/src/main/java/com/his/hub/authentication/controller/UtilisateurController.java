package com.his.hub.authentication.controller;

import com.his.hub.authentication.dto.CreateUtilisateurRequest;
import com.his.hub.authentication.dto.UtilisateurDTO;
import com.his.hub.authentication.service.UtilisateurService;
import com.his.hub.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@RequiredArgsConstructor
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<UtilisateurDTO>> creerUtilisateur(@RequestBody CreateUtilisateurRequest request) {
        UtilisateurDTO utilisateur = utilisateurService.creerUtilisateur(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Utilisateur créé avec succès", utilisateur));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<UtilisateurDTO>> modifierUtilisateur(
            @PathVariable Long id,
            @RequestBody CreateUtilisateurRequest request) {
        UtilisateurDTO utilisateur = utilisateurService.modifierUtilisateur(id, request);
        return ResponseEntity.ok(ApiResponse.success("Utilisateur modifié avec succès", utilisateur));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<Void>> supprimerUtilisateur(@PathVariable Long id) {
        utilisateurService.supprimerUtilisateur(id);
        return ResponseEntity.ok(ApiResponse.success("Utilisateur supprimé avec succès", null));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<List<UtilisateurDTO>>> getAllUtilisateurs() {
        List<UtilisateurDTO> utilisateurs = utilisateurService.getAllUtilisateurs();
        return ResponseEntity.ok(ApiResponse.success(utilisateurs));
    }

    
    @GetMapping("/mon-profil")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UtilisateurDTO>> getMonProfil() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        UtilisateurDTO utilisateur = utilisateurService.getUtilisateurByUsername(username);
        return ResponseEntity.ok(ApiResponse.success(utilisateur));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<UtilisateurDTO>> getUtilisateurById(@PathVariable Long id) {
        UtilisateurDTO utilisateur = utilisateurService.getUtilisateurById(id);
        return ResponseEntity.ok(ApiResponse.success(utilisateur));
    }

    
    @PutMapping("/mon-profil")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UtilisateurDTO>> updateMonProfil(
            @RequestBody com.his.hub.authentication.dto.UpdateProfileRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        UtilisateurDTO utilisateur = utilisateurService.updateProfile(username, request);
        return ResponseEntity.ok(ApiResponse.success("Profil mis à jour avec succès", utilisateur));
    }

    
    @GetMapping("/medecins")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN', 'INFIRMIER', 'DIRECTEUR')")
    public ResponseEntity<ApiResponse<java.util.List<UtilisateurDTO>>> getAllMedecins() {
        java.util.List<UtilisateurDTO> medecins = utilisateurService.getUtilisateursByRole("MEDECIN");
        return ResponseEntity.ok(ApiResponse.success(medecins));
    }

    
    @GetMapping("/infirmiers")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN', 'DIRECTEUR')")
    public ResponseEntity<ApiResponse<java.util.List<UtilisateurDTO>>> getAllInfirmiers() {
        java.util.List<UtilisateurDTO> infirmiers = utilisateurService.getUtilisateursByRole("INFIRMIER");
        return ResponseEntity.ok(ApiResponse.success(infirmiers));
    }
}

