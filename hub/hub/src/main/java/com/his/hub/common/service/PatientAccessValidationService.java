package com.his.hub.common.service;

import com.his.hub.authentication.dao.UtilisateurRepository;
import com.his.hub.common.exception.ResourceNotFoundException;
import com.his.hub.patient.dao.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
@RequiredArgsConstructor
public class PatientAccessValidationService {

    private final UtilisateurRepository utilisateurRepository;
    private final PatientRepository patientRepository;

    
    public void validatePatientAccess(Long patientId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResourceNotFoundException("Non authentifié");
        }

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        boolean isPatient = authorities.stream()
            .anyMatch(auth -> auth.getAuthority().equals("ROLE_PATIENT"));

        
        if (isPatient) {
            String username = authentication.getName();
            Long utilisateurId = utilisateurRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"))
                .getId();

            Long authenticatedPatientId = patientRepository.findByUtilisateurId(utilisateurId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient non trouvé pour cet utilisateur"))
                .getId();

            if (!authenticatedPatientId.equals(patientId)) {
                throw new ResourceNotFoundException("Accès refusé : vous ne pouvez accéder qu'à vos propres données");
            }
        }
        
    }

    
    public Long getAuthenticatedPatientId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        boolean isPatient = authorities.stream()
            .anyMatch(auth -> auth.getAuthority().equals("ROLE_PATIENT"));

        if (isPatient) {
            String username = authentication.getName();
            Long utilisateurId = utilisateurRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé"))
                .getId();

            return patientRepository.findByUtilisateurId(utilisateurId)
                .map(patient -> patient.getId())
                .orElse(null);
        }

        return null;
    }
}

