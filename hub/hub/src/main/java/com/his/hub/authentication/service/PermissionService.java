package com.his.hub.authentication.service;

import com.his.hub.authentication.dao.PermissionRepository;
import com.his.hub.authentication.dto.PermissionDTO;
import com.his.hub.authentication.entity.Permission;
import com.his.hub.common.exception.BusinessException;
import com.his.hub.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PermissionService {

    private final PermissionRepository permissionRepository;

    public PermissionDTO creerPermission(String nom, String description) {
        if (permissionRepository.existsByNom(nom)) {
            throw new BusinessException("La permission existe déjà");
        }

        Permission permission = new Permission();
        permission.setNom(nom);
        permission.setDescription(description);

        Permission saved = permissionRepository.save(permission);
        return toDTO(saved);
    }

    public PermissionDTO modifierPermission(Long id, String nom, String description) {
        Permission permission = permissionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Permission non trouvée avec l'ID: " + id));

        if (!permission.getNom().equals(nom) && permissionRepository.existsByNom(nom)) {
            throw new BusinessException("La permission existe déjà");
        }

        permission.setNom(nom);
        permission.setDescription(description);

        Permission saved = permissionRepository.save(permission);
        return toDTO(saved);
    }

    public void supprimerPermission(Long id) {
        Permission permission = permissionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Permission non trouvée avec l'ID: " + id));
        permissionRepository.delete(permission);
    }

    @Transactional(readOnly = true)
    public PermissionDTO getPermissionById(Long id) {
        Permission permission = permissionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Permission non trouvée avec l'ID: " + id));
        return toDTO(permission);
    }

    @Transactional(readOnly = true)
    public java.util.List<PermissionDTO> getAllPermissions() {
        return permissionRepository.findAll().stream()
            .map(this::toDTO)
            .collect(java.util.stream.Collectors.toList());
    }

    private PermissionDTO toDTO(Permission permission) {
        PermissionDTO dto = new PermissionDTO();
        dto.setId(permission.getId());
        dto.setNom(permission.getNom());
        dto.setDescription(permission.getDescription());
        return dto;
    }
}

