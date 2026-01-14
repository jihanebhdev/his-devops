package com.his.hub.authentication.controller;

import com.his.hub.authentication.dto.RoleDTO;
import com.his.hub.authentication.service.RoleService;
import com.his.hub.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<RoleDTO>> creerRole(
            @RequestParam String nom,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Set<Long> permissionIds) {
        RoleDTO role = roleService.creerRole(nom, description, permissionIds);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Rôle créé avec succès", role));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<RoleDTO>> modifierRole(
            @PathVariable Long id,
            @RequestParam String nom,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Set<Long> permissionIds) {
        RoleDTO role = roleService.modifierRole(id, nom, description, permissionIds);
        return ResponseEntity.ok(ApiResponse.success("Rôle modifié avec succès", role));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<Void>> supprimerRole(@PathVariable Long id) {
        roleService.supprimerRole(id);
        return ResponseEntity.ok(ApiResponse.success("Rôle supprimé avec succès", null));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<RoleDTO>> getRoleById(@PathVariable Long id) {
        RoleDTO role = roleService.getRoleById(id);
        return ResponseEntity.ok(ApiResponse.success(role));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<List<RoleDTO>>> getAllRoles() {
        List<RoleDTO> roles = roleService.getAllRoles();
        return ResponseEntity.ok(ApiResponse.success(roles));
    }
}

