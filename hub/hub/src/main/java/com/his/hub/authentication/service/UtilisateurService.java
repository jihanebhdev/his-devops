package com.his.hub.authentication.service;

import com.his.hub.authentication.dao.RoleRepository;
import com.his.hub.authentication.dao.UtilisateurRepository;
import com.his.hub.authentication.dto.CreateUtilisateurRequest;
import com.his.hub.authentication.dto.UtilisateurDTO;
import com.his.hub.authentication.entity.Role;
import com.his.hub.authentication.entity.Utilisateur;
import com.his.hub.common.exception.BusinessException;
import com.his.hub.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UtilisateurDTO creerUtilisateur(CreateUtilisateurRequest request) {
        if (utilisateurRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("Le nom d'utilisateur existe déjà");
        }
        if (request.getEmail() != null && utilisateurRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("L'email existe déjà");
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setUsername(request.getUsername());
        utilisateur.setPassword(passwordEncoder.encode(request.getPassword()));
        utilisateur.setNom(request.getNom());
        utilisateur.setPrenom(request.getPrenom());
        utilisateur.setEmail(request.getEmail());
        utilisateur.setTelephone(request.getTelephone());
        utilisateur.setActif(true);

        if (request.getRoleIds() != null && !request.getRoleIds().isEmpty()) {
            Set<Role> roles = request.getRoleIds().stream()
                .map(roleId -> roleRepository.findById(roleId)
                    .orElseThrow(() -> new ResourceNotFoundException("Role non trouvé avec l'ID: " + roleId)))
                .collect(Collectors.toSet());
            utilisateur.setRoles(roles);
        }

        Utilisateur saved = utilisateurRepository.save(utilisateur);
        return toDTO(saved);
    }

    public UtilisateurDTO modifierUtilisateur(Long id, CreateUtilisateurRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'ID: " + id));

        if (!utilisateur.getUsername().equals(request.getUsername()) && 
            utilisateurRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("Le nom d'utilisateur existe déjà");
        }

        utilisateur.setUsername(request.getUsername());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            utilisateur.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        utilisateur.setNom(request.getNom());
        utilisateur.setPrenom(request.getPrenom());
        utilisateur.setEmail(request.getEmail());
        utilisateur.setTelephone(request.getTelephone());

        if (request.getRoleIds() != null) {
            Set<Role> roles = request.getRoleIds().stream()
                .map(roleId -> roleRepository.findById(roleId)
                    .orElseThrow(() -> new ResourceNotFoundException("Role non trouvé avec l'ID: " + roleId)))
                .collect(Collectors.toSet());
            utilisateur.setRoles(roles);
        }

        Utilisateur saved = utilisateurRepository.save(utilisateur);
        return toDTO(saved);
    }

    public void supprimerUtilisateur(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'ID: " + id));
        utilisateurRepository.delete(utilisateur);
    }

    @Transactional(readOnly = true)
    public UtilisateurDTO getUtilisateurById(Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec l'ID: " + id));
        return toDTO(utilisateur);
    }

    @Transactional(readOnly = true)
    public java.util.List<UtilisateurDTO> getAllUtilisateurs() {
        return utilisateurRepository.findAll().stream()
            .map(this::toDTO)
            .collect(java.util.stream.Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UtilisateurDTO getUtilisateurByUsername(String username) {
        Utilisateur utilisateur = utilisateurRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé avec le nom d'utilisateur: " + username));
        return toDTO(utilisateur);
    }

    
    public UtilisateurDTO updateProfile(String username, com.his.hub.authentication.dto.UpdateProfileRequest request) {
        Utilisateur utilisateur = utilisateurRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"));

        if (request.getNom() != null && !request.getNom().isBlank()) {
            utilisateur.setNom(request.getNom());
        }
        if (request.getPrenom() != null && !request.getPrenom().isBlank()) {
            utilisateur.setPrenom(request.getPrenom());
        }
        if (request.getEmail() != null) {
            
            if (!request.getEmail().equals(utilisateur.getEmail()) && 
                utilisateurRepository.existsByEmail(request.getEmail())) {
                throw new BusinessException("Cet email est déjà utilisé par un autre utilisateur");
            }
            utilisateur.setEmail(request.getEmail());
        }
        if (request.getTelephone() != null) {
            utilisateur.setTelephone(request.getTelephone());
        }

        Utilisateur saved = utilisateurRepository.save(utilisateur);
        return toDTO(saved);
    }

    
    @Transactional(readOnly = true)
    public java.util.List<UtilisateurDTO> getUtilisateursByRole(String roleName) {
        return utilisateurRepository.findAll().stream()
            .filter(u -> u.getRoles().stream().anyMatch(r -> r.getNom().equals(roleName)))
            .map(this::toDTO)
            .collect(java.util.stream.Collectors.toList());
    }

    private UtilisateurDTO toDTO(Utilisateur utilisateur) {
        UtilisateurDTO dto = new UtilisateurDTO();
        dto.setId(utilisateur.getId());
        dto.setUsername(utilisateur.getUsername());
        dto.setNom(utilisateur.getNom());
        dto.setPrenom(utilisateur.getPrenom());
        dto.setEmail(utilisateur.getEmail());
        dto.setTelephone(utilisateur.getTelephone());
        dto.setActif(utilisateur.getActif());
        dto.setRoles(utilisateur.getRoles().stream()
            .map(Role::getNom)
            .collect(Collectors.toSet()));
        dto.setDateCreation(utilisateur.getDateCreation());
        dto.setDateModification(utilisateur.getDateModification());
        return dto;
    }
}

