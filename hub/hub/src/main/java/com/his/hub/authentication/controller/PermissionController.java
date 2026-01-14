package com.his.hub.authentication.controller;

import com.his.hub.authentication.dto.PermissionDTO;
import com.his.hub.authentication.service.PermissionService;
import com.his.hub.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionService permissionService;

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<PermissionDTO>> creerPermission(
            @RequestParam String nom,
            @RequestParam(required = false) String description) {
        PermissionDTO permission = permissionService.creerPermission(nom, description);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success("Permission créée avec succès", permission));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<PermissionDTO>> modifierPermission(
            @PathVariable Long id,
            @RequestParam String nom,
            @RequestParam(required = false) String description) {
        PermissionDTO permission = permissionService.modifierPermission(id, nom, description);
        return ResponseEntity.ok(ApiResponse.success("Permission modifiée avec succès", permission));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<Void>> supprimerPermission(@PathVariable Long id) {
        permissionService.supprimerPermission(id);
        return ResponseEntity.ok(ApiResponse.success("Permission supprimée avec succès", null));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<PermissionDTO>> getPermissionById(@PathVariable Long id) {
        PermissionDTO permission = permissionService.getPermissionById(id);
        return ResponseEntity.ok(ApiResponse.success(permission));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRATEUR')")
    public ResponseEntity<ApiResponse<List<PermissionDTO>>> getAllPermissions() {
        List<PermissionDTO> permissions = permissionService.getAllPermissions();
        return ResponseEntity.ok(ApiResponse.success(permissions));
    }
}

