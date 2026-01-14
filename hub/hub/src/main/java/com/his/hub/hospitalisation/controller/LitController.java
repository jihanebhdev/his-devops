package com.his.hub.hospitalisation.controller;

import com.his.hub.common.dto.ApiResponse;
import com.his.hub.hospitalisation.dto.LitDTO;
import com.his.hub.hospitalisation.entity.Lit;
import com.his.hub.hospitalisation.service.LitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lits")
@RequiredArgsConstructor
public class LitController {

    private final LitService litService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN')")
    public ResponseEntity<ApiResponse<LitDTO>> creerLit(
            @RequestParam String numeroLit,
            @RequestParam String service,
            @RequestParam String chambre,
            @RequestParam(required = false) String notes) {
        LitDTO lit = litService.creerLit(numeroLit, service, chambre, notes);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Lit créé avec succès", lit));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN')")
    public ResponseEntity<ApiResponse<LitDTO>> modifierLit(
            @PathVariable Long id,
            @RequestParam String numeroLit,
            @RequestParam String service,
            @RequestParam String chambre,
            @RequestParam(required = false) Lit.StatutLit statut,
            @RequestParam(required = false) String notes) {
        LitDTO lit = litService.modifierLit(id, numeroLit, service, chambre, statut, notes);
        return ResponseEntity.ok(ApiResponse.success("Lit modifié avec succès", lit));
    }

    @GetMapping("/disponibles")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN')")
    public ResponseEntity<ApiResponse<List<LitDTO>>> getLitsDisponibles(@RequestParam(required = false) String service) {
        List<LitDTO> lits = litService.getLitsDisponibles(service);
        return ResponseEntity.ok(ApiResponse.success(lits));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN')")
    public ResponseEntity<ApiResponse<LitDTO>> getLitById(@PathVariable Long id) {
        LitDTO lit = litService.getLitById(id);
        return ResponseEntity.ok(ApiResponse.success(lit));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR', 'AGENT_ACCUEIL', 'MEDECIN')")
    public ResponseEntity<ApiResponse<List<LitDTO>>> getAllLits() {
        List<LitDTO> lits = litService.getAllLits();
        return ResponseEntity.ok(ApiResponse.success(lits));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<Void>> supprimerLit(@PathVariable Long id) {
        litService.supprimerLit(id);
        return ResponseEntity.ok(ApiResponse.success("Lit supprimé avec succès", null));
    }
}

