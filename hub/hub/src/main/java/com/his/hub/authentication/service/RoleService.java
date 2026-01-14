package com.his.hub.authentication.service;

import com.his.hub.authentication.dao.PermissionRepository;
import com.his.hub.authentication.dao.RoleRepository;
import com.his.hub.authentication.dto.RoleDTO;
import com.his.hub.authentication.entity.Permission;
import com.his.hub.authentication.entity.Role;
import com.his.hub.common.exception.BusinessException;
import com.his.hub.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    public RoleDTO creerRole(String nom, String description, Set<Long> permissionIds) {
        if (roleRepository.existsByNom(nom)) {
            throw new BusinessException("Le rôle existe déjà");
        }

        Role role = new Role();
        role.setNom(nom);
        role.setDescription(description);

        if (permissionIds != null && !permissionIds.isEmpty()) {
            Set<Permission> permissions = permissionIds.stream()
                .map(permissionId -> permissionRepository.findById(permissionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Permission non trouvée avec l'ID: " + permissionId)))
                .collect(Collectors.toSet());
            role.setPermissions(permissions);
        }

        Role saved = roleRepository.save(role);
        return toDTO(saved);
    }

    public RoleDTO modifierRole(Long id, String nom, String description, Set<Long> permissionIds) {
        Role role = roleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Rôle non trouvé avec l'ID: " + id));

        if (!role.getNom().equals(nom) && roleRepository.existsByNom(nom)) {
            throw new BusinessException("Le rôle existe déjà");
        }

        role.setNom(nom);
        role.setDescription(description);

        if (permissionIds != null) {
            Set<Permission> permissions = permissionIds.stream()
                .map(permissionId -> permissionRepository.findById(permissionId)
                    .orElseThrow(() -> new ResourceNotFoundException("Permission non trouvée avec l'ID: " + permissionId)))
                .collect(Collectors.toSet());
            role.setPermissions(permissions);
        }

        Role saved = roleRepository.save(role);
        return toDTO(saved);
    }

    public void supprimerRole(Long id) {
        Role role = roleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Rôle non trouvé avec l'ID: " + id));
        roleRepository.delete(role);
    }

    @Transactional(readOnly = true)
    public RoleDTO getRoleById(Long id) {
        Role role = roleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Rôle non trouvé avec l'ID: " + id));
        return toDTO(role);
    }

    @Transactional(readOnly = true)
    public java.util.List<RoleDTO> getAllRoles() {
        return roleRepository.findAll().stream()
            .map(this::toDTO)
            .collect(java.util.stream.Collectors.toList());
    }

    private RoleDTO toDTO(Role role) {
        RoleDTO dto = new RoleDTO();
        dto.setId(role.getId());
        dto.setNom(role.getNom());
        dto.setDescription(role.getDescription());
        dto.setPermissions(role.getPermissions().stream()
            .map(Permission::getNom)
            .collect(Collectors.toSet()));
        return dto;
    }
}

